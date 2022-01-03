import {Dialog, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem} from '@mui/material';
import React, {ReactElement, useState} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Settings from './settings/Settings';
import './HomeScreen.scss';
import {User} from '../../types';

const HomeScreen = (props: {user: User; logout: () => void}): ReactElement => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();
  const handleClose = () => {
    setAnchorEl(undefined);
  };
  return (
    <div className="HomeScreen">
      <div className="settings-button">
        <IconButton onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}>
          <MenuIcon/>
        </IconButton>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem>{props.user.name} (ID: {props.user.id})</MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setAnchorEl(undefined);
          setIsSettingsOpen(true);
        }}>
          Settings
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(undefined);
          props.logout();
        }}>
          Logout
        </MenuItem>
      </Menu>
      <Dialog open={isSettingsOpen} onClose={() => {
        setIsSettingsOpen(false);
      }}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Settings/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeScreen;
