import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#f9f9fa',
    height: '100vh',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      maxWidth: '988px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingLeft: '14px',
      paddingRight: '14px',
    },
  },
  header: {
    borderBottom: '1px solid #e7e9eb',
    padding: '56px 0',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItem: 'center',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      alignItems: 'center',
      flexFlow: 'column',
    },
  },
  saveBtn: {
    backgroundColor: '#3f81c7',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '21px',
    padding: '7px 26px',
    outline: 'none',
    textDecoration: 'none',
    textAlign: 'center',
    userSelect: 'none',
    color: '#f0f0f0',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      padding: '7px 18px',
      width: '100px',
    },
  },
  body: {
    display: 'flex',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      flexFlow: 'column',
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    margin: '0 20px',
    width: '50%',
    display: 'flex',
    flexFlow: 'column',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      width: '100%',
    },
  },

  columnItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      alignItems: 'flex-start',
      flexFlow: 'column',
    },
  },

  item: {
    boxSizing: 'border-box',
    float: 'left',
    paddingLeft: '14px',
    paddingRight: '14px',
    position: 'relative',
    marginBottom: '14px',
  },
  bio: {
    boxSizing: 'border-box',
    float: 'left',
    paddingLeft: '14px',
    paddingRight: '14px',
    position: 'relative',
    marginBottom: '14px',
    width: '920px',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      width: '100%',
    },
  },
}));

const ProfileForm = props => {
  const classes = useStyles();
  const { form, onSubmit, onChange } = props;

  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit}>
        <div className={classes.layout}>
          <div className={classes.header}>
            <Typography variant='h6' gutterBottom>
              {form.name} / Edit Profile
            </Typography>
            <button
              type='submit'
              variant='contained'
              className={classes.saveBtn}
            >
              Save
            </button>
          </div>
          <div className={classes.body}>
            <div className={classes.column}>
              <div className={classes.columnItem}>
                <div className={classes.item}>
                  <label>Full Name</label>
                </div>
                <div className={classes.item}>
                  <TextField
                    onChange={e => onChange(e)}
                    value={form.name || ''}
                    id='name'
                    name='name'
                    fullWidth
                    variant='outlined'
                  />
                </div>
              </div>
              <div className={classes.columnItem}>
                <div className={classes.item}>
                  <label>Location</label>
                </div>
                <div className={classes.item}>
                  <TextField
                    onChange={e => onChange(e)}
                    value={form.location || ''}
                    id='location'
                    name='location'
                    fullWidth
                    variant='outlined'
                  />
                </div>
              </div>
              <div className={classes.columnItem}>
                <div className={(classes.item, classes.center)}>
                  <label>Phone Number</label>
                </div>
                <div className={classes.item}>
                  <TextField
                    value={form.phoneNumber || ''}
                    onChange={e => onChange(e)}
                    id='number'
                    name='phoneNumber'
                    fullWidth
                    autoComplete='phone-number'
                    variant='outlined'
                  />
                </div>
              </div>
            </div>
            <div className={classes.column}>
              <div className={classes.columnItem}>
                <div className={(classes.item, classes.center)}>
                  <label>Linkedin</label>
                </div>
                <div className={classes.item}>
                  <TextField
                    value={form.linkedin || ''}
                    onChange={e => onChange(e)}
                    name='linkedin'
                    fullWidth
                    variant='outlined'
                  />
                </div>
              </div>
              <div className={classes.columnItem}>
                <div className={(classes.item, classes.center)}>
                  <label>Facebook</label>
                </div>
                <div className={classes.item}>
                  <TextField
                    value={form.facebook || ''}
                    onChange={e => onChange(e)}
                    name='facebook'
                    fullWidth
                    variant='outlined'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.columnItem} style={{ marginTop: '20px' }}>
            <div className={(classes.item, classes.center)}>
              <label>Bio</label>
            </div>
            <div>
              <TextField
                className={classes.bio}
                value={form.bio || ''}
                onChange={e => onChange(e)}
                id='bio'
                name='bio'
                fullWidth
                multiline
                rows='12'
                variant='outlined'
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
