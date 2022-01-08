import {LoadingButton} from '@mui/lab';
import {Link, Container, CssBaseline, Box, Typography, TextField, Grid, Alert, Collapse} from '@mui/material';
import {ReactElement, useState} from 'react';
import {BACKEND_URL} from '../../globals';
import './LoginScreen.scss';

const LoginScreen = (props: {login: (userId: number) => void; isLoginSuccessful?: boolean; isLoginLoading: boolean}): ReactElement => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [userNameText, setUserNameText] = useState<string>('');
  const [userIdText, setUserIdText] = useState<string>('');
  const [isRegisterSuccessful, setIsRegisterSuccessful] = useState<boolean>();
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const isLoginSuccessful = props.isLoginSuccessful;
  const isLoginLoading = props.isLoginLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRegistering) {
      if (userNameText !== '') {
        setIsRegisterLoading(true);
        const data = new URLSearchParams([['user_name', userNameText]]);
        fetch(
          BACKEND_URL + '/user/register',
          {
            method: 'POST',
            body: data,
            credentials: 'include'
          }
        )
          .then((response) => {
            if (response.ok) {
              setIsRegisterSuccessful(true);
              response.text()
                .then((result) => {
                  props.login(Number(result));
                });
            } else {
              setIsRegisterSuccessful(false);
            }
            setIsRegisterLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setIsRegisterSuccessful(false);
            setIsRegisterLoading(false);
          });
      }
    } else {
      if (userIdText !== '') {
        props.login(Number(userIdText));
      }
    }
  };
  return (
    <div className="LoginScreen">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          className="panel"
        >
          <Typography component="h1" variant="h5">
            {isRegistering ? 'Sign up' : 'Sign in'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            <div className="login-form">
              {isRegistering 
                ? (
                  <>
                    <TextField
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                      value={userNameText}
                      onChange={(e) => {
                        setUserNameText(e.target.value);
                      }}
                    />
                    <Collapse in={isRegisterSuccessful === false}>
                      <Alert
                        severity="error"
                        sx={{mb: 2}}
                      >
                        Error: Sign-up failed
                      </Alert>
                    </Collapse>
                  </>
                )
                : (
                  <>
                    <TextField
                      name="user_id"
                      required
                      fullWidth
                      id="user_id"
                      label="User ID"
                      autoFocus
                      value={userIdText}
                      onChange={(e) => {
                        setUserIdText(e.target.value);
                      }}
                    />
                    <Collapse in={isLoginSuccessful === false}>
                      <Alert
                        severity="error"
                        sx={{mb: 2}}
                      >
                        Error: Sign-in failed
                      </Alert>
                    </Collapse>
                  </>
                )
              }
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                loading={isRegistering ? isRegisterLoading : isLoginLoading}
              >
                {isRegistering ? 'Sign Up' : 'Sign In'}
              </LoadingButton>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" onClick={() => {
                    setIsRegistering(!isRegistering);
                  }}>
                    {isRegistering ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign Up'}
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginScreen;

