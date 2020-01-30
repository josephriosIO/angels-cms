import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'companyName', align: 'left', label: 'Company Name', minWidth: 170 },
  { id: 'location', align: 'left', label: 'Location', minWidth: 100 },
  {
    id: 'website',
    label: 'Website',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
  {
    id: 'companySize',
    label: '# of Employees',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
  {
    id: 'missionStatement',
    label: 'Mission Statement',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
];

const useStyles = makeStyles(theme => ({
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
    backgroundColor: '#fafafa',
  },
  cellTable: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  addBtn: {
    width: '100px',
    height: '55px',
    fontSize: '16px',
    textTransform: 'uppercase',
    color: '#000',
    background: '#eee !',
    border: '1px solid #000',
    cursor: 'pointer',

    '&:disabled': {
      background: '#d3d3d3 !important',
      cursor: 'default',
      border: '0',
    },
  },
}));

const StartupDataTable = props => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { users } = props;
  const classes = useStyles();

  const isDisabled = id => {
    if (props.isAdded) {
      const ids = props.isAdded.map(startups => startups.id);

      if (ids.includes(id)) {
        return true;
      }

      return false;
    }
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Grid>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <TableRow tabIndex={-1} key={row.id}>
                  {columns.map(column => {
                    let value = row[column.id];

                    if (value === '' || value === null) {
                      value = 'N/A';
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        <div className={classes.cellTable}>{value}</div>
                      </TableCell>
                    );
                  })}

                  {props.callback ? (
                    <button
                      className={classes.addBtn}
                      disabled={isDisabled(row.id)}
                      onClick={() => props.callback(row)}
                    >
                      add
                    </button>
                  ) : null}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[1, 5, 25]}
        component='div'
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default StartupDataTable;
