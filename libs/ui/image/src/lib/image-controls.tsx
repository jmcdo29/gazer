import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Unstable_Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ImageControlsProps {
  editing: boolean;
  setEditing: (val: boolean) => Promise<void>;
  isAdmin: boolean;
  deleteImage: () => Promise<void>;
}

const ControlButton = ({
  action,
  children,
}: {
  action: () => void | Promise<void>;
  children: React.ReactNode;
}) => (
  <Button variant="contained" sx={{ marginX: '0.25em' }} onClick={action}>
    {children}
  </Button>
);

export const ImageControls = ({
  editing,
  setEditing,
  isAdmin,
  deleteImage,
}: ImageControlsProps) => {
  const navigate = useNavigate();
  return (
    <Grid container justifyContent={'center'}>
      <Grid>
        <ControlButton action={() => navigate('/')}>Go Back</ControlButton>
      </Grid>
      <Grid xs={1} sm={5} md={9}>
        <Box />
      </Grid>
      <Grid>
        {isAdmin ? (
          <Box>
            {editing ? (
              <ControlButton action={() => setEditing(false)}>
                Cancel
              </ControlButton>
            ) : (
              <Box />
            )}
            <ControlButton action={() => setEditing(true)}>
              {editing ? 'Save' : 'Edit'}
            </ControlButton>
            <ControlButton action={deleteImage}>
              <DeleteIcon />
            </ControlButton>
          </Box>
        ) : (
          <Box />
        )}
      </Grid>
    </Grid>
  );
};
