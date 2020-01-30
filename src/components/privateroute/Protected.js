import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import axios from 'axios';

const Protected = ({ component: Component, path, ...rest }) => {
  const [roles, setRoles] = useState([]);
  const { isAuthenticated, getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();
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

  if (isAuthenticated === undefined) return null;

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} userRoles={roles} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

export default Protected;
