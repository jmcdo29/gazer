import { UiFooter } from '@gazer/ui/footer';
import { UiGallery } from '@gazer/ui/gallery';
import { UiImage, UiNewImage } from '@gazer/ui/image';
import { UiLogin } from '@gazer/ui/login';
import { UiNav } from '@gazer/ui/nav';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { Outlet, Route, Routes } from 'react-router-dom';

/* eslint-disable-next-line */
export interface UiRouterProps {
  setUser: (user: Record<string, string>) => void;
}

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

export function UiRouter(props: UiRouterProps) {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<UiGallery />} />
        <Route
          path="login"
          element={<UiLogin setUser={props.setUser} />}
        ></Route>
        <Route path="new" element={<UiNewImage />}></Route>
        <Route path=":id" element={<UiImage />}></Route>
      </Route>
    </Routes>
  );
}

export default UiRouter;
