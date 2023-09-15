import { UiFooter } from '@gazer/ui/footer';
import { UiNav } from '@gazer/ui/nav';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Link as RouterLink, Outlet, Route, Routes } from 'react-router-dom';

/* eslint-disable-next-line */
export interface UiRouterProps {}

const Root = () => {
  const theme = useTheme();

  return (
    <Box>
      <UiNav />
      <Box
        bgcolor={theme.palette.background.default}
        minHeight="85vh"
        padding={`${theme.spacing(3)} ${theme.spacing(2)}`}
      >
        <Outlet />
      </Box>
      <UiFooter />
    </Box>
  );
};

export function UiRouter(_props: UiRouterProps) {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route
          index
          element={
            <div>
              This is the generated root route.{' '}
              <Link component={RouterLink} to="/page-2">
                Click here for page 2.
              </Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link component={RouterLink} to="/">
                Click here to go back to root page.
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default UiRouter;
