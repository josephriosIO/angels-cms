import React from 'react';
import { useAuth0 } from '../../react-auth0-spa';
import { Redirect } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

const Dashboard = () => {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated !== undefined) {
    if (isAuthenticated) {
      return <Redirect to='/startups/questionaire' />;
    }
  }

  return (
    <>
      <CircularProgress />
    </>
  );
};

export default Dashboard;
