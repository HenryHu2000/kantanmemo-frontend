import {Container, CssBaseline, Dialog, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem} from '@mui/material';
import React, {ReactElement, useEffect, useState} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Settings from './settings/Settings';
import {User, UserSettings} from '../../types';
import LearningPanel from './learningpanel/LearningPanel';
import './HomeScreen.scss';

const HomeScreen = (props: {user: User; setUser: (user?: User) => void; logout: () => void}): ReactElement => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();
  const handleClose = () => {
    setAnchorEl(undefined);
  };

  useEffect(() => {
    if (!props.user.userSettings) {
      setIsSettingsOpen(true);
    }
  }, [props.user.userSettings]);

  return (
    <div className="HomeScreen">
      <div className="settings-button">
        <IconButton onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}>
          <MenuIcon fontSize='large'/>
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
          <Settings userSettings={props.user.userSettings ?? undefined} setUserSettings={(userSettings?: UserSettings) => {
            props.setUser({...props.user, userSettings: userSettings ?? null});
          }}/>
        </DialogContent>
      </Dialog>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {props.user.userSettings && (
          <LearningPanel />
        )}
      </Container>
    </div>
  );
};

export default HomeScreen;
