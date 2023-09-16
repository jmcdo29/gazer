import AccountBox from '@mui/icons-material/AccountBox';
import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Unstable_Grid2';
import { Link as RouterLink } from 'react-router-dom';

/* eslint-disable-next-line */
export interface UiNavProps {}

export function UiNav(_props: UiNavProps) {
  const theme = useTheme();
  return (
    <Box
      role="navigation"
      aria-roledescription="navigation"
      height={'3em'}
      bgcolor={theme.palette.primary.dark}
    >
      <Grid container>
        <Grid xs marginLeft={'0.5em'}>
          <Link component={RouterLink} to="/" display="inline-flex">
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
          <Link component={RouterLink} to="/">
            <AccountBox fontSize="large" color={'secondary'} />
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UiNav;
