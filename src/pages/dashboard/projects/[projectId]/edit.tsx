import { useEffect, useCallback, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMounted } from '../../../../hooks/use-mounted';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { ProjectEditForm } from '../../../../components/dashboard/project/project-edit-form';
import { projectsApi } from '../../../../api/projects-api';
import type { Project } from '../../../../types/project';
import { useSelector } from '../../../../store';

const ProjectEdit: NextPage = () => {
  const router = useRouter();
  const {projectId} = router.query;
  const isMounted = useMounted();
  const [project, setProject] = useState<Project | null>(null);
  const { activeCompany } = useSelector((state) => state.company);


  useEffect(() => {
    // gtm.push({ event: 'page_view' });
  }, []);

  const getProject = useCallback(async () => {
    try {
      const data = await projectsApi.getProject(Number(projectId), activeCompany?.id!);

      if (isMounted()) {
        setProject(data);
      }

    } catch (err) {
      console.error(err);
      setProject(null);
    }
  }, [isMounted, projectId, activeCompany]);

  useEffect(
    () => {
      if(activeCompany && activeCompany.id) { 
        getProject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeCompany]
  );

  if(!activeCompany) {
    return null;
  }

  if (!project) {
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
              Project doesn't exist
            </Typography>
          </Box>
         </Container>
        </Box>);
  }


  return (
    <>
      <Head>
        <title>
          Dashboard: Project Edit | Material Kit Pro
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
              Update project id {projectId}
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
              <NextLink
                href="/dashboard/projects"
                passHref
              >
                <Link variant="subtitle2">
                  Projects
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Edit project
              </Typography>
            </Breadcrumbs>
          </Box>
          <ProjectEditForm 
              id={Number(projectId)} 
              project={project}
              company_id={activeCompany && activeCompany.id!}
            />
        </Container>
      </Box>
    </>
  );
};

ProjectEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProjectEdit;
