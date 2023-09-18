import { UserContext } from '@gazer/ui/store';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EditableField } from './editable-field';
import { ImageControls } from './image-controls';

interface Image {
  id: string;
  url: string;
  description?: string;
  name: string;
  index: number;
}

const baseUrl = import.meta.env.VITE_SERVER_URL;

export function UiImage() {
  const user = useContext(UserContext);
  const { id: imageId } = useParams();
  const [image, setImage] = useState<Image | undefined>(undefined);
  const [tempImage, setTempImage] = useState<Image | undefined>(image);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    let ignore = false;
    const getImage = async () => {
      const res = await fetch(`${baseUrl}/image/${imageId}`);
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
    console.log({ val, editing });
    if (!val && editing) {
      setEditing(false);
      setTempImage(image);
      return;
    }
    if (val && !editing) {
      setEditing(true);
      return;
    }
    await fetch(`${baseUrl}/image/${image?.id}`, {
      method: 'PATCH',
      body: JSON.stringify(image),
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
    setImage(tempImage);
    setEditing(false);
  };
  const deleteImage = async () => {
    await fetch(`${baseUrl}/image/${image?.id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
  };
  return (
    <Box>
      <ImageControls
        editing={editing}
        setEditing={save}
        isAdmin={!!user.id}
        deleteImage={deleteImage}
      />
      {image ? (
        <Grid container justifyContent={'center'} alignItems="center">
          <Grid>
            <EditableField
              value={tempImage?.name ?? ''}
              editing={editing}
              setField={(val: string) => setTempImage({ ...image, name: val })}
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
                setTempImage({ ...image, description: val })
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
