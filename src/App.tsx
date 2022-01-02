import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };

  const handleSubmission = () => {
    if (selectedFile !== undefined) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', selectedFile.name);

      fetch(
        // 'http://localhost:8080/upload',
        'https://kantanmemo-backend.herokuapp.com/upload',
        {
          method: 'POST',
          body: formData,
        }
      )
        .then((response) => response.text())
        .then((result) => {
          console.log('Success:', result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className="App">
      <input type="file" name="file" onChange={changeHandler} />
      {selectedFile ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size.toLocaleString()}</p>
        </div>
      ) : (
        <p>Select a file</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
}

export default App;
