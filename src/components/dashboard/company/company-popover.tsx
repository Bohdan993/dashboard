import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { MenuItem, Popover } from '@mui/material';
import { useMounted } from '../../../hooks/use-mounted';
import { useDispatch, useSelector } from '../../../store';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
import { getCompanies as getCompaniesFunc, getActiveCompany } from '../../../thunks/company';
import type { Company } from '../../../types/company';

interface CompanyPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}


export const CompanyPopover: FC<CompanyPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const isMounted = useMounted();
  const router = useRouter();
  const { logout } = useAuth();

  const handleChange = (company: Company): void => {
    dispatch(getActiveCompany(company));
    onClose?.();
  };

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
        if(!companies.length) {
            getCompanies();
        }
    },
    [companies]
  );

  useEffect(() => {
    if(companies && companies.length > 0) {
        dispatch(getActiveCompany(companies[0]));
    }
  }, [companies])

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 248 } }}
      transitionDuration={0}
      {...other}
    >
      {companies.map((company: Company) => (
        <MenuItem
          key={company.id}
          onClick={() => handleChange(company)}
        >
          {company.company_name}
        </MenuItem>
      ))}
    </Popover>
  );
};
