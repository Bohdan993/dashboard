import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MenuItem, Popover } from '@mui/material';
import { useMounted } from '../../../hooks/use-mounted';
import { useDispatch, useSelector } from '../../../store';
import { getCompanies as getCompaniesFunc, getActiveCompany } from '../../../thunks/company';
import type { Company } from '../../../types/company';

interface CompanyPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

// const companys = [
//   'Acme Inc',
//   'Division Inc'
// ];

export const CompanyPopover: FC<CompanyPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const isMounted = useMounted();

  const handleChange = (company: Company): void => {
    dispatch(getActiveCompany(company));
    onClose?.();
  };

  const getCompanies = useCallback(async () => {
    try {
      if (isMounted()) {
        dispatch(getCompaniesFunc());
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
        if(!companies.length) {
            getCompanies();
        }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
      {companies.map((company) => (
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
