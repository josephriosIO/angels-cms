import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';
import { useConfirm } from 'material-ui-confirm';

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
  const { user, callErrors, removeUserById } = props;
  const [state, setState] = useState({
    admin: false,
    angel: false,
  });
  const { getTokenSilently } = useAuth0();
  const confirm = useConfirm();

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
  }, [user.authId, getTokenSilently]);

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
  
  const removeUser = async () => {
    try {
      await confirm({
        description: `This will permanently delete ${user.name} as a User.`,
      });
      const deleted = true;
      removeUserById(user, deleted);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.infoHolder}>
          <div className={classes.avatarContainer}>
            <Avatar src={user.profileImg} alt={user.name} />
            <Typography className={classes.usernameStyle}>
              {' '}
              {user.name}{' '}
            </Typography>
          </div>

          <div className={classes.userInfo}>
            <label>Email:</label>
            <p>{user.email}</p>
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
              label='Community Member'
            />
          </div>
          <div>
            <button onClick={removeUser}>
              Delete User
            </button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}; // not

export default DisplayUsers;
