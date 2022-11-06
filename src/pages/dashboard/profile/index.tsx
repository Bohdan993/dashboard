import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProfileGeneralSettings } from '../../../components/dashboard/profile/profile-general-settings';
import { useAuth } from '../../../hooks/use-auth';

const tabs = [
  { label: 'General', value: 'general' }
];

const Account: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<string>('general');
  const auth = useAuth();


  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>
          Dashboard: Profile | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4">
            Profile
          </Typography>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="primary"
            value={currentTab}
            variant="scrollable"
            sx={{ mt: 3 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          {currentTab === 'general' && <ProfileGeneralSettings auth={auth} />}
          {/* {currentTab === 'billing' && <AccountBillingSettings />}
          {currentTab === 'team' && <AccountTeamSettings />}
          {currentTab === 'notifications' && <AccountNotificationsSettings />} */}
          {/* {currentTab === 'security' && <AccountSecuritySettings />} */}
        </Container>
      </Box>
    </>
  );
};

Account.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Account;
