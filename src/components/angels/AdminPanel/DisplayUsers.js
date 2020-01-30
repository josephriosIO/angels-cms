import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  infoHolder: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid black',
  },
  userInfo: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameStyle: {
    marginBottom: '15px',
  },
  flex: {
    display: 'flex',
    flexFlow: 'column',
  },
}));

const DisplayUsers = props => {
  const classes = useStyles();
  const { user, callErrors } = props;
  const [state, setState] = useState({
    admin: false,
    angel: false,
  });
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();
      const usersRoles = await axios(`/api/admin/getroles/${user.authId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState({
        admin: usersRoles?.data?.ADMIN,
        angel: usersRoles?.data?.ANGEL,
      });
    };
    fetchData();
  }, [user.authId]);

  const { admin, angel } = state;

  const handleChangeAdmin = async e => {
    const token = await getTokenSilently();
    setState({ ...state, admin: !admin });
    await axios(`/api/admin/add/adminrole/user/${user.authId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    callErrors(!admin);
  };

  const handleChangeAngel = async e => {
    const token = await getTokenSilently();
    setState({ ...state, angel: !angel });
    await axios(`/api/admin/add/angelrole/user/${user.authId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    callErrors(!angel);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.infoHolder}>
          <Typography>
            <div className={classes.avatarContainer}>
              <Avatar src={user.profileImg} alt={user.name} />
              <p className={classes.usernameStyle}>{user.name}</p>
            </div>
          </Typography>

          <div className={classes.userInfo}>
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className={classes.userInfo}>
            <label>Location:</label>
            <p>{`${user.location === '' ? 'N/A' : user.location}`}</p>
          </div>

          <div className={classes.flex}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => handleChangeAdmin(e)}
                  name='admin'
                  checked={admin}
                  value='admin'
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
              }
              label='Admin'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={angel}
                  onChange={e => handleChangeAngel(e)}
                  name='angel'
                  value='angel'
                  color='primary'
                  inputProps={{
                    'aria-label': 'secondary checkbox',
                  }}
                />
              }
              label='Angel'
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default DisplayUsers;
