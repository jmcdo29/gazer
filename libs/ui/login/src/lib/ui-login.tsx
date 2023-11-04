import { User, UserContext } from '@gazer/ui/store';
import { postData } from '@gazer/ui/utils';
import {
  Box,
  Button,
  TextField as TextInput,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UiLoginProps {
  setUser: (user: User) => void;
}

const LoginComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid xs={12} container marginY={'0.5em'}>
      <Grid xs={2} lg={5} />
      <Grid xs={7} lg={2}>
        {children}
      </Grid>
      <Grid xs={2} lg={5} />
    </Grid>
  );
};

const LoginError = ({
  messages,
  closeError,
}: {
  messages: string[];
  closeError: () => void;
}) => {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.grey[600]}
      padding={theme.spacing(1)}
      borderRadius={theme.shape.borderRadius}
    >
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <Button onClick={closeError} color="error">
        <Typography color={theme.palette.error.main}>X</Typography>
      </Button>
    </Box>
  );
};

export function UiLogin(props: UiLoginProps) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  useEffect(() => {
    if (user.id) {
      navigate('/');
    }
  }, [user, navigate]);

  const login = async () => {
    try {
      const data = await postData('auth/login', form);
      props.setUser(data as unknown as User);
      navigate('/');
    } catch (err) {
      if (
        typeof err !== 'object' ||
        err === undefined ||
        err === null ||
        !('message' in err) ||
        typeof err.message !== 'string'
      ) {
        throw err;
      }
      const data = JSON.parse(err.message);
      if (typeof data === 'object' && 'message' in data) {
        if (Array.isArray(data.message)) {
          setErrorMessages(
            data.message.map((m: unknown) => {
              if (typeof m === 'object' && m !== null) {
                if ('message' in m) {
                  return m.message;
                }
                return m.toString();
              }
              if (typeof m === 'string') {
                return m;
              }
              return m !== null && m !== undefined
                ? m.toString()
                : 'Unknown Error';
            })
          );
        } else {
          setErrorMessages([data.message]);
        }
        setShowError(true);
        return;
      }
    }
  };
  return (
    <Grid container justifyContent={'space-around'}>
      <LoginComponent>
        <TextInput
          type="email"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </LoginComponent>
      <LoginComponent>
        <TextInput
          type="password"
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </LoginComponent>
      <LoginComponent>
        <Button onClick={login}>Login</Button>
      </LoginComponent>
      {showError ? (
        <LoginComponent>
          <LoginError
            messages={errorMessages}
            closeError={() => setShowError(false)}
          />
        </LoginComponent>
      ) : (
        ''
      )}
    </Grid>
  );
}

export default UiLogin;
