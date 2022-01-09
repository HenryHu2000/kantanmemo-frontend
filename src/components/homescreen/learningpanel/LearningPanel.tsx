import {ReactElement, useCallback, useEffect, useState} from 'react';
import {Alert, Box, Button, ButtonGroup, CircularProgress, Container, Fade, IconButton, Snackbar, Typography} from '@mui/material';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
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
  const [isUndoAlertOpen, setIsUndoAlertOpen] = useState<boolean>(false);
  const [isUndone, setIsUndone] = useState<boolean>(false);

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
                        if (panelState === PanelState.QUESTION) {
                          setIsUndone(false);
                          setIsUndoAlertOpen(true);
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
                        setIsUndoAlertOpen(false);
                      }}
                      loading={isLoading}
                    >
                      Next
                    </LoadingButton>
                  </ButtonGroup>
                </Container>
                <Snackbar className="undo-alert-bar" 
                  open={isUndoAlertOpen} 
                  autoHideDuration={6000}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                  onClose={() => {
                    setIsUndoAlertOpen(false);
                  }}
                  TransitionComponent={Fade}
                  sx={{left: {xs: 0, sm: '50%'}}}
                >
                  <Container maxWidth="sm">
                    <Alert 
                      severity={!isUndone ? 'success' : 'info'} sx={{width: '100%'}}
                      action={
                        <>
                          {!isUndone && (
                            <Button color="inherit" size="small" onClick={() => {
                              setIsKnown(false);
                              setIsUndone(true);
                            }}>
                              UNDO
                            </Button>
                          )}
                          <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => {
                              setIsUndoAlertOpen(false);
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      }
                    >
                      {!isUndone ? 'Finished learning this word' : 'This word will appear again'}
                    </Alert>
                  </Container>
                </Snackbar>
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
