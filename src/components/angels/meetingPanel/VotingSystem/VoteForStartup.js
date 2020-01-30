import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'flex-start',
    padding: '15px',
    justifyContent: 'space-around',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'column',
      alignItems: 'center',
      padding: '0',
      justifyContent: 'center',
    },
  },
}));

const VoteForStartup = ({
  startup,
  setUserVotesToState,
  userDisabled,
  groupDisabled,
  setGroupVotesToState,
}) => {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.container}>
      <Typography variant='subtitle1' gutterBottom>
        {startup.companyName}
      </Typography>
      <Button
        style={{ marginBottom: '10px' }}
        variant='contained'
        disabled={userDisabled}
        onClick={() => setUserVotesToState(1, startup)}
      >
        Personal vote
      </Button>
      <Button
        style={{ marginBottom: '10px' }}
        variant='contained'
        disabled={groupDisabled}
        onClick={() => setGroupVotesToState(1, startup)}
      >
        Community vote
      </Button>
    </Paper>
  );
};

export default VoteForStartup;
