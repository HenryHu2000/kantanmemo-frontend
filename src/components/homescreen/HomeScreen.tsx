import {AppBar, Box, Container, CssBaseline, Dialog, DialogContent, DialogTitle, Divider, Fade, IconButton, Link, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import React, {ReactElement, useEffect, useState} from 'react';
import MoreIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Settings from './settings/Settings';
import {User} from '../../types';
import LearningPanel from './learningpanel/LearningPanel';
import './HomeScreen.scss';

const HomeScreen = (props: {user: User; updateUser: () => void; logout: () => void}): ReactElement => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();
  const [isSettingsSaved, setIsSettingsSaved] = useState<boolean>(false);
  const handleCloseMenu = () => {
    setAnchorEl(undefined);
  };
  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    props.updateUser();
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
              onClose={handleCloseMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem>{props.user.name} (ID: {props.user.id})</MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                handleCloseMenu();
                setIsSettingsOpen(true);
              }}>
                Settings
              </MenuItem>
              <MenuItem onClick={() => {
                handleCloseMenu();
                props.logout();
              }}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Dialog open={isSettingsOpen} onClose={handleCloseSettings}>
        <DialogTitle>
          Settings
          <Fade in={isSettingsSaved}>
            <Typography display="inline" color="success.main" sx={{
              margin: 1
            }}>
              <CheckCircleOutlineIcon fontSize="inherit" color="inherit" sx={{
                position: 'relative',
                top: 2
              }}/>
              SAVED
            </Typography>
          </Fade>
          <IconButton
            aria-label="close"
            onClick={handleCloseSettings}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Settings updateUser={props.updateUser} isSettingsOpen={isSettingsOpen} setIsSettingsSaved={setIsSettingsSaved}/>
        </DialogContent>
      </Dialog>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        {props.user.userSettings 
          ? (
            <LearningPanel />
          )
          : !isSettingsOpen && (
            <Box
              className="panel"
            >
              <Typography component="h2" variant="h6" color="text.secondary">
                <Link href="#" underline="hover" onClick={() => {
                  setIsSettingsOpen(true);
                }}>
                  Pick a Word List to Start
                </Link>
              </Typography>
            </Box>
          )
        }
      </Container>
    </div>
  );
};

export default HomeScreen;
