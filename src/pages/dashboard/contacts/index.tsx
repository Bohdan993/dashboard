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
import { ContactListTable } from '../../../components/dashboard/contact/contact-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import type { Contact } from '../../../types/contact';
import { useDispatch, useSelector } from '../../../store';
import { getContacts as getContactsFunc } from '../../../thunks/contact';

interface Filters {
  query?: string;
}

type SortField = 'name' | 'email' | 'country';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'name|desc'
  | 'name|asc'
  | 'email|desc'
  | 'email|asc'
  | 'country|desc'
  | 'country|asc';

interface SortOption {
  label: string;
  value: Sort;
}


const sortOptions: SortOption[] = [
  {
    label: 'Contact Name(A-Z)',
    value: 'name|asc'
  },
  {
    label: 'Contact Name(Z-A)',
    value: 'name|desc'
  },
  {
    label: 'Email (A-Z)',
    value: 'email|asc'
  },
  {
    label: 'Email (Z-A)',
    value: 'email|desc'
  },
  {
    label: 'Country (A-Z)',
    value: 'country|asc'
  },
  {
    label: 'Country (Z-A)',
    value: 'country|desc'
  }
];

const applyFilters = (
  contacts: Contact[],
  filters: Filters
): Contact[] => contacts.filter((contact) => {
  if (filters.query) {
    let queryMatched = false;
    const properties: ('name' | 'email' | 'country' )[] = ['name', 'email', 'country'];

    properties.forEach((property) => {
      if ((contact[property]).toLowerCase().includes(filters.query!.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  return true;
});

const descendingComparator = (a: Contact, b: Contact, sortBy: SortField): number => {
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
    ? (a: Contact, b: Contact) => descendingComparator(a, b, sortBy)
    : (a: Contact, b: Contact) => -descendingComparator(a, b, sortBy)
);

const applySort = (contacts: Contact[], sort: Sort): Contact[] => {
  const [sortBy, sortDir] = sort.split('|') as [SortField, SortDir];
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = contacts.map((el, index) => [el, index]);

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
  contacts: Contact[],
  page: number,
  rowsPerPage: number
): Contact[] => contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ContactsList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const { contacts } = useSelector((state) => state.contact);
  const { activeCompany } = useSelector((state) => state.company);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const router = useRouter();
  const { logout } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    query: ''
  });
  const dispatch = useDispatch();

  const getContacts = useCallback(async () => {
    try {
      if (isMounted()) {
        await dispatch(getContactsFunc({company_id: activeCompany?.id!}));
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
  }, [isMounted, activeCompany]);

  useEffect(
    () => {
      if(activeCompany && activeCompany.id) {
        getContacts();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeCompany]
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
  const filteredContacts = applyFilters(contacts, filters);
  const sortedContacts = applySort(filteredContacts, sort);
  const paginatedContacts = applyPagination(sortedContacts, page, rowsPerPage);

  if(!activeCompany) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Contacts List | Material Kit Pro
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
                  Contacts
                </Typography>
              </Grid>
              <Grid item>
              <NextLink
                  href="/dashboard/contacts/new"
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
                  placeholder="Search contacts"
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
            <ContactListTable
              contacts={paginatedContacts}
              contactsCount={sortedContacts.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
              company_id={activeCompany && activeCompany.id!}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ContactsList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ContactsList;
