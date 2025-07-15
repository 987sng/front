import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import addLogo from 'assets/images/국방과학연구소 로고.png'; // 실제 로고 경로

export default function LogoMain() {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <img
        src={addLogo}
        alt="Agency for Defense Development"
        width="70"
        height="30"
        style={{ objectFit: 'contain' }}
      />
      <Typography variant="h5" color="textPrimary" fontWeight={550}>
        국방과학연구소
      </Typography>
    </Stack>
  );
}
