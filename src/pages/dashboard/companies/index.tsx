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
import { companiesApi } from '../../../api/companies-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { CompanyListTable } from '../../../components/dashboard/company/company-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import type { Company } from '../../../types/company';

interface Filters {
  query?: string;
  // hasAcceptedMarketing?: boolean;
  // isProspect?: boolean;
  // isReturning?: boolean;
}

type SortField = 'company_name' | 'country';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'company_name|desc'
  | 'company_name|asc'
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
    label: 'Company Name(A-Z)',
    value: 'company_name|asc'
  },
  {
    label: 'Company Name(Z-A)',
    value: 'company_name|desc'
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
  companies: Company[],
  filters: Filters
): Company[] => companies.filter((company) => {
  if (filters.query) {
    let queryMatched = false;
    const properties: ('country' | 'company_name')[] = ['country', 'company_name'];

    properties.forEach((property) => {
      if ((company[property]).toLowerCase().includes(filters.query!.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  // if (filters.hasAcceptedMarketing && !company.hasAcceptedMarketing) {
  //   return false;
  // }

  // if (filters.isProspect && !company.isProspect) {
  //   return false;
  // }

  // if (filters.isReturning && !company.isReturning) {
  //   return false;
  // }

  return true;
});

const descendingComparator = (a: Company, b: Company, sortBy: SortField): number => {
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
    ? (a: Company, b: Company) => descendingComparator(a, b, sortBy)
    : (a: Company, b: Company) => -descendingComparator(a, b, sortBy)
);

const applySort = (companies: Company[], sort: Sort): Company[] => {
  const [sortBy, sortDir] = sort.split('|') as [SortField, SortDir];
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = companies.map((el, index) => [el, index]);

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
  companies: Company[],
  page: number,
  rowsPerPage: number
): Company[] => companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const CustomerList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
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

  // useEffect(() => {
  //   gtm.push({ event: 'page_view' });
  // }, []);

  const getCompanies = useCallback(async () => {
    try {
      const data = await companiesApi.getCompanies();

      if (isMounted()) {
        setCompanies(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getCompanies();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
  const filteredCompanies = applyFilters(companies, filters);
  const sortedCompanies = applySort(filteredCompanies, sort);
  const paginatedCompanies = applyPagination(sortedCompanies, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Companies List | Material Kit Pro
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
                  Companies
                </Typography>
              </Grid>
              <Grid item>
              <NextLink
                  href="/dashboard/companies/new"
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
                  placeholder="Search companies"
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
            <CompanyListTable
              companies={paginatedCompanies}
              companiesCount={sortedCompanies.length}
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

CustomerList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default CustomerList;
