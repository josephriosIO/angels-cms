import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardTable from './DashboardTable';

const useStyles = makeStyles(theme => ({
  angelContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    width: '30%',
    marginBottom: '30px',
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
  avatarResize: {
    width: '200px',
    height: '190px',
    [theme.breakpoints.down('md')]: {
      width: '120px',
      height: '120px',
    },
  },
  angelsList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexFlow: 'wrap',
  },
}));

const DashboardAngels = ({ angels }) => {
  const classes = useStyles();

  if (angels === undefined) return null;

  return (
    <div className={classes.angelsList}>
      {angels.map((angel, idx) => (
        <DashboardTable key={idx} angel={angel} angels={angels} />
      ))}
    </div>
  );
};

export default DashboardAngels;
