import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';

interface GalleryNavProps {
  page: number;
  setPage: (val: number) => void;
  totalPages: number;
}

const NavButton = ({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled: boolean;
}) => (
  <Grid>
    <Button
      sx={{ width: '3em', minWidth: '3em' }}
      onClick={onClick}
      variant="contained"
      disabled={disabled}
    >
      {children}
    </Button>
  </Grid>
);

export const GalleryNav = ({ page, setPage, totalPages }: GalleryNavProps) => {
  const [currentPage, setCurrentPage] = useState(page);
  const changePage = (val: number) => {
    setPage(val);
  };
  return (
    <Box>
      <Grid container justifyContent={'center'}>
        <Grid container justifyContent={'center'} columnGap={'0.25em'}>
          <NavButton onClick={() => changePage(1)} disabled={page <= 1}>
            &lt;&lt;
          </NavButton>
          <NavButton onClick={() => changePage(page - 1)} disabled={page <= 1}>
            &lt;
          </NavButton>
          <Grid justifyContent={'center'}>
            <Box width={'4em'}>
              <Grid container columns={1} justifyContent={'center'}>
                <Grid>
                  <TextField
                    sx={{ width: '100%' }}
                    size="small"
                    value={page}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPage(e.target.value as unknown as number);
                    }}
                    onBlur={() => {
                      if (!/[0-9]+/.test(page.toString())) {
                        setPage(currentPage);
                        return;
                      }
                      if (page < 1) {
                        setPage(currentPage);
                        return;
                      }
                      if (currentPage > totalPages) {
                        setPage(totalPages);
                      }
                      setCurrentPage(page);
                    }}
                    placeholder="page number"
                  >
                    {page}
                  </TextField>
                </Grid>
                <Grid>
                  <div>of {totalPages}</div>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <NavButton
            onClick={() => changePage(page + 1)}
            disabled={page >= totalPages}
          >
            &gt;
          </NavButton>
          <NavButton
            onClick={() => changePage(100)}
            disabled={page >= totalPages}
          >
            &gt;&gt;
          </NavButton>
        </Grid>
      </Grid>
    </Box>
  );
};
