import {Dialog, DialogContent, DialogTitle, IconButton} from '@mui/material';
import React, {ReactElement, useState} from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './components/settings/Settings';
import './App.scss';

const App = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="App">
      <div className="settings-button">
        <IconButton onClick={handleClickOpen}>
          <SettingsIcon/>
        </IconButton>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Settings/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
