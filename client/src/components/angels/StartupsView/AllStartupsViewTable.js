import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { useAuth0 } from '../../../react-auth0-spa';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import { useConfirm } from 'material-ui-confirm';

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const columns = [
  { id: 'companyName', align: 'left', label: 'Company Name', minWidth: 170 },
  { id: 'location', align: 'left', label: 'Location', minWidth: 100 },
  {
    id: 'website',
    label: 'Website',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
  {
    id: 'companySize',
    label: '# of Employees',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
  {
    id: 'missionStatement',
    label: 'Mission Statement',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
];

const useStyles = makeStyles(theme => ({
  cellTable: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  flex: {
    display: 'flex',
    flexFlow: 'column',
  },
}));

const AllStartupsViewTable = ({ user, vett, archived, removeStartupById }) => {
  const [state, setState] = useState({
    archieved: false,
    vetted: false,
  });
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { archieved, vetted } = state;
  const [userData, setUserData] = useState({});
  const { getTokenSilently } = useAuth0();
  const confirm = useConfirm();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();
      const result = await axios(
        `/api/profile/getStartups/profile/${user.authId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserData(result.data);
      setState({
        archieved: result.data.archived,
        vetted: result.data.vetted,
      });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const vetStartup = () => {
    setState({ ...state, vetted: !vetted });
    vett(user, vetted);
  };

  const archivedStartup = () => {
    setState({ ...state, archieved: !archieved });
    archived(user, archieved);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const removeStartup = async () => {
    try {
      setOpen(false);
      await confirm({
        description: `This will permanently delete ${user.companyName} as a startup.`,
      });
      const deleted = true;
      removeStartupById(user, deleted);
    } catch (err) {
      setOpen(false);
      console.error(err);
    }
  };

  return (
    <>
      <TableRow hover style={{ cursor: 'pointer' }} onClick={handleClickOpen}>
        {columns.map(column => {
          let value = userData[column.id];

          if (value === '' || value === null) {
            value = 'N/A';
          }

          return (
            <TableCell key={column.id} align={column.align}>
              <div className={classes.cellTable}>{value}</div>
            </TableCell>
          );
        })}
      </TableRow>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogContent dividers>
          <div className={classes.flex}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => vetStartup()}
                  name='vetted'
                  checked={vetted}
                  value='vetted'
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
              }
              label='Vetted'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={archieved}
                  onChange={() => archivedStartup()}
                  name='archieved'
                  value='archieved'
                  color='primary'
                  inputProps={{
                    'aria-label': 'secondary checkbox',
                  }}
                />
              }
              label='Archived'
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={removeStartup} color='secondary'>
            Delete Startup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllStartupsViewTable;
