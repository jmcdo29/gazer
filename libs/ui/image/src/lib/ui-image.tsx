import { UserContext } from '@gazer/ui/store';
import { BASE_URL, postData } from '@gazer/ui/utils';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EditableField } from './editable-field';
import { ImageControls } from './image-controls';

interface Image {
  id: string;
  url: string;
  description?: string;
  name: string;
  index: number;
}

export function UiImage() {
  const user = useContext(UserContext);
  const { id: imageId } = useParams();
  const [image, setImage] = useState<Image | undefined>(undefined);
  const [tempImage, setTempImage] = useState<Image | undefined>(image);
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
      { name: tempImage?.name, description: tempImage?.description },
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
        </Grid>
      ) : (
        'Loading...'
      )}
    </Box>
  );
}

export default UiImage;