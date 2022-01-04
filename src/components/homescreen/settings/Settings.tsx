import React, {ReactElement, useEffect, useState, useCallback} from 'react';
import './Settings.scss';
import {BACKEND_URL} from '../../../globals';
import {RadioGroup, FormControlLabel, Radio , FormControl, FormLabel, Input, Button} from '@mui/material';
import {Wordlist, UserSettings} from '../../../types';

const Settings = (): ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };
  const [wordlists, setWordlists] = useState<Wordlist[]>();
  const [userSettings, setUserSettings] = useState<UserSettings>();

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
    if (newUserSettings) {
      console.log(JSON.stringify(newUserSettings));
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
          setUserSettings(result);
          console.log('Success:', result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
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
    updateUserSettings();
  }, [updateUserSettings]);
  
  return (
    <div className="Settings">
      <div className="wordlist-selection">
        <FormControl component="fieldset">
          <FormLabel component="legend">Wordlist</FormLabel>
          <RadioGroup
            aria-label="wordlist"
            name="radio-buttons-group"
            value={userSettings?.currentWordlistId ?? -1}
            onChange={(event) => {
              const newUserSettings = {...userSettings, currentWordlistId: Number(event.currentTarget.value)};
              handleChangeUserSettings(newUserSettings);
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
          <Button variant="contained" onClick={handleUpload}>Upload</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
