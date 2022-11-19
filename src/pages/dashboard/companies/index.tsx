import type { ChangeEvent, MouseEvent } from 'react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import NextLink from 'next/link';
import Head from 'next/head';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
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
import { CompanyListTable } from '../../../components/dashboard/company/company-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import type { Company } from '../../../types/company';
import { useDispatch, useSelector } from '../../../store';
import { getCompanies as getCompaniesFunc } from '../../../thunks/company';

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

const CompaniesList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const { companies } = useSelector((state) => state.company);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const router = useRouter();
  const { logout } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    query: ''
  });
  const dispatch = useDispatch();

  const getCompanies = useCallback(async () => {
    try {
      if (isMounted()) {
        await dispatch(getCompaniesFunc());
      }
    } catch (err) {
      if(err.name === 'UnauthorizedError') {
        console.error(err);
        toast.error('Unauthorized!');
        try {
          router.push('/').then(async () => {
            await logout();
            dispatch(reduxLogout());
          }).catch(console.error);
        } catch (err) {
          console.error(err);
          toast.error('Unable to logout.');
        }
      } else {
        console.error(err);
        toast.error('Something went wrong!');
      }
    }
  }, [isMounted]);

  useEffect(
    () => {
      let t: ReturnType<typeof setTimeout> = setTimeout(() => {
        if(companies.length === 0) {
          getCompanies();
        }
      }, 250)
      return () => {clearTimeout(t); }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companies]
  );

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

CompaniesList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default CompaniesList;
