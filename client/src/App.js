import React from 'react';
import { useAuth0 } from './react-auth0-spa';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import Routes from './components/angels/Routes';
import AngelInvite from './components/angels/AdminPanel/AngelInvite';
import StartupRoutes from './components/startups/Routes';
import { ConfirmProvider } from 'material-ui-confirm';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.css';

const useStyles = makeStyles(theme => ({
  root: {
    background: '#f9f9fa !important',
    display: 'flex',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function App() {
  const { loading } = useAuth0();
  const classes = useStyles();

  if (loading) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ConfirmProvider>
      <Switch>
        <Route path='/community' component={Routes} />
        <Route path='/startups' component={StartupRoutes} />
        <Route exact path={`/invite/:id`} component={AngelInvite} />
        <Route exact path='/' component={LandingPage} />
      </Switch>
    </ConfirmProvider>
  );
}

export default App;
