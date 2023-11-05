import { Folder, UpdateImage } from '@gazer/shared/types';
import { UserContext } from '@gazer/ui/store';
import { BASE_URL, postData } from '@gazer/ui/utils';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EditableField } from './editable-field';
import { ImageControls } from './image-controls';

export function UiImage() {
  const user = useContext(UserContext);
  const { id: imageId } = useParams();
  const [image, setImage] = useState<
    (UpdateImage & { id: string; url: string; folderName: string }) | undefined
  >(undefined);
  const [tempImage, setTempImage] = useState<
    (UpdateImage & { id: string; url: string; folderName: string }) | undefined
  >(image);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let ignore = false;
    const getImage = async () => {
      const res = await fetch(`${BASE_URL}/image/${imageId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }
      if (!ignore) {
        setImage(data);
        setTempImage(data);
      }
    };
    getImage();
    return () => {
      ignore = true;
    };
  }, [setImage, imageId]);
  const [existingFolders, setExistingFolders] = useState<Folder[]>([]);
  useEffect(() => {
    let ignore = false;
    const getFolders = async () => {
      const res = await fetch(`${BASE_URL}/folder`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }
      if (!ignore) {
        setExistingFolders(data);
      }
    };
    getFolders();
    return () => {
      ignore = true;
    };
  }, [setExistingFolders]);
  const save = async (val: boolean) => {
    if (!val && editing) {
      setEditing(false);
      setTempImage(image);
      return;
    }
    if (val && !editing) {
      setEditing(true);
      return;
    }
    await postData(
      `image/${image?.id}`,
      {
        name: tempImage?.name,
        description: tempImage?.description,
        folderId: tempImage?.folderId,
      },
      user,
      'PATCH'
    );
    setImage(tempImage);
    setEditing(false);
  };
  const deleteImage = async () => {
    await postData(`image/${image?.id}`, {}, user, 'DELETE');
    navigate('/');
  };
  return (
    <Box>
      <ImageControls
        editing={editing}
        setEditing={save}
        isAdmin={!!user.id}
        deleteImage={deleteImage}
      />
      {image && tempImage ? (
        <Grid container justifyContent={'center'} alignItems="center">
          <Grid>
            <EditableField
              value={tempImage?.name ?? ''}
              editing={editing}
              setField={(val: string) =>
                setTempImage({ ...tempImage, name: val })
              }
            >
              <Typography variant="h1" fontSize="3em">
                {image.name}
              </Typography>
            </EditableField>
          </Grid>
          <Grid xs={12}>
            <Box display={'flex'}>
              <img
                src={image.url}
                alt={image.description}
                title={image.name}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  margin: 'auto',
                  width: 'auto',
                }}
              />
            </Box>
          </Grid>
          <Grid>
            <EditableField
              value={tempImage?.description ?? ''}
              editing={editing}
              setField={(val: string) =>
                setTempImage({ ...tempImage, description: val })
              }
            >
              <Typography variant="body1" fontSize="1.5em">
                {image.description}
              </Typography>
            </EditableField>
          </Grid>
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {editing ? (
              <Select
                displayEmpty
                id="existing-folders"
                label="Folder"
                value={image.folderId ?? ''}
                onChange={(e: SelectChangeEvent<string>) =>
                  setTempImage({ ...tempImage, folderId: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  <em>Choose a Parent Folder</em>
                </MenuItem>
                {existingFolders.map((folder) => (
                  <MenuItem key={folder.name} value={folder.id}>
                    {folder.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      ) : (
        'Loading...'
      )}
    </Box>
  );
}

export default UiImage;
