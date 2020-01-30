import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Error from '../../Errors/Error';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  fullEmptyScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
  },
}));

const AngelInvite = props => {
  const [consumed, setConsumed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const classes = useStyles();
  const { isAuthenticated, loginWithPopup, getTokenSilently } = useAuth0();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (isAuthenticated && count < 1) {
    async function doInviteThings() {
      if (!consumed && !failed) {
        try {
          const token = await getTokenSilently();
          await axios('/api/auth/createOrGetUser', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const urlPath = props.location.pathname;
          const invite = urlPath.slice(8);
          const invited = await axios.post(
            '/api/user/consumeInvite',
            {
              invite,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (invited) {
            return setConsumed(true);
          }
        } catch (err) {
          console.error(err);
          setFailed(true);
          setErrorMsg(
            'invite has been used or is invalid. Please ask admin for new invite link.',
          );
          setErrorStatus('error');
          handleClick();
          setCount(count + 1);
        }
      }
    }
    doInviteThings();
  }
  if (consumed) {
    return <Redirect to='/angels' />;
  }

  if (!consumed) {
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
          <Error
            onClose={handleClose}
            variant={errorStatus}
            message={errorMsg}
          />
        </Snackbar>
        <div className={`empty ${classes.fullEmptyScreen}`}>
          <div>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>
              You been invited to the J-Venture community!
            </p>
            <p className='empty-subtitle'>
              Please login to get your memebership invitation accepted.
            </p>
            <button onClick={() => loginWithPopup({})}>Login</button>
          </div>
        </div>
      </>
    );
  }

  return <Redirect to='/angels' />;
};
export default AngelInvite;
