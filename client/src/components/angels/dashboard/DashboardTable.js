import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
  cellTable: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  center: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexFlow: 'column',
  },
}));

const DashboardTable = ({ angel, angelInfo }) => {
  const classes = useStyles();
  const [shortenBio, setShortenBio] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        onClose={handleClose}
        aria-labelledby='simple-dialog-title'
        open={open}
        className={classes.dialog}
      >
        <List>
          <ListItem
            disableGutters
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              margin: '0 -10px',
              padding: 0,
            }}
          >
            <i
              onClick={handleClose}
              className={`fas fa-times fa-lg ${classes.icon}`}
            ></i>
          </ListItem>

          <ListItem className={classes.headerCenter}>
            <Avatar
              className={classes.avatarResize}
              src={angel.profileImg}
              alt={angel.name}
            />
            <h2>{`${angel.name}`}</h2>
          </ListItem>
          <ListItem>
            <ListItemText primary={`Bio: ${angelInfo?.bio}`} />
          </ListItem>

          <ListItem className={classes.center}>
            <Button href={`tel: ${angelInfo?.phoneNumber}`}>
              <PhoneIcon />
            </Button>
            <Button href={`mailto: ${angel.email}`}>
              <EmailIcon />
            </Button>
            <Button
              href={
                angelInfo?.linkedin
                  ? angelInfo.linkedin
                  : 'https://linkedin.com'
              }
            >
              <LinkedInIcon />
            </Button>
            <Button
              href={
                angelInfo?.facebook
                  ? angelInfo.facebook
                  : 'https://facebook.com'
              }
            >
              <FacebookIcon />
            </Button>
          </ListItem>
        </List>
      </Dialog>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          <Avatar
            style={{ marginRight: '10px' }}
            src={angel?.profileImg}
            alt={angel?.name}
          />
          {angel?.name}
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {angelInfo?.location ? angelInfo.location : 'N/A'}
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {' '}
          <a href={`tel: ${angelInfo?.phoneNumber}`}>
            {angelInfo?.phoneNumber ? angelInfo.phoneNumber : 'N/A'}
          </a>
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          <a href={`mailto: ${angel.email}`}>
            {angel?.email ? angel.email : 'N/A'}
          </a>
        </div>
      </TableCell>
      <TableCell align={'left'}>
        <div className={classes.cellTable}>
          {angelInfo?.bio ? (
            <span>
              {angelInfo?.bio.slice(0, 30)}{' '}
              <a style={{ cursor: 'pointer' }} onClick={handleClickOpen}>
                [More Info...]
              </a>
            </span>
          ) : (
            'N/A'
          )}
        </div>
      </TableCell>
    </>
  );
};

export default DashboardTable;
