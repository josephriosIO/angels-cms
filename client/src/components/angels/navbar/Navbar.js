import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '../../../react-auth0-spa';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 240;

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
    justifyContent: 'space-between',
    paddingLeft: '16px',
    [theme.breakpoints.up('md')]: {
      paddingRight: '16px',
    },
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  logo: {
    color: 'black',
    display: 'flex',
    alignItems: 'baseline',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '16px',
    },
  },
  link: {
    margin: theme.spacing(0.5, 0.5),
    textDecoration: 'none',
    fontSize: '.9rem',
    color: 'black !important',
    cursor: 'pointer',
    '*:focus': {
      outline: 0,
      outline: 'none',
    },

    '&:hover': {
      textDecoration: 'none',
    },
  },
  navLinkStyle: {
    marginRight: '20px',
    textDecoration: 'none !important',
    color: 'black',
    '*:focus': {
      outline: 0,
      outline: 'none',
    },

    '&:hover': {
      textShadow: '0 0 .45px #333, 0 0 .45px #333',
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  desktopHidden: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  mobileHidden: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  userNameTitle: {
    cursor: 'default',
    '&:hover': {
      background: '#fff',
    },
    '&:active': {
      background: '#fff',
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [roles, setRoles] = useState([]);
  const {
    user,
    getTokenSilently,
    logout,
    loginWithRedirect,
    isAuthenticated,
    loading,
  } = useAuth0();

  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();
        await axios('/api/auth/createOrGetUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userRoles = await axios('/api/auth/getroles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRoles(userRoles.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [getTokenSilently]);

  if (loading || !user || roles.length < 1) {
    return null;
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sideList = side => (
    <div
      className={classes.list}
      role='presentation'
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <div>
          <ListItem button>
            <div style={{ marginTop: '1px' }}>
              <NavLink
                activeStyle={{ fontWeight: 'bold' }}
                className={`${classes.link} ${classes.navLinkStyle}`}
                exact
                to={{
                  pathname: `/community`,
                }}
              >
                Community
              </NavLink>
            </div>
          </ListItem>
          {roles?.ADMIN ? (
            <div style={{ marginTop: '1px' }}>
              <ListItem button>
                <NavLink
                  activeStyle={{ fontWeight: 'bold' }}
                  className={`${classes.link} ${classes.navLinkStyle}`}
                  exact
                  to={{
                    pathname: `/community/admin`,
                  }}
                >
                  Admin
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  activeStyle={{ fontWeight: 'bold' }}
                  className={`${classes.link} ${classes.navLinkStyle}`}
                  exact
                  to={{
                    pathname: `/community/startups`,
                  }}
                >
                  Startups
                </NavLink>
              </ListItem>
            </div>
          ) : null}
          <ListItem button>
            <NavLink
              activeStyle={{ fontWeight: 'bold' }}
              className={classes.navLinkStyle}
              to={`/community/meetings`}
            >
              <p className={classes.link}> Meetings</p>
            </NavLink>
          </ListItem>
        </div>
      </List>
    </div>
  );
  return (
    <AppBar position='static' color='default' className={classes.appBar}>
      <Toolbar className={classes.toolbar} disableGutters>
        <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
          {sideList('left')}
        </Drawer>

        <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center' }}>
          <div className={classes.logo}>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to='/community'
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span>J-Ventures </span>
                <span>
                  <AllInclusiveIcon
                    style={{ marginLeft: '3px', fontSize: '1rem' }}
                  />
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isAuthenticated ? (
            <>
              <div className={classes.mobileHidden}>
                <div style={{ marginTop: '1px' }}>
                  <NavLink
                    activeStyle={{ fontWeight: 'bold' }}
                    className={`${classes.link} ${classes.navLinkStyle}`}
                    exact
                    to={{
                      pathname: `/community`,
                    }}
                  >
                    Community
                  </NavLink>
                </div>
                {roles?.ADMIN ? (
                  <div style={{ marginTop: '1px' }}>
                    <NavLink
                      activeStyle={{ fontWeight: 'bold' }}
                      className={`${classes.link} ${classes.navLinkStyle}`}
                      exact
                      to={{
                        pathname: `/community/admin`,
                      }}
                    >
                      Admin
                    </NavLink>
                    <NavLink
                      activeStyle={{ fontWeight: 'bold' }}
                      className={`${classes.link} ${classes.navLinkStyle}`}
                      exact
                      to={{
                        pathname: `/community/startups`,
                      }}
                    >
                      Startups
                    </NavLink>
                  </div>
                ) : null}
                <NavLink
                  activeStyle={{ fontWeight: 'bold' }}
                  className={classes.navLinkStyle}
                  to={`/community/meetings`}
                >
                  <p className={classes.link}> Meetings</p>
                </NavLink>
              </div>

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
                    to={`/community/profile/${user.sub}`}
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
              <Button
                onClick={toggleDrawer('left', true)}
                className={classes.desktopHidden}
              >
                <i className='fas fa-bars'></i>
              </Button>
            </>
          ) : (
            <p className={classes.link} onClick={() => loginWithRedirect({})}>
              Login
            </p>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
