import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
  cellTable: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));

const DashboardTable = ({ angel, angelInfo }) => {
  const classes = useStyles();

  return (
    <>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          <Avatar
            style={{ marginRight: '10px' }}
            src={angel?.profileImg}
            alt={angel?.name}
          />
          {angel?.name}
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {angelInfo?.location ? angelInfo.location : 'N/A'}
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {' '}
          {angelInfo?.phoneNumber ? angelInfo.phoneNumber : 'N/A'}
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {angel?.email ? angel.email : 'N/A'}
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {angelInfo?.bio ? angelInfo.bio : 'N/A'}
        </div>
      </TableCell>
    </>
  );
};

export default DashboardTable;
