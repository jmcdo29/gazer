import { Image as ImageType } from '@gazer/shared/types';
import { User } from '@gazer/ui/store';
import { postData } from '@gazer/ui/utils';
import PinFirst from '@mui/icons-material/KeyboardDoubleArrowUp';
import PushPin from '@mui/icons-material/PushPin';
import { IconButton, ImageListItemBar } from '@mui/material';
import { NavigateFunction } from 'react-router-dom';

export const Image = ({
  image,
  navigate,
  user,
}: {
  image: ImageType & { type: 'image' };
  navigate: NavigateFunction;
  user?: User;
}) => {
  const pin = async (image: ImageType, first = false): Promise<void> => {
    const body: { sticky: boolean; stickyIndex?: number } = {
      sticky: !image.sticky,
    };
    if (first) {
      body.stickyIndex = 1;
    }
    await postData(`image/${image.id}`, body, user, 'PATCH');
  };
  return (
    <>
      <img
        src={image.url}
        alt={image.description}
        loading="lazy"
        onClick={() => {
          navigate(image.id);
        }}
      />
      <ImageListItemBar
        title={image.name}
        subtitle={image.description}
        sx={{ paddingX: '0.5em', cursor: 'default' }}
        actionIcon={
          user?.id ? (
            <>
              <IconButton
                color={image.sticky ? 'secondary' : 'primary'}
                onClick={() => pin(image)}
              >
                <PushPin />
              </IconButton>
              <IconButton
                color={
                  image.sticky && image.stickyIndex === 1
                    ? 'secondary'
                    : 'primary'
                }
                onClick={() => pin(image, true)}
                disabled={image.stickyIndex === 1}
              >
                <PinFirst />
              </IconButton>
            </>
          ) : (
            ''
          )
        }
      ></ImageListItemBar>
    </>
  );
};
