import { UiCreateFolder, UiUpdateFolder } from '@gazer/ui/folder';
import { UiFooter } from '@gazer/ui/footer';
import { UiGallery } from '@gazer/ui/gallery';
import { UiImage, UiNewImage } from '@gazer/ui/image';
import { UiLogin } from '@gazer/ui/login';
import { UiNav } from '@gazer/ui/nav';
import { User } from '@gazer/ui/store';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { Outlet, Route, Routes } from 'react-router-dom';

export interface UiRouterProps {
  setUser: (user: User) => void;
}

interface RootProps {
  setUser: (user: User) => void;
}

const Root = ({ setUser }: RootProps) => {
  const theme = useTheme();

  return (
    <Box>
      <UiNav setUser={setUser} />
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
      <Route path="/" element={<Root setUser={props.setUser} />}>
        <Route index element={<UiGallery />} />
        <Route path="login" element={<UiLogin setUser={props.setUser} />} />
        <Route path="new/image" element={<UiNewImage />} />
        <Route path="edit/folder/:id" element={<UiUpdateFolder />} />
        <Route path="new/folder" element={<UiCreateFolder />} />
        <Route path=":id" element={<UiImage />} />
      </Route>
    </Routes>
  );
}

export default UiRouter;
