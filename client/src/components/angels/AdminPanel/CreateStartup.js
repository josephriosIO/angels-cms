import React, { useState } from 'react';
import Error from '../../Errors/Error';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { useAuth0 } from '../../../react-auth0-spa';

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
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
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

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmits = async event => {
    event.preventDefault();
    if (
      form?.companyName === '' ||
      form?.location === '' ||
      form?.phoneNumber === '' ||
      form?.missionStatement === '' ||
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
      await axios.post(
        `/api/admin/create-startup`,
        { form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setErrorMsg(`Saved. Redirecting to startups in 3 seconds.`);
      setErrorStatus('success');
      handleClick();
      setTimeout(function() {
        setReload(true);
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('error.');
      setErrorStatus('error');
      handleClick();
    }
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (reload) {
    return <Redirect to='/community/startups' />;
  }

  return (
    <div>
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
              <label>Company Name</label>
              <TextField
                value={form.companyName}
                onChange={e => onChange(e)}
                name='companyName'
              />
            </div>
            <div className={classes.flex}>
              <label>Founder's Email</label>
              <TextField
                value={form.email}
                onChange={e => onChange(e)}
                name='email'
              />
            </div>
            <div className={classes.flex}>
              <label>Company Website</label>
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
                >
                  Submit
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
