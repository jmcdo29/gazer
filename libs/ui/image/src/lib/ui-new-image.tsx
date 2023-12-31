import { CreateImage, Folder } from '@gazer/shared/types';
import { UserContext } from '@gazer/ui/store';
import { BASE_URL, postData } from '@gazer/ui/utils';
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UiNewImage = () => {
  const reader = new FileReader();
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateImage & { file: File | null }>({
    name: '',
    description: '',
    file: null,
    folderId: '',
  });
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const save = async () => {
    const formData = new FormData();
    formData.set('name', form.name);
    formData.set('description', form.description ?? '');
    if (form.file) {
      formData.set('file', form.file, form.name);
    }
    const data = await postData('image', formData, user);
    navigate(`/${data.id}`);
  };
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
  return (
    <Box>
      <Grid container columns={2}>
        <Grid
          container
          justifyContent={'center'}
          alignItems="center"
          spacing={2}
          xs={1}
        >
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              type="string"
              value={form.name}
              label="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                const file = files && files.length ? files[0] : null;
                setForm({ ...form, file });
                reader.onload = (e) => {
                  setImageUrl(e.target?.result?.toString() ?? undefined);
                };
                if (file) {
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Grid>
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              type="string"
              value={form.description}
              label="Description"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Grid>
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Select
              displayEmpty
              id="existing-folders"
              label="Folder"
              value={form.folderId}
              onChange={(e: SelectChangeEvent<string>) =>
                setForm({ ...form, folderId: e.target.value })
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
          </Grid>
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button variant="contained" onClick={save}>
              Submit
            </Button>
          </Grid>
        </Grid>
        <Grid xs={1}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={'To be uploaded'}
              style={{
                width: 'inherit',
                objectFit: 'cover',
              }}
            />
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
