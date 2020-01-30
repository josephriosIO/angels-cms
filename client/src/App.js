import React from 'react';
import { useAuth0 } from './react-auth0-spa';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import Routes from './components/angels/Routes';
import AngelInvite from './components/angels/AdminPanel/AngelInvite';
import StartupRoutes from './components/startups/Routes';

function App() {
  const { loading } = useAuth0();
  //test

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Switch>
        <Route path='/angels' component={Routes} />
        <Route path='/startups' component={StartupRoutes} />
        <Route exact path={`/invite/:id`} component={AngelInvite} />
        <Route exact path='/' component={LandingPage} />
      </Switch>
    </>
  );
}

export default App;
