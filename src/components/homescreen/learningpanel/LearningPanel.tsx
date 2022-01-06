import {ReactElement, useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, CircularProgress, Typography} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);

  const updateWord = (word: WordLearningData) => {
    setCurrentWord(word);
    if (word.wordKnownType === 'UNKNOWN') {
      setPanelState(PanelState.HINT);
    } else {
      setPanelState(PanelState.QUESTION);
    }
    setIsKnown(undefined);
  };

  const handleProceed = () => {
    if (isKnown !== undefined) {
      const data = new URLSearchParams([['is_known', String(isKnown)]]);
      setIsLoading(true);
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
              updateWord(result);
              setIsLoading(false);
            })
            .catch(() => {
              setIsTerminated(true);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsLoading(false);
        });
    }
  };
    
  useEffect(() => {
    fetch(
      BACKEND_URL + '/learning/current',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then((response) => {
        response.json()
          .then((result: WordLearningData) => {
            updateWord(result);
          })
          .catch(() => {
            setIsTerminated(true);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="LearningPanel">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {!isTerminated ?
          (currentWord 
            ? (
              <>
                <div className="word-texts">
                  <Typography component="h2" variant="h4">
                    {currentWord.word.name}
                  </Typography>
                  <Typography component="h2" variant="h4" color="text.disabled">
                    {panelState !== PanelState.QUESTION && currentWord.word.hint}
                  </Typography>
                  <Typography component="h2" variant="h4">
                    {panelState === PanelState.ANSWER && currentWord.word.definition}
                  </Typography>
                </div>
                <ButtonGroup
                  orientation="vertical"
                  aria-label="vertical contained button group"
                >
                  <Button 
                    key="known"
                    size="large"
                    variant="outlined"
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
                  <Button 
                    key="unknown"
                    size="large"
                    variant="outlined"
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
                  <LoadingButton 
                    key="next"
                    size="large"
                    variant="outlined"
                    disabled={panelState !== PanelState.ANSWER}
                    onClick={() => {
                      handleProceed();
                    }}
                    loading={isLoading}
                  >
                    Next
                  </LoadingButton>
                </ButtonGroup>
              </>
            )
            : (
              <CircularProgress />
            )
          )
          : (
            <Typography component="h2" variant="h5">
              You've done your daily goal!
            </Typography>
          )
        }
      </Box>
    </div>
  );
};

export default LearningPanel;
