import React, { useEffect, useState } from 'react';
import { useAuth0 } from '../../../react-auth0-spa';
import DashboardAngelsList from './DashboardAngelsList';
import SearchBar from '../HelperComponents/SearchBar';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import EmptyState from '../EmptyStates/EmptyState';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  heroContent: {
    marginTop: '60px',
    padding: '64px 25px',
    [theme.breakpoints.down('md')]: {
      marginTop: '30px',
    },
  },
}));

export default function Dashboard({ userRoles }) {
  const [users, setUsers] = useState(undefined);
  const [filter, setFilter] = useState([]);
  const classes = useStyles();

  const { loading, user, getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();

        const test = await axios('/api/user/getAngels', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(test.data);
      } catch (err) {
        setUsers([]);
        console.error(err);
      }
    };
    fetchData();
  }, [userRoles, getTokenSilently]);

  if (loading || !user) {
    return <CircularProgress />;
  }

  const search = e => {
    if (e.target.value.length < 2) {
      setFilter([]);
      return null;
    }
    const filteredUsers = users.filter(user => {
      if (user.name.toLowerCase().includes(e.target.value)) {
        return user;
      }

      return null;
    });

    setFilter(filteredUsers);
  };

  if (userRoles.length < 1 || users === undefined) return null;

  if (!userRoles.ADMIN && !userRoles.ANGEL) {
    return (
      <EmptyState
        title={'Thank you for your request!'}
        subtitle={
          'An Admin will accept you shortly if you meet the requirements.'
        }
        roles={userRoles}
      />
    );
  }

  if (userRoles.ADMIN) {
    return (
      <>
        <CssBaseline />
        <Container
          maxWidth='lg'
          component='main'
          className={classes.heroContent}
        >
          {users.length > 0 ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                  Community Members
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <SearchBar search={search} title={'Name'} />
                </div>
              </div>

              <DashboardAngelsList
                angels={filter.length > 0 ? filter : users}
              />
            </div>
          ) : (
            <EmptyState
              title={'Admin View'}
              subtitle={'Accept some angels.'}
              roles={userRoles}
            />
          )}
        </Container>
      </>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='lg' component='main' className={classes.heroContent}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>
            Community Members
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <SearchBar search={search} title={'Name'} />
          </div>
        </div>
        <DashboardAngelsList angels={filter.length > 0 ? filter : users} />
      </Container>
    </React.Fragment>
  );
}
