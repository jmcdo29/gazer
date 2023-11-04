import type { GetImages } from '@gazer/shared/types';
import { UserContext } from '@gazer/ui/store';
import { BASE_URL } from '@gazer/ui/utils';
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Unstable_Grid2 as Grid,
  useMediaQuery,
} from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Folder } from './folder';
import { GalleryNav } from './gallery-nav';
import { Image } from './image';

export function UiGallery() {
  const user = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const isNotSmallScreen = useMediaQuery('(min-width:600px)');
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get('page') ?? '1')
  );
  const [images, setImages] = useState<GetImages>([]);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();
  const historyIndex = window.history.state.idx;
  const inFolder = searchParams.has('parentId');
  const setSearch = useCallback(
    (val: { page: number; parentId?: string }): void => {
      let paramsHaveChanged = false;
      const searchParamsObj: {
        page: string;
        latestIndex?: string;
        parentId?: string;
      } = {
        page: val.page.toString(),
      };
      let newPage = val.page;
      if (newPage < 1) {
        newPage = page;
      }
      if (newPage > maxPage) {
        newPage = maxPage;
      }
      if (newPage !== page) {
        setPage(newPage);
        paramsHaveChanged = true;
        // if (val !== 1) {
        //   searchParamsObj.latestIndex = images[images.length - 1].id.toString();
        // }
      }
      if (val.parentId) {
        searchParamsObj.parentId = val.parentId;
      }
      if (paramsHaveChanged) {
        setSearchParams(searchParamsObj);
      }
    },
    [setSearchParams, setPage, page, maxPage]
  );
  useEffect(() => {
    let ignore = false;
    const getImages = async () => {
      const parentId = searchParams.get('parentId');
      let url = `${BASE_URL}/image?page=${page}`;
      // if (page !== 1) {
      //   url += `&latestIndex=${images[images.length - 1].index}`;
      // }
      if (parentId) {
        url += `&parentId=${parentId}`;
      }
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
        setSearch({ page: maxPage, parentId: parentId ?? undefined });
        return;
      }
    };
    getImages();
    return () => {
      ignore = true;
    };
  }, [page, setSearch, maxPage, searchParams]);

  return (
    <Box paddingX={'1em'}>
      <Grid container>
        <Grid>
          {historyIndex && inFolder ? (
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          ) : (
            <Box />
          )}
        </Grid>
        <Grid flexGrow={1} />
        <Grid>
          {user.id ? (
            <Button onClick={() => navigate('/new/folder')}>New Folder</Button>
          ) : (
            <Box />
          )}
        </Grid>
      </Grid>
      <ImageList cols={isNotSmallScreen ? 4 : 2} gap={16}>
        {images.map((image) => (
          <ImageListItem key={image.id} sx={{ cursor: 'pointer' }}>
            {image.type === 'image' ? (
              <Image image={image} navigate={navigate} user={user} />
            ) : (
              <Folder folder={image} navigate={navigate} />
            )}
          </ImageListItem>
        ))}
      </ImageList>
      <GalleryNav page={page} setPage={setSearch} totalPages={maxPage} />
    </Box>
  );
}

export default UiGallery;
