import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';

interface Image {
  id: string;
  url: string;
  description?: string;
  name: string;
  index: number;
}

/* eslint-disable-next-line */
export interface UiGalleryProps {}

export function UiGallery(_props: UiGalleryProps) {
  const isNotSmallScreen = useMediaQuery('(min-width:600px)');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState<Image[]>([]);
  useEffect(() => {
    let ignore = false;
    const getImages = async () => {
      const res = await fetch(
        import.meta.env.VITE_SERVER_URL + `/image?page=${page}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }
      if (!ignore) {
        setImages(data);
      }
    };
    getImages();
    return () => {
      ignore = true;
    };
  }, [setImages, page]);
  return (
    <Box paddingX={'1em'}>
      <ImageList cols={isNotSmallScreen ? 4 : 2}>
        {images.map((image) => (
          <ImageListItem key={image.id}>
            <img src={image.url} alt={image.description} loading="lazy" />
            <ImageListItemBar
              title={image.name}
              subtitle={image.description}
            ></ImageListItemBar>
          </ImageListItem>
        ))}
      </ImageList>
      <Box>
        <Grid container justifyContent={'center'}>
          <Grid container justifyContent={'center'}>
            <Grid>
              <Button onClick={() => setPage(1)}>&lt;&lt;</Button>
            </Grid>
            <Grid>
              <Button onClick={() => setPage(page - 1)}>&lt;</Button>
            </Grid>
            <Grid>
              <Box width={'4em'}>
                <TextField
                  sx={{ width: '100%' }}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!/\d/.test(value)) {
                      // @ts-expect-error target.value should be a string, but material UI lets us make it act as a number and using page.toString() will result in NaN
                      e.target.value = page;
                      return;
                    }
                    setPage(Number.parseInt(e.target.value));
                  }}
                  placeholder="page number"
                >
                  {page}
                </TextField>
              </Box>
            </Grid>
            <Grid>
              <Button onClick={() => setPage(page + 1)}>&gt;</Button>
            </Grid>
            <Grid>
              <Button onClick={() => setPage(100)}>&gt;&gt;</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default UiGallery;
