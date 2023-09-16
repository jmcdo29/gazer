import { UiFooter } from '@gazer/ui/footer';
import { UiGallery } from '@gazer/ui/gallery';
import { UiNav } from '@gazer/ui/nav';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { Outlet, Route, Routes } from 'react-router-dom';

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
        <Route index element={<UiGallery />} />
      </Route>
    </Routes>
  );
}

export default UiRouter;
