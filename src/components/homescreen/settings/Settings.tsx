import React, {ReactElement, useEffect, useState, useCallback} from 'react';
import {BACKEND_URL, DEFAULT_DAILY_NEW_WORD_NUM, DEFAULT_DAILY_REVISING_WORD_NUM} from '../../../globals';
import {RadioGroup, FormControlLabel, Radio , FormControl, FormLabel, Input, Button, TextField} from '@mui/material';
import {Wordlist, UserSettings} from '../../../types';
import './Settings.scss';

const Settings = (props: {updateUser: () => void; isSettingsOpen: boolean}): ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };
  const [wordlists, setWordlists] = useState<Wordlist[]>();
  const [userSettings, setUserSettings] = useState<UserSettings>();
  const defaultUserSettings: UserSettings 
    = {dailyNewWordNum: DEFAULT_DAILY_NEW_WORD_NUM, dailyRevisingWordNum: DEFAULT_DAILY_REVISING_WORD_NUM};

  const updateWordlists = () => {
    fetch(
      BACKEND_URL + '/wordlist/all',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setWordlists(result);
      })        
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const updateUserSettings = useCallback(() => {
    fetch(
      BACKEND_URL + '/user/settings',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((result: UserSettings) => {
        setUserSettings(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleChangeUserSettings = (newUserSettings: UserSettings) => {
    setUserSettings(newUserSettings);
    fetch(
      BACKEND_URL + '/user/settings/edit',
      {
        method: 'POST',
        body: JSON.stringify(newUserSettings),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => response.json())
      .then((result: UserSettings) => {
        console.log('Success:', result);
        if (!props.isSettingsOpen) {
          props.updateUser();        
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpload = () => {
    
    if (selectedFile !== undefined) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', selectedFile.name);
      setSelectedFile(undefined);
      fetch(
        BACKEND_URL + '/wordlist/upload',
        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      )
        .then((response) => response.text())
        .then((result) => {          
          console.log('Success:', result);
          updateWordlists();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  useEffect(() => {
    updateWordlists();
  }, []);

  useEffect(() => {
    updateUserSettings();
  }, [updateUserSettings]);
  
  return (
    <div className="Settings">
      <div className="settings-block">
        <div className="daily-goals">
          <FormControl component="fieldset">
            <FormLabel component="legend">Daily Goals</FormLabel>
            <TextField
              label="New words"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              size="small"
              margin="normal" 
              value={userSettings?.dailyNewWordNum ?? DEFAULT_DAILY_NEW_WORD_NUM}
              onChange={(event) => {
                if (userSettings) {
                  handleChangeUserSettings({...userSettings, dailyNewWordNum: Number(event.currentTarget.value)});
                } else {
                  handleChangeUserSettings({...defaultUserSettings, dailyNewWordNum: Number(event.currentTarget.value)});                
                }
              }}
            />
            <TextField
              label="Revising words"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              size="small"
              margin="normal" 
              value={userSettings?.dailyRevisingWordNum ?? DEFAULT_DAILY_REVISING_WORD_NUM}
              onChange={(event) => {
                if (userSettings) {
                  handleChangeUserSettings({...userSettings, dailyRevisingWordNum: Number(event.currentTarget.value)});
                } else {
                  handleChangeUserSettings({...defaultUserSettings, dailyRevisingWordNum: Number(event.currentTarget.value)});                
                }
              }}
            />
          </FormControl>
        </div>
      </div>
      <div className="settings-block">
        <div className="wordlist-selection">
          <FormControl component="fieldset">
            <FormLabel component="legend">Word Lists</FormLabel>
            <RadioGroup
              aria-label="wordlist"
              name="radio-buttons-group"
              value={userSettings?.currentWordlistId ?? -1}
              onChange={(event) => {
                if (userSettings) {
                  handleChangeUserSettings({...userSettings, currentWordlistId: Number(event.currentTarget.value)});
                } else {
                  handleChangeUserSettings({...defaultUserSettings, currentWordlistId: Number(event.currentTarget.value)});                
                }
              }}
            >
              {wordlists?.map((wordlist) => 
                (<FormControlLabel 
                  key={wordlist.id} 
                  value={wordlist.id} 
                  control={<Radio />} 
                  label={wordlist.name} 
                />)
              )}
            </RadioGroup>
          </FormControl>
        </div>
        <div className="wordlist-upload">
          <Input type="file" name="file" onChange={changeHandler} />
          {selectedFile ? (
            <div>
              <p>File size: {selectedFile.size.toLocaleString()} bytes</p>
            </div>
          ) : (
            <p>Select a wordlist CSV file to upload</p>
          )}
          <div>
            <Button variant="outlined" onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
