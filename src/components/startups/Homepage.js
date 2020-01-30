import React, { useEffect, useState } from 'react';
import StartupProfile from './Profile/StartupProfile';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth0 } from '../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();
      const user = await axios('/api/auth/createOrGetStartup', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(user.data);
    };
    fetchData();
  }, []);

  //use new component to display all items from startup profile CHECK
  //have an edit button which will take you to Profile.js component || in navbar?
  // choose a nice styling for all components maybe look up components or templates with nicer CMS styles?
  // clean up code to make it more readable
  return (
    <div className={classes.root}>
      <StartupProfile item={user} />
    </div>
  );
};

export default HomePage;
