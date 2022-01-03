import React, {ReactElement, useEffect, useState} from 'react';
import './Settings.scss';
import {BACKEND_URL} from '../../../globals';
import {RadioGroup, FormControlLabel, Radio , FormControl, FormLabel, Input, Button} from '@mui/material';
import {Wordlist} from '../../../types';

const Settings = (): ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };
  const [wordlists, setWordlists] = useState<Wordlist[]>();
  const [selectedWordlistId, setSelectedWordlistId] = useState<number>(-1);

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

  const updateSelectedWordlistId = () => {
    fetch(
      BACKEND_URL + '/wordlist/current',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((result: Wordlist) => {
        setSelectedWordlistId(result.id);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSelectWordlist = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setSelectedWordlistId(Number(value));
    const data = new URLSearchParams([['wordlist_id', value]]);
    fetch(
      BACKEND_URL + '/wordlist/select',
      {
        method: 'POST',
        body: data,
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((result: Wordlist) => {
        setSelectedWordlistId(result.id);
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
    updateSelectedWordlistId();
  }, []);

  return (
    <div className="Settings">
      <div className="wordlist-selection">
        <FormControl component="fieldset">
          <FormLabel component="legend">Wordlist</FormLabel>
          <RadioGroup
            aria-label="wordlist"
            name="radio-buttons-group"
            value={selectedWordlistId}
            onChange={handleSelectWordlist}
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
