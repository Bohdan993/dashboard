import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/use-auth';
import { logout as reduxLogout } from '../../thunks/company';
import { useDispatch, useSelector } from '../../store';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import {
  deserializeFunction
} from '../../utils/serialize-func';

const baseUrl: string = 'https://my.platops.cloud/';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { logout, user } = useAuth();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.app);

  const handleLogout = () : void => {
    try {
      onClose?.();
      router.push('/').then(async () => {
        await logout();
        dispatch(reduxLogout());
        switch(auth.authMethod){
          case 'google' : {

            break;
          }
          case 'microsoft' : {
            deserializeFunction(auth?.authInstance?.logout);
            break;
          }
          case 'email' : {

            break;
          }
          default: break;
        }
      }).catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Avatar
          src={`${baseUrl}${user?.avatar}`}
          sx={{
            height: 40,
            width: 40
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          <Typography variant="body1">
            {user?.first_name} {user?.last_name}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <NextLink
          href="/dashboard/profile"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Logout
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
