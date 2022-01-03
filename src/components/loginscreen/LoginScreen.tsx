import {Link, Container, CssBaseline, Box, Typography, TextField, Button, Grid} from '@mui/material';
import {ReactElement, useState} from 'react';
import {BACKEND_URL} from '../../globals';

const LoginScreen = (props: {login: (userId: number) => void}): ReactElement => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [userNameText, setUserNameText] = useState<string>('');
  const [userIdText, setUserIdText] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRegistering) {
      if (userNameText !== '') {
        const data = new URLSearchParams([['user_name', userNameText]]);
        fetch(
          BACKEND_URL + '/user/register',
          {
            method: 'POST',
            body: data,
            credentials: 'include'
          }
        )
          .then((response) => response.text())
          .then((result) => {
            props.login(Number(result));
          })        
          .catch((error) => {
            console.error('Error:', error);
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
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h5">
            {isRegistering ? 'Sign up' : 'Sign in'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            {isRegistering 
              ? <TextField
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
              : <TextField
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
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => {
                  setIsRegistering(!isRegistering);
                }}>
                  {isRegistering ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginScreen;

