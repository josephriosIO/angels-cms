import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VotingSystem from './VotingSystem/VotingSystem';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  row: {
    padding: '16px 16px 0',
    height: '150px',
    margin: '20px 0',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '-.02em',
    wordSpacing: '.1em',
  },
  date: {
    stroke: 'transparent',
    color: 'grey',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '-.02em',
    wordSpacing: '.1em',
    textTransform: 'uppercase',
  },
  startupView: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  startupLevel: {
    marginRight: '5px',
    color: '#000',
    '&:visited': {
      color: '#000',
    },
  },
  topContent: {
    display: 'flex',
    alignItems: 'normal',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'column',
    },
  },
  dateAndTitle: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'row',
    },
  },
  voteBtn: {
    color: '#000',
    cursor: 'pointer',
    backgroundColor: 'none',
    borderColor: '#eee',
    borderWidth: 0,
  },
  itemHolder: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'row',
    },
  },
  startups: {
    display: 'flex',
    flexFlow: 'column',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '0',
    },
  },
  titleForStartups: {
    fontWeight: 'bold',
    marginLeft: '40px',
    marginTop: '25px',
    [theme.breakpoints.down('sm')]: {
      margin: '0',
      fontSize: '14px',
    },
  },
  checkVotesLink: {
    color: '#000',
    '&:visited': {
      color: '#000',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '5px',
    },
  },
  bottomContent: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
  },
}));

const MeetingPanel = ({ users, roles }) => {
  const [vote, setVote] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const classes = useStyles();
  const d = new Date(users.date);
  const [open, setOpen] = React.useState(false);
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = users.date;
        const token = await getTokenSilently();
        const result = await axios.post(
          '/api/user/canvote',
          { date },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setVote(result.data);
      } catch (err) {
        console.log(err);
        setIsVoting(false);
      }
    };
    fetchData();
  }, [users, getTokenSilently]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };

  return (
    <div>
      {isVoting ? (
        <VotingSystem users={users} />
      ) : (
        <div key={d}>
          <Dialog
            fullWidth
            onClose={handleClose}
            aria-labelledby='simple-dialog-title'
            open={open}
          >
            <VotingSystem users={users} />
          </Dialog>
          <Paper elevation={3} className={classes.row}>
            <div className={classes.topContent}>
              <div className={classes.dateAndTitle}>
                <div>
                  <span className={classes.date}>{d.toDateString()}</span>
                  <div className={classes.title}>{users.title}</div>
                </div>
              </div>
              <div className={classes.startups}>
                <span className={classes.titleForStartups}>
                  Startups In Meeting:
                </span>
                <div className={classes.startupView}>
                  {users.startups.map((startup, idx) => (
                    <div key={idx}>
                      <a
                        rel='noopener noreferrer'
                        target='_blank'
                        href={startup.website}
                        className={classes.startupLevel}
                      >
                        {startup.companyName},
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className={classes.bottomContent}>
                <div className={classes.itemHolder}>
                  {roles.ADMIN && !vote ? (
                    <Link
                      to={`/angels/editmeeting/${users.meetingId}`}
                      className={classes.checkVotesLink}
                    >
                      Edit
                    </Link>
                  ) : null}

                  {roles.ADMIN && vote ? (
                    <Tooltip title='View Votes' arrow placement='left'>
                      <Link
                        to={{
                          pathname: `/angels/meeting/${users.meetingId}`,
                          meeting: { id: users.meetingId },
                        }}
                        className={classes.checkVotesLink}
                      >
                        <VisibilityIcon />
                      </Link>
                    </Tooltip>
                  ) : null}
                  {vote && (
                    <Tooltip
                      title='Vote'
                      arrow
                      placement='left'
                      className={classes.voteBtn}
                      onClick={handleClickOpen}
                    >
                      <HowToVoteIcon />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default MeetingPanel;
