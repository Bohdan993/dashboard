import type { FC } from 'react';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import type { AppBarProps } from '@mui/material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '../../icons/menu';
import { Bell as BellIcon } from '../../icons/bell';
import { Search as SearchIcon } from '../../icons/search';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { Users as UsersIcon } from '../../icons/users';
import { AccountPopover } from './account-popover';
import { ContactsPopover } from './contacts-popover';
import { ContentSearchDialog } from './content-search-dialog';
import { NotificationsPopover } from './notifications-popover';
import { LanguagePopover } from './language-popover';
import { useAuth } from '../../hooks/use-auth';

interface DashboardNavbarProps extends AppBarProps {
  onOpenSidebar?: () => void;
}

type Language = 'en' | 'de' | 'es';

const languages: Record<Language, string> = {
  en: '/static/icons/uk_flag.svg',
  de: '/static/icons/de_flag.svg',
  es: '/static/icons/es_flag.svg'
};

const DashboardNavbarRoot = styled(AppBar)(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...(
      theme.palette.mode === 'light'
        ? {
          boxShadow: theme.shadows[3]
        }
        : {
          backgroundColor: theme.palette.background.paper,
          borderBottomColor: theme.palette.divider,
          borderBottomStyle: 'solid',
          borderBottomWidth: 1,
          boxShadow: 'none'
        }
    )
  })
);

const LanguageButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const { i18n } = useTranslation();
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{ ml: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            height: 20,
            width: 20,
            '& img': {
              width: '100%'
            }
          }}
        >
          <img
            alt=""
            src={languages[i18n.language as Language]}
          />
        </Box>
      </IconButton>
      <LanguagePopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};


const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  // To get the user from the authContext, you can use
  const { user } = useAuth();

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: 2
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40
          }}
          src={user?.avatar}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onOpenSidebar, ...other } = props;

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <LanguageButton />
          {/* <ContentSearchButton /> */}
          {/* <ContactsButton />
          <NotificationsButton /> */}
          <AccountButton />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
