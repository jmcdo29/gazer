import Heart from '@mui/icons-material/Favorite';
import { useTheme } from '@mui/material';
import {
  Box,
  Divider,
  Link,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';

export const UiFooter = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Divider />
      <Grid
        container
        columns={1}
        sx={{ justifyContent: 'center', justifyItems: 'center' }}
      >
        <Grid>
          Made with <Heart color="primary" display="inline-block" /> by&nbsp;
          <Link
            href="https://github.com/jmcdo29"
            display="inline-flex"
            color="primary"
          >
            <Typography component={Box}>Jay McDoniel</Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
