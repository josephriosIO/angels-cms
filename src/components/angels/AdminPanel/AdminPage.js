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
import { useAuth0 } from '../../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
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
  const [users, setUsers] = useState([]);
  const [invite, setInvite] = useState({});
  const classes = useStyles();
  const url = window.location.href;
  const urlArr = url.split('/');
  const domain = urlArr[0] + '//' + urlArr[2];
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { loading, user, getTokenSilently } = useAuth0();

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
    };
    fetchData();
  }, []);

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
                        key={user.id}
                        callErrors={callErrors}
                        user={user}
                      />
                    ))
                : users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(user => (
                      <DisplayUsers
                        key={user.id}
                        callErrors={callErrors}
                        user={user}
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
