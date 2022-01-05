import {Box, Button, ButtonGroup, Typography} from '@mui/material';
import {ReactElement, useEffect, useState} from 'react';
import {BACKEND_URL} from '../../../globals';
import {WordLearningData} from '../../../types';
import './LearningPanel.scss';

enum PanelState {
  QUESTION, HINT, ANSWER
};

const LearningPanel = (): ReactElement => {
  const [currentWord, setCurrentWord] = useState<WordLearningData>();
  const [panelState, setPanelState] = useState<PanelState>(PanelState.QUESTION);
  const [isKnown, setIsKnown] = useState<boolean>();
  
  useEffect(() => {
    fetch(
      BACKEND_URL + '/learning/current',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((result: WordLearningData) => {
        setCurrentWord(result);
      })        
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleProceed = () => {
    if (isKnown !== undefined) {
      const data = new URLSearchParams([['is_known', String(isKnown)]]);
      fetch(
        BACKEND_URL + '/learning/proceed',
        {
          method: 'POST',
          body: data,
          credentials: 'include'
        }
      )
        .then((response) => {
          response.json()
            .then((result: WordLearningData) => {
              setCurrentWord(result);
              if (result.wordKnownType === 'UNKNOWN') {
                setPanelState(PanelState.HINT);
              } else {
                setPanelState(PanelState.QUESTION);
              }
              setIsKnown(undefined);
            })
            .catch(() => {
              setCurrentWord(undefined);
            });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className="LearningPanel">
      {currentWord 
        ? (
          <>
            <Typography component="h1" variant="h5">
              {currentWord.word.name}
            </Typography>
            <Typography component="h1" variant="h5">
              {panelState !== PanelState.QUESTION && currentWord.word.hint}
            </Typography>
            <Typography component="h1" variant="h5">
              {panelState === PanelState.ANSWER && currentWord.word.definition}
            </Typography>
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical contained button group"
            >
              <Button key="known"
                disabled={panelState === PanelState.ANSWER}
                onClick={() => {
                  if (isKnown === undefined) {
                    setIsKnown(true);
                  }
                  setPanelState(PanelState.ANSWER);
                }}
              >
                I know this word
              </Button>
              <Button key="unknown"
                disabled={panelState === PanelState.ANSWER}
                onClick={() => {
                  setIsKnown(false);
                  if (panelState === PanelState.QUESTION) {
                    setPanelState(PanelState.HINT);
                  } else {
                    setPanelState(PanelState.ANSWER);
                  }
                }}
              >
                I don't know
              </Button>
              <Button key="next"
                disabled={panelState !== PanelState.ANSWER}
                onClick={() => {
                  handleProceed();
                }}
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )
        : (
          <Typography component="h1" variant="h5">
            You've done your daily goal!
          </Typography>
        )
      }
    </div>
  );
};

export default LearningPanel;
