import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import NavBar from './Nav/NavBar';
import Questionaire from './Questionaire/Questionaire';
import Profile from './Profile/Profile';
import HomePage from './Homepage';
import Protected from '../privateroute/Protected';
import { Switch } from 'react-router-dom';

const Routes = props => {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path={props.match.path} component={Dashboard} />
        <Protected
          path={`${props.match.path}/questionaire`}
          component={Questionaire}
        />
        <Protected
          path={`${props.match.path}/profile/:id`}
          component={Profile}
        />
        <Protected
          path={`${props.match.path}/dashboard`}
          component={HomePage}
        />
      </Switch>
    </>
  );
};

export default Routes;
