import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MeetingPanels from './MeetingPanel';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#5ebeeb',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  link: {
    textDecoration: 'none !important',
    color: '#000 !important',
    '&:hover': {
      color: '#5dbeeb !important',
    },
  },
  indicator: {
    backgroundColor: '#eee',
  },
  tab: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexFlow: 'column',
    },
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SeeStartups({ userRoles }) {
  const [users, setUsers] = useState(undefined);
  const [oldMeetings, setOldMeetings] = useState(undefined);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();
        const result = await axios('/api/user/getmeetings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.data.length > 0) {
          const sortedDates = result.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );

          const newMeetings = sortedDates.filter(d => {
            let meetingDate = new Date(d.date);
            let currentDate = new Date();
            meetingDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            return meetingDate >= currentDate;
          });

          const oldDates = sortedDates.filter(d => {
            return new Date(d.date).getTime() <= new Date().getTime();
          });

          setOldMeetings(oldDates);
          setUsers(newMeetings.reverse());
        } else {
          setOldMeetings([]);
          setUsers([]);
        }
      } catch (err) {
        setOldMeetings([]);
        setUsers([]);
      }
    };
    fetchData();
  }, [userRoles, getTokenSilently]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (users === undefined || oldMeetings === undefined) return null;

  if (!userRoles.ADMIN && !userRoles.ANGEL) {
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>Thank you for your request!</p>
        <p className='empty-subtitle'>
          To see upcoming meetings please have an admin confirm you as an angel.
        </p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='lg' component='main'>
        {users.length < 1 && oldMeetings.length < 1 ? (
          <div className='empty'>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>No Meetings</p>
            <p className='empty-subtitle'>
              Ask your admin to create more meetings!
            </p>
            <p className='empty-subtitle'>
              {userRoles.ADMIN ? (
                <Link
                  className={classes.link}
                  to={{
                    pathname: `/angels/createmeeting`,
                  }}
                >
                  Create Meeting
                </Link>
              ) : null}
            </p>
          </div>
        ) : (
          <Grid>
            <div className={classes.root}>
              <div className={classes.flex}>
                <div style={{ padding: '20px 10px' }}>
                  <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label='meetings tab'
                  >
                    <StyledTab label='Upcoming Meetings' {...a11yProps(0)} />
                    <StyledTab label='Previous Meetings' {...a11yProps(1)} />
                  </StyledTabs>
                </div>

                {userRoles.ADMIN ? (
                  <Tooltip title='Create Meeting' arrow>
                    <Link
                      className={classes.link}
                      to={{
                        pathname: `/angels/createmeeting`,
                      }}
                    >
                      <AddCircleIcon />
                    </Link>
                  </Tooltip>
                ) : null}
              </div>
              <TabPanel value={value} index={0}>
                <div>
                  {users.length < 1 ? (
                    <div className='empty'>
                      <div className='empty-icon'>
                        <i className='fas fa-users'></i>
                      </div>
                      <p className='empty-title h5'>No Upcoming meetings.</p>
                    </div>
                  ) : (
                    users.map((startupsData, idx) => (
                      <MeetingPanels
                        key={idx}
                        users={startupsData}
                        roles={userRoles}
                      />
                    ))
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div>
                  {oldMeetings.length < 1 ? (
                    <div className='empty'>
                      <div className='empty-icon'>
                        <i className='fas fa-users'></i>
                      </div>
                      <p className='empty-title h5'>No previous meetings.</p>
                    </div>
                  ) : (
                    oldMeetings.map((startupsData, idx) => (
                      <MeetingPanels
                        roles={userRoles}
                        key={idx}
                        users={startupsData}
                      />
                    ))
                  )}
                </div>
              </TabPanel>
            </div>
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
}
