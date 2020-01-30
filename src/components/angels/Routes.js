import React from 'react';
import Dashboard from './dashboard/Dashboard';
import Navbar from './navbar/Navbar';
import Protected from '../privateroute/Protected';
import Profile from './Profile/Profile';
import AdminPage from './AdminPanel/AdminPage';
import { Switch } from 'react-router-dom';
import AllStartupsView from './StartupsView/AllStartupsView';
import SeeMeetings from './meetingPanel/SeeMeetings';
import MeetingCreator from './meetingPanel/MeetingCreator';
import EditMeeting from './meetingPanel/EditMeeting';
import AdminMeetingPanel from './meetingPanel/AdminMeetingPanel';

const Routes = props => {
  return (
    <>
      <Navbar />
      <Switch>
        <Protected exact path={props.match.path} component={Dashboard} />
        <Protected
          exact
          path={`${props.match.path}/profile/:id`}
          component={Profile}
        />
        <Protected
          exact
          path={`${props.match.path}/admin`}
          component={AdminPage}
        />
        <Protected
          exact
          path={`${props.match.path}/startups`}
          component={AllStartupsView}
        />
        <Protected
          exact
          path={`${props.match.path}/meetings`}
          component={SeeMeetings}
        />
        <Protected
          exact
          path={`${props.match.path}/createmeeting`}
          component={MeetingCreator}
        />
        <Protected
          exact
          path={`${props.match.path}/meeting/:id`}
          component={AdminMeetingPanel}
        />
        <Protected
          exact
          path={`${props.match.path}/editmeeting/:id`}
          component={EditMeeting}
        />
      </Switch>
    </>
  );
};

export default Routes;
