import React, { useState, useEffect, useRef } from 'react';
import DisplayUsers from './DisplayUsers';
import Error from '../../Errors/Error';
import SearchBar from '../HelperComponents/SearchBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../../../react-auth0-spa';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  header: {
    borderBottom: '1px solid #e7e9eb',
    padding: '30px 0',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      flexFlow: 'column',
    },
  },
  tableWrapper: {
    overflowX: 'auto',
    height: '80%',
	},
	createAStartup: {
		color: '#000 !important'
	},
  headerInvite: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
    marginTop: '25px',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginTop: '10px',
      flexFlow: 'row',
    },
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      maxWidth: '988px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingLeft: '14px',
      paddingRight: '14px',
    },
  },
  flexInvite: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      flexFlow: 'row',
    },
  },
  body: {
    display: 'flex',
    flexFlow: 'column',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      flexFlow: 'column',
    },
  },
  textArea: {
    width: '170px',
    height: '50px',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '320px',
      height: '30px',
    },
  },
}));

const AdminPage = props => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [filter, setFilter] = useState([]);
  const [users, setUsers] = useState(undefined);
  const [invite, setInvite] = useState(undefined);
  const classes = useStyles();
  const url = window.location.href;
  const urlArr = url.split('/');
  const domain = urlArr[0] + '//' + urlArr[2];
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { getTokenSilently } = useAuth0();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');

    e.target.blur();

    setCopySuccess('Copied!');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();
        const result = await axios('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const createdInvite = await axios('/api/admin/createinvite', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInvite(createdInvite.data);

        if (result) {
          setUsers(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [getTokenSilently]);

  if (users === undefined || invite === undefined)
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const search = e => {
    const filteredUsers = users.filter(user => {
      if (user.name.toLowerCase().includes(e.target.value)) {
        return user;
      }

      return null;
    });

    setFilter(filteredUsers);
  };

  const callErrors = boolean => {
    if (boolean) {
      setErrorMsg('Saved Data.');
      setErrorStatus('success');
      handleClick();
    } else {
      setErrorMsg('Removed Role.');
      setErrorStatus('success');
      handleClick();
    }
  };

  const removeUserById = async (user, removed) => {
    const token = await getTokenSilently();
    await axios.delete(`/api/admin/deleteuser/${user.authId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (removed) {
      const index = users.indexOf(user);
      if (index > -1) {
        users.splice(index, 1);
      }
      setUsers([...users]);
      setErrorMsg('User Deleted from list.');
      setErrorStatus('success');
      handleClick();
    }
  };


  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Error onClose={handleClose} variant={errorStatus} message={errorMsg} />
      </Snackbar>

      <CssBaseline />
      <div className={classes.layout}>
        <div className={classes.header}>
          <Typography variant='h6'>Admin Panel</Typography>
          <div className={classes.headerInvite}>
            <Typography variant='subtitle2'>Invite Link</Typography>
            <div className={classes.flexInvite}>
              <textarea
                readOnly
                className={classes.textArea}
                style={{ resize: 'none' }}
                ref={textAreaRef}
                value={`${domain}/invite/${invite.value}`}
              />

              <Button onClick={copyToClipboard}>
                {copySuccess ? copySuccess : 'Copy'}
              </Button>
            </div>
          </div>
					<div className={classes.headerInvite}>
						<Link className={classes.createAStartup} to={`/community/admin/create-startup`}>
							<span>Create Startup</span>
						</Link>
					</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <SearchBar search={search} title={'Name'} />
        </div>

        <div className={classes.body}>
          <div>
            <div className={classes.tableWrapper}>
              {filter.length > 0
                ? filter
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(user => (
                      <DisplayUsers
                        key={user.authId}
                        callErrors={callErrors}
                        user={user}
                        removeUserById={removeUserById}
                      />
                    ))
                : users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(user => (
                      <DisplayUsers
                        key={user.authId}
                        callErrors={callErrors}
                        user={user}
                        removeUserById={removeUserById}
                      />
                    ))}
            </div>
            <TablePagination
              rowsPerPageOptions={[1, 5, 10]}
              component='div'
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
