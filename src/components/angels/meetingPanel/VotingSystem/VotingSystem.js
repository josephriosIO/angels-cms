import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VoteForStartup from './VoteForStartup';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Error from '../../../Errors/Error';
import Snackbar from '@material-ui/core/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import axios from 'axios';
import { useAuth0 } from '../../../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  container: {
    padding: '16px 16px 0',
    marginBottom: '20px',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '-.02em',
    wordSpacing: '.1em',
  },
  headerContainer: {
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  header: {
    fontWeight: 'bold',
  },
  date: {
    stroke: 'transparent',
    fill: 'rgba(0,0,0,.87)',
    color: 'rgba(0,0,0,.87)',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '-.02em',
    wordSpacing: '.1em',
    textTransform: 'uppercase',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voted: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px',
  },
}));

const VotingSystem = ({ users }) => {
  const [startups, setStartups] = useState(undefined);
  const [userDisabled, setUserDisabled] = useState(false);
  const [groupdisabled, setGroupDisabled] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [userVote, setUserVote] = useState({
    userVote: 0,
    startup: undefined,
  });
  const [groupVote, setGroupVote] = useState({
    groupVote: 0,
    startup: undefined,
  });
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();
      const hasVoted = await axios(`/api/user/hasvoted/${users?.meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await axios(`/api/user/getmeeting/${users?.meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHasUserVoted(hasVoted.data);
      setStartups(result.data);
    };
    fetchData();
  }, []);

  const setUserVotesToState = (vote, startup) => {
    setUserVote({ userVote: vote, startup: startup });
    setUserDisabled(!userDisabled);
  };

  const setGroupVotesToState = (vote, startup) => {
    setGroupVote({ groupVote: vote, startup: startup });
    setGroupDisabled(!groupdisabled);
  };

  const clearUserVote = () => {
    setUserVote({});
    setUserDisabled(!userDisabled);
  };

  const clearGroupVote = () => {
    setGroupVote({});
    setGroupDisabled(!groupdisabled);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const confirmVotes = async () => {
    const votes = {
      userVote,
      groupVote,
    };
    if (userVote.startup === undefined || groupVote.startup === undefined) {
      setErrorMsg('Please vote for personal and community.');
      setErrorStatus('error');
      handleClick();
      return;
    }

    try {
      const token = await getTokenSilently();
      await axios.post(
        `/api/user/voteonmeeting/${users?.meetingId}`,
        { votes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHasUserVoted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (hasUserVoted) {
    return (
      <div className='empty' style={{ marginBottom: '10px' }}>
        <div className='empty-icon'>
          <i class='fas fa-vote-yea'></i>
        </div>
        <p className='empty-title h5'>Thanks for voting!</p>
      </div>
    );
  }

  return (
    <>
      {startups !== undefined ? (
        <div className={classes.container}>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Error
              onClose={handleClose}
              variant={errorStatus}
              message={errorMsg}
            />
          </Snackbar>
          <DialogTitle id='form-dialog-title'>Vote</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Pick a personal startup you would like to invest in as well as a
              startup you would like the community to invest!
            </DialogContentText>
          </DialogContent>
          <div className={classes.voted}>
            {userVote?.startup?.companyName ? (
              <div style={{ marginBottom: '10px' }}>
                Personal Vote:{' '}
                <Chip
                  label={userVote.startup.companyName}
                  onClick={clearUserVote}
                  onDelete={clearUserVote}
                />
              </div>
            ) : null}
            {groupVote?.startup?.companyName ? (
              <div style={{ marginBottom: '10px' }}>
                Community Vote:{' '}
                <Chip
                  label={groupVote.startup.companyName}
                  onClick={clearGroupVote}
                  onDelete={clearGroupVote}
                />
              </div>
            ) : null}
          </div>
          <div>
            <div className={classes.headerContainer}>
              <span className={classes.header}>List of Startups</span>
            </div>

            {startups.startups.map(startup => (
              <VoteForStartup
                key={startup.id}
                userDisabled={userDisabled}
                groupDisabled={groupdisabled}
                setGroupVotesToState={setGroupVotesToState}
                setUserVotesToState={setUserVotesToState}
                startup={startup}
              />
            ))}
          </div>

          <ListItem className={classes.center}>
            <Button onClick={confirmVotes}>Submit Votes</Button>
          </ListItem>
        </div>
      ) : null}
    </>
  );
};

export default VotingSystem;
