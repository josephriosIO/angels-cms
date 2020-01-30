import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink, Link } from 'react-router-dom';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

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
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(0.5, 0.5),
    textDecoration: 'none',
    fontSize: '.9rem',
    color: 'black',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const {
    user,
    getTokenSilently,
    logout,
    loginWithRedirect,
    isAuthenticated,
    loading,
  } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // const result = await axios('/api/auth/createOrGetStartup');
    };
    fetchData();
  }, []);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='static'
      color='default'
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <Typography
          variant='subtitle2'
          color='inherit'
          noWrap
          className={classes.toolbarTitle}
        >
          {isAuthenticated ? (
            <NavLink
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/startups/dashboard`}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <span>Startups</span>
                <span>
                  <AllInclusiveIcon />
                </span>
              </div>
            </NavLink>
          ) : (
            <NavLink
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/startups}`}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <span>Startups</span>
                <span>
                  <AllInclusiveIcon
                    style={{ marginLeft: '3px', fontSize: '1rem' }}
                  />
                </span>
              </div>
            </NavLink>
          )}
        </Typography>
        <nav></nav>
        {isAuthenticated ? (
          <>
            <Menu
              id='menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled className={classes.userNameTitle}>
                Welcome {user.name}!
              </MenuItem>
              <div style={{ display: 'flex', flexFlow: 'column' }}>
                <Link
                  style={{ textDecoration: 'none', color: 'black' }}
                  className={classes.link}
                  to={`/startups/profile/${user.sub}`}
                >
                  <MenuItem>Profile</MenuItem>
                </Link>
                <p
                  className={classes.link}
                  onClick={() =>
                    logout({
                      returnTo: window.location.origin.toString(),
                    })
                  }
                >
                  <MenuItem>Logout</MenuItem>
                </p>
              </div>
            </Menu>

            <Avatar
              style={{ cursor: 'pointer' }}
              aria-describedby={id}
              onClick={handleClick}
              src={user.picture}
              alt={user.name}
            />
          </>
        ) : (
          <p className={classes.link} onClick={() => loginWithRedirect({})}>
            Login
          </p>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
