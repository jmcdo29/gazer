import { BASE_URL } from '@gazer/ui/utils';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { GalleryNav } from './gallery-nav';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const isNotSmallScreen = useMediaQuery('(min-width:600px)');
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get('page') ?? '1')
  );
  const [images, setImages] = useState<Image[]>([]);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();
  const setSearch = useCallback(
    (val: number): void => {
      if (val < 1) {
        val = page;
      }
      if (val > maxPage) {
        val = maxPage;
      }
      if (val !== page) {
        setPage(val);
        const searchParamsObj: { page: string; latestIndex?: string } = {
          page: val.toString(),
        };
        // if (val !== 1) {
        //   searchParamsObj.latestIndex = images[images.length - 1].id.toString();
        // }
        setSearchParams(searchParamsObj);
      }
    },
    [setSearchParams, setPage, page, maxPage]
  );
  useEffect(() => {
    let ignore = false;
    const getImages = async () => {
      const url = `${BASE_URL}/image?page=${page}`;
      // if (page !== 1) {
      //   url += `&latestIndex=${images[images.length - 1].index}`;
      // }
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }
      if (!ignore) {
        setImages(data.images);
        const totalImages = data.count;
        const maxPages = Math.floor(totalImages / 20) + 1;
        if (maxPages !== maxPage) {
          setMaxPage(maxPages);
        }
      }
      if (data.images.length === 0) {
        setSearch(maxPage);
        return;
      }
    };
    getImages();
    return () => {
      ignore = true;
    };
  }, [page, setSearch, maxPage]);
  return (
    <Box paddingX={'1em'}>
      <ImageList cols={isNotSmallScreen ? 4 : 2} gap={16}>
        {images.map((image) => (
          <ImageListItem
            key={image.id}
            onClick={() => {
              navigate(image.id);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <img src={image.url} alt={image.description} loading="lazy" />
            <ImageListItemBar
              title={image.name}
              subtitle={image.description}
            ></ImageListItemBar>
          </ImageListItem>
        ))}
      </ImageList>
      <GalleryNav page={page} setPage={setSearch} totalPages={maxPage} />
    </Box>
  );
}

export default UiGallery;
