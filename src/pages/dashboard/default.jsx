// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Card, CardContent } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';
import EarthGlobe from 'components/EarthGlobe';
import InternalNetwork from 'components/InternalNetwork';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// Network topology sample data for security monitoring
const networkData = {
  nodes: [
    { id: 'Internet', group: 1 },
    { id: 'Firewall', group: 2 },
    { id: 'DMZ-Server', group: 3 },
    { id: 'Core-Switch', group: 4 },
    { id: 'Web-Server', group: 5 },
    { id: 'DB-Server', group: 5 },
    { id: 'Admin-PC', group: 6 },
    { id: 'User-PC-1', group: 6 },
    { id: 'User-PC-2', group: 6 },
    { id: 'IDS/IPS', group: 7 }
  ],
  links: [
    { source: 'Internet', target: 'Firewall' },
    { source: 'Firewall', target: 'DMZ-Server' },
    { source: 'Firewall', target: 'Core-Switch' },
    { source: 'Core-Switch', target: 'Web-Server' },
    { source: 'Core-Switch', target: 'DB-Server' },
    { source: 'Core-Switch', target: 'Admin-PC' },
    { source: 'Core-Switch', target: 'User-PC-1' },
    { source: 'Core-Switch', target: 'User-PC-2' },
    { source: 'Core-Switch', target: 'IDS/IPS' },
    { source: 'Web-Server', target: 'DB-Server' }
  ]
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  return (
    <Grid container rowSpacing={6} columnSpacing={3}>
      {/* row 1 - Header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">보안 모니터링 대시보드</Typography>
      </Grid>
      
      {/* row 2 - Statistics Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="일일 총 네트워크 공격" count="4,42,236" percentage={59.3} extra="35,000" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="일일 한국 네트워크 공격" count="78,250" percentage={70.5} extra="8,900" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="일일 외부 네트워크 정보" count="18,800" percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="일일 내부 네트워크 정보" count="35,078" percentage={27.4} isLoss color="warning" extra="20,395" />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 6, height: 900 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              글로벌 공격 현황
            </Typography>
            <Box sx={{ flex: 1, height: 400 }}>
              <EarthGlobe />
            </Box>
          </CardContent>
        </Card>
      </Grid>
          
      {/* row 3 - Network Topology and Globe */}
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 6, height: 900 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              네트워크 토폴로지
            </Typography>
            <Box sx={{ flex: 1, height: 600 }}>
              <InternalNetwork />
            </Box>
          </CardContent>
        </Card>
      </Grid>
        
      {/* row 4 - Visitor Stats */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <UniqueVisitorCard />
      </Grid>
      
      {/* row 5 - Network Attacks Table and Analytics */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">네트워크 공격 현황</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">보안 분석 리포트</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="시스템 보안 강화율" />
              <Typography variant="h5" color="success.main">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="취약점 발견율" />
              <Typography variant="h5" color="warning.main">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="전체 보안 위험도" />
              <Typography variant="h5" color="success.main">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>
    </Grid>
  );
}