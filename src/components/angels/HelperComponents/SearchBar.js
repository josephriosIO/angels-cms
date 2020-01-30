import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formHolder: {
    marginBottom: '30px',
  },
  text: {
    width: '260px',
  },
}));

const SearchBar = props => {
  const classes = useStyles();
  return (
    <div className={classes.formHolder}>
      <TextField
        type='search'
        className={classes.text}
        id='search'
        onKeyDown={props.search}
        label={`Search By ${props.title}`}
      />
    </div>
  );
};

export default SearchBar;
