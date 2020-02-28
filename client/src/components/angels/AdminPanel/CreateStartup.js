import React, { useState, useEffect, useRef } from 'react';
import Error from '../../Errors/Error';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { useAuth0 } from '../../../react-auth0-spa';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';

const employeesValues = [
  '0 - 10',
  '11 - 50',
  '51 - 200',
  '201 - 500',
  '501 - 1000',
  '1000+',
];

const useStyles = makeStyles(theme => ({
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

  flex: {
    display: 'flex',
    flexFlow: 'column',
    marginBottom: '10px',
    padding: '0 20px',
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '30px 0',
    padding: '0 20px',
  },
  header: {
    background: '#eee',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  formContainer: {
    border: '1px solid #e7e9eb',
    padding: '28px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '100px',
  },
}));

const CreateStartup = () => {
  const url = window.location.href;
  const urlArr = url.split('/');
  const domain = urlArr[0] + '//' + urlArr[2];
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState('');
  const textAreaRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [reload, setReload] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    location: '',
    missionStatement: '',
    phoneNumber: '',
    companySize: 0,
    funded: false,
    website: '',
    email: '',
  });
  const { getTokenSilently } = useAuth0();
  const subject = `Finish Startup profile`;
  const body = `Hello! \n Here's the link to create your account and fill out the remaining profile infomation. \n ${`${domain}/startuplogin/${inviteCode}`} \n If you have any questions feel free to email me back \n Thank you!`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorMsg('Please remember to send the link to the founder.');
        setErrorStatus('info');
        handleClick();
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenDialog(false);
  };

  const handleSubmits = async event => {
    event.preventDefault();
    if (
      form?.companyName === '' ||
      form?.website === '' ||
      form?.email === ''
    ) {
      setErrorMsg('Form not completed.');
      setErrorStatus('error');
      handleClick();
      return;
    }
    try {
      const token = await getTokenSilently();
      const code = await axios.post(
        `/api/admin/create-startup`,
        { form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setInviteCode(code.data);
      handleClickDialog();
    } catch (err) {
      console.error(err);
      setErrorMsg('error.');
      setErrorStatus('error');
      handleClick();
    }
  };

  const redirectBack = () => {
    setErrorMsg(`Saved. Redirecting to admin page in 3 seconds.`);
    setErrorStatus('success');
    handleClickDialog();
    setTimeout(function() {
      setReload(true);
    }, 3000);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (reload) {
    return <Redirect to='/community/admin' />;
  }

  return (
    <div>
      <Dialog
        fullWidth
        onClose={handleCloseDialog}
        aria-labelledby='simple-dialog-title'
        open={openDialog}
        className={classes.dialog}
      >
        <List>
          <ListItem
            disableGutters
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              margin: '0 -10px',
              padding: 0,
            }}
          >
            <i
              onClick={handleClickDialog}
              className={`fas fa-times fa-lg ${classes.icon}`}
            ></i>
          </ListItem>
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              flexFlow: 'column',
            }}
          >
            <Button
              type='primary'
              color='primary'
              href={`mailto:${form.email}?subject=${subject}&body=${body}`}
              target='_blank'
            >
              Email Founder Link
            </Button>

            <Button onClick={() => redirectBack()}>Return to Admin Page</Button>
          </div>
        </List>
      </Dialog>
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
      <div className={classes.header}>
        <h2 style={{ fontSize: '1rem' }}>Create a Startup</h2>
      </div>
      <div className={classes.layout}>
        <div className={classes.formContainer}>
          <form>
            <div className={classes.flex}>
              <span>
                <label>Company Name</label>
                {'    '}
                <label style={{ color: 'red' }}>(Required)</label>
              </span>
              <TextField
                value={form.companyName}
                onChange={e => onChange(e)}
                name='companyName'
              />
            </div>
            <div className={classes.flex}>
              <span>
                <label>Founder's Email</label>
                {'    '}
                <label style={{ color: 'red' }}>(Required)</label>
              </span>
              <TextField
                value={form.email}
                onChange={e => onChange(e)}
                name='email'
              />
            </div>
            <div className={classes.flex}>
              <span>
                <label>Company Website</label>
                {'    '}
                <label style={{ color: 'red' }}>(Required)</label>
              </span>

              <TextField
                value={form.website}
                onChange={e => onChange(e)}
                name='website'
              />
            </div>
            <div className={classes.flex}>
              <label>Phone Number</label>
              <TextField
                type='number'
                value={form.phoneNumber}
                onChange={e => onChange(e)}
                name='phoneNumber'
              />
            </div>
            <div className={classes.flex}>
              <label>Location</label>
              <TextField
                value={form.location}
                onChange={e => onChange(e)}
                name='location'
              />
            </div>
            <div className={classes.flex}>
              <label># of Employees</label>
              <TextField
                value={form.companySize}
                onChange={e => onChange(e)}
                name='companySize'
                select
              >
                {employeesValues.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className={classes.flex}>
              <label>
                What is the company's mission statement if not known leave
                blank.
              </label>
              <TextField
                value={form.missionStatement}
                onChange={e => onChange(e)}
                name='missionStatement'
                multiline
                rows='4'
                variant='outlined'
              />
            </div>
            <div className={classes.btn}>
              <div>
                <Button
                  onClick={e => handleSubmits(e)}
                  variant='contained'
                  color='primary'
                  ref={textAreaRef}
                >
                  Submit and copy founders login link
                </Button>
              </div>
            </div>
          </form>
        </div>
        <footer className={classes.footer}>
          <p>
            Powered by <a href='https://reshuffle.com'>Reshuffle</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateStartup;
