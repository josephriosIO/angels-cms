import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '50px 30px',
  },
  card: {
    width: '50%',
    marginBottom: '50px',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      width: '80%',
    },
  },
  media: {
    height: 200,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItems: {
    display: 'flex',
    flexFlow: 'column',
  },
  items: {
    lineHeight: 2.5,
  },
}));

const StartupProfile = ({ item }) => {
  const classes = useStyles();
  const [userData, setUserData] = useState({});
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();

      const usersRoles = await axios(`/api/profile/startups/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(usersRoles.data);
    };
    fetchData();
  }, [item.authId, getTokenSilently]);

  return (
    <div>
      <div className={classes.header}>
        <h3>Welcome back, {item.name}</h3>
      </div>
      <div className={classes.center}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {userData?.companyName ? userData?.companyName : 'Not Entered'}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                {userData?.missionStatement
                  ? userData?.missionStatement
                  : 'Not Entered'}{' '}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/startups/profile/${item.authId}`}
            >
              <Button size='small'>Edit Profile</Button>
            </Link>
          </CardActions>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Button size='small' color='primary'>
                More Info
              </Button>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.infoItems}>
                <Typography className={classes.items}>
                  Website:{' '}
                  {userData?.website ? userData?.website : 'Not Entered'}{' '}
                </Typography>
                <Typography className={classes.items}>
                  Location:{' '}
                  {userData?.location ? userData?.location : 'Not Entered'}{' '}
                </Typography>
                <Typography className={classes.items}>
                  # of Employees:{' '}
                  {userData?.companySize
                    ? userData?.companySize
                    : 'Not Entered'}{' '}
                </Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Card>
      </div>
    </div>
  );
};

export default StartupProfile;
