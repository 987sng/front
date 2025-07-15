import { useTheme } from '@mui/material/styles';
import addIcon from 'assets/images/국방과학연구소 로고.png'; // 실제 아이콘 파일 경로에 맞춰 수정

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <img
      src={addIcon}
      alt="ADD Icon"
      width="29"
      height="129"
      style={{ objectFit: 'contain' }}
    />
  );
}
