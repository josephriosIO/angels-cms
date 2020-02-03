import React, { useEffect, useState } from 'react';
import AllStartupsViewTable from './AllStartupsViewTable';
import Error from '../../Errors/Error';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#5ebeeb',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

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
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },

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
  indicator: {
    backgroundColor: '#000',
  },
  padding: {
    padding: '30px',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
  },
}));

const AllStartupsView = ({ userRoles }) => {
  const [users, setUsers] = useState(undefined);
  const [archivedStartups, setArchivedStartups] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();
        if (userRoles.ADMIN) {
          const result = await axios('/api/admin/allstartups', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const users = await axios('/api/admin/archivedstartups', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUsers(result.data);
          setArchivedStartups(users.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [getTokenSilently, userRoles]);

  if (userRoles === undefined) return null;

  const handleClick = () => {
    setOpen(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const archive = async (startup, archieved) => {
    const token = await getTokenSilently();
    await axios(`/api/admin/archivestartup/${startup.authId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const index = users.indexOf(startup);
    if (index > -1) {
      users.splice(index, 1);
    }
    if (!archieved) {
      setUsers([...users]);
      setArchivedStartups([...archivedStartups, startup]);
      setErrorMsg('Startup archived.');
      setErrorStatus('success');
      handleClick();
    } else {
      const index = archivedStartups.indexOf(startup);
      if (index > -1) {
        archivedStartups.splice(index, 1);
      }
      setArchivedStartups([...archivedStartups]);
      setUsers([...users, startup]);
      setErrorMsg('Startup unarchived.');
      setErrorStatus('success');
      handleClick();
    }

    return;
  };

  const removeStartupById = async (startup, removed) => {
    const token = await getTokenSilently();
    await axios.delete(`/api/admin/deletestartup/${startup.authId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (removed) {
      const index = users.indexOf(startup);
      if (index > -1) {
        users.splice(index, 1);
      }
      setUsers([...users]);
      setErrorMsg('Startup Deleted from list.');
      setErrorStatus('success');
      handleClick();
    }
  };

  const vettedStartup = async (startup, vetted) => {
    const token = await getTokenSilently();
    await axios(`/api/admin/vettstartup/${startup.authId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!vetted) {
      setErrorMsg('Startup vetted.');
      setErrorStatus('success');
      handleClick();
    } else {
      setErrorMsg('Remove vet from startup.');
      setErrorStatus('success');
      handleClick();
    }

    return;
  };

  if (users === undefined) return null;

  if (users.length < 1 && archivedStartups.length < 1) {
    return (
      <div className={`empty ${classes.emptyState}`}>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>
          No startups to specially select or archive.
        </p>
        <p className='empty-title h5'>
          Please request some startups to join the platform.
        </p>
      </div>
    );
  }

  return (
    <div className={classes.padding}>
      <span>
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
      </span>
      <div style={{ padding: '20px 10px' }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label='styled tabs example'
        >
          <StyledTab label='Startups' {...a11yProps(0)} />
          <StyledTab label='Archived Startups' {...a11yProps(1)} />
        </StyledTabs>
      </div>
      <TabPanel value={value} index={0}>
        {users.length < 1 ? (
          <div className='empty'>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>
              No startups has been vetted or have all been archived.
            </p>
          </div>
        ) : (
          <div className={classes.root}>
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row, idx) => (
                        <AllStartupsViewTable
                          key={idx}
                          user={row}
                          removeStartupById={removeStartupById}
                          archived={archive}
                          vett={vettedStartup}
                        />
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
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {archivedStartups.length < 1 ? (
          <div className='empty'>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>No startups has been archived.</p>
          </div>
        ) : (
          <div>
            <div className={classes.root}>
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
                      {archivedStartups
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map(row => (
                          <AllStartupsViewTable
                            key={row.id}
                            user={row}
                            removeStartupById={removeStartupById}
                            archived={archive}
                            vett={vettedStartup}
                          />
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
            </div>
          </div>
        )}
      </TabPanel>
    </div>
  );
};

export default AllStartupsView;
