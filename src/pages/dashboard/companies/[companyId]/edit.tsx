import { useEffect, useCallback, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMounted } from '../../../../hooks/use-mounted';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { CompanyEditForm } from '../../../../components/dashboard/company/company-edit-form';
import { gtm } from '../../../../lib/gtm';
import { companiesApi } from '../../../../api/companies-api';
import type { Company } from '../../../../types/company';

const CompanyEdit: NextPage = () => {
  const router = useRouter();
  const {companyId} = router.query;
  const isMounted = useMounted();
  const [company, setCompany] = useState<Company | null>(null);
  useEffect(() => {
    // gtm.push({ event: 'page_view' });
  }, []);

  const getCompany = useCallback(async () => {
    try {
      const data = await companiesApi.getCompany(Number(companyId));

      if (isMounted()) {
        setCompany(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, companyId]);

  useEffect(
    () => {
      getCompany();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!company) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Company Edit | Material Kit Pro
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
              Update company id {companyId}
            </Typography>
            <Breadcrumbs
              separator="/"
              sx={{ mt: 1 }}
            >
              <NextLink
                href="/dashboard"
                passHref
              >
                <Link variant="subtitle2">
                  Dashboard
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Companies
              </Typography>
            </Breadcrumbs>
          </Box>
          <CompanyEditForm id={Number(companyId)} company={company}/>
        </Container>
      </Box>
    </>
  );
};

CompanyEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default CompanyEdit;
