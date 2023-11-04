import { Folder } from '@gazer/shared/types';
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
import { useNavigate, useParams } from 'react-router-dom';

export const UiUpdateFolder = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();
  if (!params.id) {
    throw new Error('This page can only be accessed with an id');
  }
  const [form, setForm] = useState<{
    id: string;
    name: string;
    parentId?: string;
  }>({
    id: params.id,
    name: '',
    parentId: '',
  });
  const [existingFolders, setExistingFolders] = useState<Folder[]>([]);
  useEffect(() => {
    let ignore = false;
    const getFolders = async () => {
      const res = await fetch(`${BASE_URL}/folder/${form.id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }
      if (!ignore) {
        setForm({ ...data, parentId: data.parentId ?? '' });
      }
    };
    if (!form.name) {
      getFolders();
    }
    return () => {
      ignore = true;
    };
  }, [setForm, form]);
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
    if (!form.name) {
      getFolders();
    }
    return () => {
      ignore = true;
    };
  }, [setExistingFolders, form]);
  const save = async () => {
    await postData(
      `folder/${form.id}`,
      { ...form, parentId: form.parentId || undefined },
      user,
      'PATCH'
    );
    let url = '/';
    if (form.parentId) {
      url += `?parentId=${form.parentId}`;
    }
    navigate(url);
  };
  return (
    <Box>
      <Grid container justifyContent={'center'} alignItems="center" spacing={2}>
        <Grid xs={9} display="flex" justifyContent="center" alignItems="center">
          <TextField
            type="string"
            value={form.name}
            label="Name"
            required={true}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Grid>
        <Grid xs={9} display="flex" justifyContent="center" alignItems="center">
          <Select
            displayEmpty
            id="existing-folders"
            label="Folder"
            value={form.parentId}
            onChange={(e: SelectChangeEvent<string>) =>
              setForm({ ...form, parentId: e.target.value })
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
        <Grid xs={9} display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" onClick={save}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
