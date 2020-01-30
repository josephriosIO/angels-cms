import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  EmptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
  },
  link: {
    textDecoration: 'none !important',
    color: '#000 !important',
  },
}));

const EmptyState = props => {
  const { title, subtitle, roles } = props;
  const classes = useStyles();
  return (
    <div className={`empty ${classes.EmptyState}`}>
      <div className='empty-icon'>
        <i className='icon icon-people'></i>
      </div>
      <p className='empty-title h5'>{title}</p>
      <p className='empty-subtitle'>{subtitle}</p>
      {roles.ADMIN ? (
        <Link
          className={classes.link}
          to={{
            pathname: `/angels/admin`,
          }}
        >
          Admin
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
