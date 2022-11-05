import type { NextPage } from 'next';
import {
  Box,
  Container,
  Typography
} from '@mui/material';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';


const Home: NextPage = () => {
  return (<Box
    component="main"
    sx={{
      flexGrow: 1,
      py: 8
    }}
  >
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          Welcome!
        </Typography>
      </Box>
     </Container>
    </Box>);
};

Home.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Home;
