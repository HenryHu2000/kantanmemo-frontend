import {ReactElement, useCallback, useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, CircularProgress, Container, Typography} from '@mui/material';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import {BACKEND_URL} from '../../../globals';
import {DailyProgress, WordLearningData} from '../../../types';
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
  const [progressRatio, setProgressRatio] = useState<number>(0);

  const updateProgress = () => {
    fetch(
      BACKEND_URL + '/learning/progress',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((result: DailyProgress) => {
        const total = result.remainingNum + result.learningNum + result.finishedNum;
        if (total !== 0) {
          setProgressRatio(result.finishedNum / total);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const setWordAndUpdatePanel = (word: WordLearningData) => {
    setCurrentWord(word);
    if (word.wordKnownType === 'UNKNOWN') {
      setPanelState(PanelState.HINT);
    } else {
      setPanelState(PanelState.QUESTION);
    }
    setIsKnown(undefined);
  };

  const updateCurrentWord = useCallback(() => {
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
            setWordAndUpdatePanel(result);
          })
          .catch(() => {
            setIsTerminated(true);
          });
        updateProgress();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

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
              setWordAndUpdatePanel(result);
              setIsLoading(false);
            })
            .catch(() => {
              setIsTerminated(true);
              setIsLoading(false);
            });
          updateProgress();
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsLoading(false);
        });
    }
  };
  
  const handleResetLearningProcess = () => {
    fetch(
      BACKEND_URL + '/learning/reset',
      {
        method: 'POST',
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then(() => {
        setCurrentWord(undefined);
        setIsTerminated(false);
        updateCurrentWord();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    updateCurrentWord();
  }, [updateCurrentWord]);

  useEffect(() => {
    updateProgress();
  }, []);

  return (
    <div className="LearningPanel">
      <Box
        className="panel"
      >
        {!isTerminated ?
          (currentWord 
            ? (
              <>
                <LinearProgress variant="determinate" className="progress-bar" value={progressRatio * 100} />
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
                <Container className="learning-button-group" maxWidth="sm">
                  <ButtonGroup
                    orientation="vertical"
                    aria-label="vertical contained button group"
                    fullWidth
                  >
                    <Button 
                      key="known"
                      size="large"
                      variant="outlined"
                      color="success"
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
                      color="error"
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
                      variant="contained"
                      disabled={panelState !== PanelState.ANSWER}
                      onClick={() => {
                        handleProceed();
                      }}
                      loading={isLoading}
                    >
                      Next
                    </LoadingButton>
                  </ButtonGroup>
                </Container>
              </>
            )
            : (
              <CircularProgress />
            )
          )
          : (
            <div className="finish-message">
              <Typography component="h2" variant="h5" color="text.secondary">
                You've done your daily goal!
              </Typography>
              <Typography component="h3" variant="h6" color="text.secondary">
                <Link href="#" underline="hover" onClick={() => {
                  handleResetLearningProcess();
                }}>
                  Learn More Words
                </Link>
              </Typography>
            </div>
          )
        }
      </Box>
    </div>
  );
};

export default LearningPanel;
