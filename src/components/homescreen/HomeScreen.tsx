import {AppBar, Container, CssBaseline, Dialog, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import React, {ReactElement, useEffect, useState} from 'react';
import Settings from './settings/Settings';
import {User} from '../../types';
import LearningPanel from './learningpanel/LearningPanel';
import './HomeScreen.scss';
import MoreIcon from '@mui/icons-material/MoreVert';

const HomeScreen = (props: {user: User; updateUser: () => void; logout: () => void}): ReactElement => {
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            KantanMemo
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="more"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
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
          </div>
        </Toolbar>
      </AppBar>

      <Dialog open={isSettingsOpen} onClose={() => {
        setIsSettingsOpen(false);
        props.updateUser();
      }}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Settings updateUser={props.updateUser} isSettingsOpen={isSettingsOpen}/>
        </DialogContent>
      </Dialog>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        {props.user.userSettings && (
          <LearningPanel />
        )}
      </Container>
    </div>
  );
};

export default HomeScreen;
