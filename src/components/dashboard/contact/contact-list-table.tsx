import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useEffect, useState } from 'react';
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
import type { Contact } from '../../../types/contact';
import { Scrollbar } from '../../scrollbar';
import { DeleteConfirmationDialog } from '../../../components/dashboard/delete-confirmation-dialog'
import { useDispatch } from '../../../store';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
import { deleteContact } from '../../../thunks/contact';

interface ContactListTableProps {
  contacts: Contact[];
  contactsCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  company_id: number;
}

export const ContactListTable: FC<ContactListTableProps> = (props) => {
  const {
    contacts,
    contactsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    company_id,
    ...other
  } = props;
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [contactId, setContactId] = useState<number>(0);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setShow(false);
  } , [company_id]);


  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
    contactId: number): void => {
      setContactId(contactId);
      setShow(true);
  }

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, contactId: number): Promise<void>  => {
    try {
      await dispatch(deleteContact({
        "contactId": contactId,
        "company_id": company_id!
      }));
      toast.success('Contact deleted!');
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
                Type
              </TableCell>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Email
              </TableCell>
              <TableCell>
                Phone
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
            {contacts.map((contact) => {

              return (
                <TableRow
                  hover
                  key={contact.id}
                >
                  <TableCell>
                    {`${(contact.type.charAt(0).toUpperCase() +  contact.type.substr(1))}`}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                        <NextLink
                          href={`/dashboard/contacts/${contact.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {contact.name}
                          </Link>
                        </NextLink>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {`${contact.email}`}
                  </TableCell>
                  <TableCell>
                    {`${contact.phone_num}`}
                  </TableCell>
                  <TableCell>
                     {`${contact.address_1}`}
                  </TableCell>
                  <TableCell>
                     {`${contact.address_2}`}
                  </TableCell>
                  <TableCell>
                     {`${contact.city}`}
                  </TableCell>
                  <TableCell>
                     {`${contact.state}`}
                  </TableCell>
                  <TableCell>
                     {`${contact.country}`}
                  </TableCell>
                  <TableCell>
                     {`${contact.zip}`}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/contacts/${contact.id}/edit`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <IconButton component="button" onClick={(event) => handleDelete(
                        event,
                        contact.id as number
                      )}>
                      <TrashIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={contactsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DeleteConfirmationDialog
        id={contactId}
        subject={'contact'}
        onConfirmHandler={(event) => handleConfirm(event, contactId)}
        onCancelHandler={handleCancel}
        show={show}
        setShow={setShow}
      />
    </div>
  );
};

ContactListTable.propTypes = {
  contacts: PropTypes.array.isRequired,
  contactsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  company_id: PropTypes.number.isRequired
};
