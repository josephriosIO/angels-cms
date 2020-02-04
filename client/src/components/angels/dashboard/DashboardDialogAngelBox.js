import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';
import TableRow from '@material-ui/core/TableRow';
import DashboardTable from './DashboardTable';

const useStyles = makeStyles(theme => ({
  angelContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    width: '19%',
    marginBottom: '30px',
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
  avatarResize: {
    width: '120px',
    height: '120px',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: '120px',
      height: '120px',
    },
  },
  angelsList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexFlow: 'wrap',
  },
  icon: {
    paddingRight: '10px',
    cursor: 'pointer',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const DashboardDialogAngelBox = ({ angel, angels }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [angelInfo, setAngelInfo] = useState({});
  const { getTokenSilently } = useAuth0();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenSilently();
        const test = await axios(`/api/user/getAngel/profile/${angel.authId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAngelInfo(test.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [getTokenSilently, angel]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };

  return (
    <TableRow hover role='checkbox'>
      <DashboardTable angel={angel} angelInfo={angelInfo} />
    </TableRow>
  );

  // return (
  //   <>
  //     <Dialog
  //       fullWidth
  //       maxWidth='xs'
  //       onClose={handleClose}
  //       aria-labelledby='simple-dialog-title'
  //       open={open}
  //       className={classes.dialog}
  //     >
  //       <List>
  //         <ListItem
  //           disableGutters
  //           style={{
  //             display: 'flex',
  //             alignItems: 'flex-end',
  //             justifyContent: 'flex-end',
  //             margin: 0,
  //             padding: 0,
  //           }}
  //         >
  //           <i
  //             onClick={handleClose}
  //             className={`fas fa-times fa-lg ${classes.icon}`}
  //           ></i>
  //         </ListItem>

  //         <ListItem className={classes.center}>
  //           <Avatar
  //             className={classes.avatarResize}
  //             src={angel.profileImg}
  //             alt={angel.name}
  //           />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText
  //             className={classes.center}
  //             primary={`${angel.name}`}
  //           />
  //         </ListItem>

  //         <ListItem>
  //           <ListItemText primary={`Bio: ${angelInfo?.bio}`} />
  //         </ListItem>

  //         <ListItem className={classes.center}>
  //           <Button href={`tel: ${angelInfo?.phoneNumber}`}>
  //             <PhoneIcon />
  //           </Button>
  //           <Button href={`mailto: ${angel.email}`}>
  //             <EmailIcon />
  //           </Button>
  //         </ListItem>
  //       </List>
  //     </Dialog>
  //     <>
  //       <div className={classes.angelContainer}>
  //         <Avatar
  //           onClick={handleClickOpen}
  //           className={classes.avatarResize}
  //           src={angel.profileImg}
  //           alt={angel.name}
  //         />
  //         <span
  //           style={{
  //             textAlign: 'center',
  //             marginTop: '10px',
  //           }}
  //         >
  //           {angel.name}
  //         </span>
  //       </div>
  //     </>
  //   </>
  // );
};

export default DashboardDialogAngelBox;
