import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import { Trash as TrashIcon } from '../../../icons/trash';
import type { Company } from '../../../types/company';
import { Scrollbar } from '../../scrollbar';
import { companiesApi } from '../../../api/companies-api';
import {DeleteConfirmationDialog} from '../../../components/dashboard/delete-confirmation-dialog'
import { setDefaultResultOrder } from 'dns';

interface CompanyListTableProps {
  companies: Company[];
  companiesCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

export const CompanyListTable: FC<CompanyListTableProps> = (props) => {
  const {
    companies,
    companiesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [localCompanies, setLocalCompanies] = useState<Company[]>(companies);
  const [companyId, setCompanyId] = useState<number>(0);
  // Reset selected companies when companies change
  useEffect(
    () => {
      if (selectedCompanies.length) {
        setSelectedCompanies([]);
      }

      setLocalCompanies(companies);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companies]
  );

  const handleSelectAllCompanies = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCompanies(
      event.target.checked
        ? companies.map((company) => company.id as unknown as string)
        : []
    );
  };

  const handleSelectOneCompany = (
    event: ChangeEvent<HTMLInputElement>,
    companyId: string
  ): void => {
    if (!selectedCompanies.includes(companyId)) {
        setSelectedCompanies((prevSelected) => [...prevSelected, companyId]);
    } else {
        setSelectedCompanies((prevSelected) => prevSelected.filter((id) => id !== companyId));
    }
  };

  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
    companyId: number): void => {
      setCompanyId(companyId);
      setShow(true);
  }

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, companyId: number): Promise<void>  => {
    try {
      await companiesApi.deleteCompany(companyId);
      const newLocalCompanies = localCompanies.filter(company => company.id !== companyId);
      setLocalCompanies(newLocalCompanies);
      toast.success('Company deleted!');
    } catch(err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>): void  => {
  }

  const enableBulkActions = selectedCompanies.length > 0;
  const selectedSomeCompanies = selectedCompanies.length > 0
    && selectedCompanies.length < companies.length;
  const selectedAllCompanies = selectedCompanies.length === companies.length;

  return (
    <div {...other}>
      {/* <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          display: enableBulkActions ? 'block' : 'none',
          px: 2,
          py: 0.5
        }}
      >
        <Checkbox
          checked={selectedAllCompanies}
          indeterminate={selectedSomeCompanies}
          onChange={handleSelectAllCompanies}
        />
        <Button
          size="small"
          sx={{ ml: 2 }}
        >
          Delete
        </Button>
        <Button
          size="small"
          sx={{ ml: 2 }}
        >
          Edit
        </Button>
      </Box> */}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ visibility: enableBulkActions ? 'collapse' : 'visible' }}>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllCompanies}
                  indeterminate={selectedSomeCompanies}
                  onChange={handleSelectAllCompanies}
                />
              </TableCell> */}
              <TableCell>
                Company Name
              </TableCell>
              <TableCell>
                Address 1
              </TableCell>
              <TableCell>
                Address 2
              </TableCell>
              <TableCell>
                City
              </TableCell>
              <TableCell>
                State
              </TableCell>
              <TableCell>
                Country
              </TableCell>
              <TableCell>
                Zip
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localCompanies.map((company) => {
              const isCompanySelected = selectedCompanies.includes(company.id as unknown as string);

              return (
                <TableRow
                  hover
                  key={company.id}
                  selected={isCompanySelected}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={isCompanySelected}
                      onChange={(event) => handleSelectOneCompany(
                        event,
                        company.id as unknown as string
                      )}
                      value={isCompanySelected}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                        <NextLink
                          href={`/dashboard/companies/${company.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {company.company_name}
                          </Link>
                        </NextLink>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {`${company.address_1}`}
                  </TableCell>
                  <TableCell>
                    {`${company.address_2}`}
                  </TableCell>
                  <TableCell>
                     {`${company.city}`}
                  </TableCell>
                  <TableCell>
                     {`${company.state}`}
                  </TableCell>
                  <TableCell>
                     {`${company.country}`}
                  </TableCell>
                  <TableCell>
                     {`${company.zip}`}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/companies/${company.id}/edit`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <IconButton component="button" onClick={(event) => handleDelete(
                        event,
                        company.id as number
                      )}>
                      <TrashIcon fontSize="small" />
                    </IconButton>
                    {/* <NextLink
                      href={`/dashboard/companies/${company.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={companiesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DeleteConfirmationDialog
        id={companyId}
        subject={'company'}
        onConfirmHandler={(event) => handleConfirm(event, companyId)}
        onCancelHandler={handleCancel}
        show={show}
        setShow={setShow}
      />
    </div>
  );
};

CompanyListTable.propTypes = {
  companies: PropTypes.array.isRequired,
  companiesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
