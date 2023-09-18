import { User, UserContext } from '@gazer/ui/store';
import AccountBox from '@mui/icons-material/AccountBox';
import PlusIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Unstable_Grid2';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface UiNavProps {
  setUser: (user: User) => void;
}

export function UiNav(props: UiNavProps) {
  const user = useContext(UserContext);
  const theme = useTheme();
  const logout = () => {
    sessionStorage.setItem('userId', '');
    sessionStorage.setItem('sessionToken', '');
    sessionStorage.setItem('refreshToken', '');
    props.setUser({
      id: '',
      sessionToken: '',
      refreshToken: '',
    });
  };
  return (
    <Box
      role="navigation"
      aria-roledescription="navigation"
      height={'3em'}
      bgcolor={theme.palette.primary.dark}
    >
      <Grid container>
        <Grid xs marginLeft={'0.5em'}>
          <Link
            component={RouterLink}
            to="/"
            display="inline-flex"
            underline="none"
          >
            <Typography color={theme.palette.secondary.dark} fontSize={'2em'}>
              ClippyClips
            </Typography>
            <img
              src="/clippy.png"
              alt="A paperclip with eyes that kind of make it look like it hasa face"
              height="48px"
            />
          </Link>
        </Grid>
        <Grid xs={2} md={6} lg={9}>
          <Box />
        </Grid>
        <Grid
          xs
          display={'inline-flex'}
          justifyContent={'right'}
          marginTop={'0.5em'}
          marginRight={'0.5em'}
        >
          {user.id ? (
            <Link component={RouterLink} to="/new" marginRight={'1em'}>
              <PlusIcon fontSize="large" color={'secondary'} />
            </Link>
          ) : (
            ''
          )}

          <Link component={RouterLink} to="/login" marginRight={'1em'}>
            <AccountBox fontSize="large" color={'secondary'} />
          </Link>

          {user.id ? (
            <LogoutIcon
              fontSize="large"
              color={'secondary'}
              onClick={logout}
              cursor={'pointer'}
            />
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default UiNav;
