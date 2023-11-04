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
import { useNavigate } from 'react-router-dom';

export const UiCreateFolder = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    name: string;
    parentId?: string;
  }>({
    name: '',
    parentId: '',
  });
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
  const save = async () => {
    await postData(
      'folder',
      { ...form, parentId: form.parentId || undefined },
      user
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
