import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardDialogAngelBox from './DashboardDialogAngelBox';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  angelContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    width: '19%',
    marginBottom: '30px',
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
  avatarResize: {
    width: '120px',
    height: '120px',
    cursor: 'pointer',
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
  icon: {
    paddingRight: '10px',
    cursor: 'pointer',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const DashboardAngelsList = ({ angels }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (angels === undefined) return null;

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Grid>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table aria-label='Angels List'>
            <TableHead>
              <TableRow>
                <TableCell align={'left'}>Name</TableCell>
                <TableCell align={'left'}>Location</TableCell>
                <TableCell align={'left'}>Phone Number</TableCell>
                <TableCell align={'left'}>Email</TableCell>

                <TableCell align={'left'}>Bio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {angels.map((angel, idx) => (
                <DashboardDialogAngelBox
                  key={idx}
                  angel={angel}
                  angels={angels}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[1, 5, 25]}
          component='div'
          count={angels.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Grid>
  );
};

export default DashboardAngelsList;
