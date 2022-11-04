import type { ChangeEvent, MouseEvent } from 'react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProjectListTable } from '../../../components/dashboard/project/project-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import type { Project } from '../../../types/project';
import { useDispatch, useSelector } from '../../../store';
import { getProjects as getProjectsFunc } from '../../../thunks/project';

interface Filters {
  query?: string;
  // hasAcceptedMarketing?: boolean;
  // isProspect?: boolean;
  // isReturning?: boolean;
}

type SortField = 'project_name' | 'country';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'project_name|desc'
  | 'project_name|asc'
  | 'country|desc'
  | 'country|asc';

interface SortOption {
  label: string;
  value: Sort;
}

// type TabValue = 'all' | 'hasAcceptedMarketing' | 'isProspect' | 'isReturning';

// interface Tab {
//   label: string;
//   value: TabValue;
// }

// const tabs: Tab[] = [
//   {
//     label: 'All',
//     value: 'all'
//   },
//   {
//     label: 'Accepts Marketing',
//     value: 'hasAcceptedMarketing'
//   },
//   {
//     label: 'Prospect',
//     value: 'isProspect'
//   },
//   {
//     label: 'Returning',
//     value: 'isReturning'
//   }
// ];

const sortOptions: SortOption[] = [
  {
    label: 'Project Name(A-Z)',
    value: 'project_name|asc'
  },
  {
    label: 'Project Name(Z-A)',
    value: 'project_name|desc'
  },
  {
    label: 'Country (A-Z)',
    value: 'country|asc'
  },
  {
    label: 'Country (Z-A)',
    value: 'country|desc'
  },
];

const applyFilters = (
  projects: Project[],
  filters: Filters
): Project[] => projects.filter((project) => {
  if (filters.query) {
    let queryMatched = false;
    const properties: ('country' | 'project_name')[] = ['country', 'project_name'];

    properties.forEach((property) => {
      if ((project[property]).toLowerCase().includes(filters.query!.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  // if (filters.hasAcceptedMarketing && !project.hasAcceptedMarketing) {
  //   return false;
  // }

  // if (filters.isProspect && !project.isProspect) {
  //   return false;
  // }

  // if (filters.isReturning && !project.isReturning) {
  //   return false;
  // }

  return true;
});

const descendingComparator = (a: Project, b: Project, sortBy: SortField): number => {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.

  if (b[sortBy]! < a[sortBy]!) {
    return -1;
  }

  if (b[sortBy]! > a[sortBy]!) {
    return 1;
  }
  return 0;
};

const getComparator = (sortDir: SortDir, sortBy: SortField) => (
  sortDir === 'desc'
    ? (a: Project, b: Project) => descendingComparator(a, b, sortBy)
    : (a: Project, b: Project) => -descendingComparator(a, b, sortBy)
);

const applySort = (projects: Project[], sort: Sort): Project[] => {
  const [sortBy, sortDir] = sort.split('|') as [SortField, SortDir];
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = projects.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (
  projects: Project[],
  page: number,
  rowsPerPage: number
): Project[] => projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ProjectsList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const { projects } = useSelector((state) => state.project);
  // const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<Filters>({
    query: ''
    // hasAcceptedMarketing: undefined,
    // isProspect: undefined,
    // isReturning: undefined
  });
  const dispatch = useDispatch();

  // useEffect(() => {
  //   gtm.push({ event: 'page_view' });
  // }, []);

  const getProjects = useCallback(async () => {
    try {
      if (isMounted()) {
        dispatch(getProjectsFunc());
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      let t: ReturnType<typeof setTimeout> = setTimeout(() => {
        if(projects.length === 0) {
          getProjects();
        }
      }, 250)
      return () => {clearTimeout(t); }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects]
  );

  // const handleTabsChange = (event: ChangeEvent<{}>, value: TabValue): void => {
  //   const updatedFilters: Filters = {
  //     ...filters,
  //     hasAcceptedMarketing: undefined,
  //     isProspect: undefined,
  //     isReturning: undefined
  //   };

  //   if (value !== 'all') {
  //     updatedFilters[value] = true;
  //   }

  //   setFilters(updatedFilters);
  //   setCurrentTab(value);
  // };

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredProjects = applyFilters(projects, filters);
  const sortedProjects = applySort(filteredProjects, sort);
  const paginatedProjects = applyPagination(sortedProjects, page, rowsPerPage);


  return (
    <>
      <Head>
        <title>
          Dashboard: Projects List | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Projects
                </Typography>
              </Grid>
              <Grid item>
              <NextLink
                  href="/dashboard/projects/new"
                  passHref
                >
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                m: -1.5,
                p: 3
              }}
            >
              <Box
                component="form"
                onSubmit={handleQueryChange}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search projects"
                />
              </Box>
              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <ProjectListTable
              projects={paginatedProjects}
              projectsCount={sortedProjects.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProjectsList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProjectsList;
