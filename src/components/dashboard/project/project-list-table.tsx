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
import type { Project } from '../../../types/project';
import { Scrollbar } from '../../scrollbar';
import { DeleteConfirmationDialog } from '../../../components/dashboard/delete-confirmation-dialog'
import { useDispatch } from '../../../store';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
import { deleteProject } from '../../../thunks/project';

interface ProjectListTableProps {
  projects: Project[];
  projectsCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  company_id: number;
}

export const ProjectListTable: FC<ProjectListTableProps> = (props) => {
  const {
    projects,
    projectsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    company_id,
    ...other
  } = props;
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<number>(0);
  const { logout } = useAuth();
  const router = useRouter();


  useEffect(() => {
    setShow(false);
  } , [company_id]);


  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>,
    projectId: number): void => {
      setProjectId(projectId);
      setShow(true);
  }

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, projectId: number): Promise<void>  => {
    try {
      await dispatch(deleteProject({
        "projectId": projectId,
        "company_id": company_id!
      }));
      toast.success('Project deleted!');
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
                Project Name
              </TableCell>
              <TableCell>
                Start Date
              </TableCell>
              <TableCell>
                End Date
              </TableCell>
              <TableCell>
                Responsible person
              </TableCell>
              <TableCell>
                Summary
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {

              return (
                <TableRow
                  hover
                  key={project.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                        <NextLink
                          href={`/dashboard/projects/${project.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {project.name}
                          </Link>
                        </NextLink>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {`${project.start_date}`}
                  </TableCell>
                  <TableCell>
                    {`${project.end_date}`}
                  </TableCell>
                  <TableCell>
                     {`${project.resp_person}`}
                  </TableCell>
                  <TableCell>
                     {`${project.summary}`}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/projects/${project.id}/edit`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <IconButton component="button" onClick={(event) => handleDelete(
                        event,
                        project.id as number
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
        count={projectsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DeleteConfirmationDialog
        id={projectId}
        subject={'project'}
        onConfirmHandler={(event) => handleConfirm(event, projectId)}
        onCancelHandler={handleCancel}
        show={show}
        setShow={setShow}
      />
    </div>
  );
};

ProjectListTable.propTypes = {
  projects: PropTypes.array.isRequired,
  projectsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  company_id: PropTypes.number.isRequired
};
