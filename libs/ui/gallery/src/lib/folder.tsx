import { Folder as FolderType } from '@gazer/shared/types';
import { User } from '@gazer/ui/store';
import Pencil from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import { IconButton, ImageListItemBar } from '@mui/material';
import { NavigateFunction } from 'react-router-dom';

export const Folder = ({
  folder,
  navigate,
  user,
}: {
  folder: FolderType;
  navigate: NavigateFunction;
  user?: User;
}) => {
  return (
    <>
      <IconButton
        onClick={() => navigate(`?parentId=${folder.id}`)}
        sx={{ height: 'unset', width: 'unset' }}
      >
        <FolderIcon sx={{ width: 'unset', height: 'unset' }} />
      </IconButton>
      <ImageListItemBar
        title={folder.name}
        sx={{ paddingX: '0.5em', cursor: 'default' }}
        actionIcon={
          user?.id ? (
            <IconButton
              color="primary"
              onClick={() => navigate(`/edit/folder/${folder.id}`)}
            >
              <Pencil />
            </IconButton>
          ) : (
            ''
          )
        }
      />
    </>
  );
};
