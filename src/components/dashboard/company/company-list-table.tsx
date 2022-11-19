import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Box,
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
import { DeleteConfirmationDialog } from '../../../components/dashboard/delete-confirmation-dialog'
import { useDispatch } from '../../../store';
import { deleteCompany } from '../../../thunks/company';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';

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
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<number>(0);

  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
    companyId: number): void => {
      setCompanyId(companyId);
      setShow(true);
  }

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, companyId: number): Promise<void>  => {
    try {
      await dispatch(deleteCompany({
        "companyId": companyId
      }));
      // const newLocalCompanies = localCompanies.filter(company => company.id !== companyId);
      // setLocalCompanies(newLocalCompanies);
      toast.success('Company deleted!');
    } catch(err) {
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
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>): void  => {
  }

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ visibility: 'visible' }}>
            <TableRow>
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
            {companies.map((company) => {

              return (
                <TableRow
                  hover
                  key={company.id}
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
