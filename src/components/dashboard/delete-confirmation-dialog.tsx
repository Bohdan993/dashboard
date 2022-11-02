import type { FC, MouseEvent } from 'react';
import { useState } from 'react';
import { Avatar, Box, Button, Container, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/WarningOutlined';
import PropTypes from 'prop-types';

interface DeleteConfirmationDialogProps {
  id: number;
  subject: string;
  onConfirmHandler: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancelHandler: (event: MouseEvent<HTMLButtonElement>) => void;
  show: boolean;
  setShow: (b: boolean) => void;
}

export const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = (props) => {

   if(!props.show) {
    return null;
   }

    return(
        <Box
        sx={{
          backgroundColor: 'rgba(249, 250, 252, 0.6)',
          minHeight: '100%',
          p: 3,
          position: 'fixed',
          width: 'calc(100% - 280px)',
          height: '100%',
          top: '50%',
          left: '100%',
          zIndex: '999',
          transform: 'translate(-100%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={12}>
            <Box
              sx={{
                display: 'flex',
                pb: 2,
                pt: 3,
                px: 3
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                  color: 'error.main',
                  mr: 2
                }}
              >
                <WarningIcon fontSize="small" />
              </Avatar>
              <div>
                <Typography variant="h5">
                  Delete {props.subject}
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  Are you sure you want to delete {props.subject} with id {props.id}
                </Typography>
              </div>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                px: 3,
                py: 1.5
              }}
            >
              <Button onClick={(event) => {props.onCancelHandler(event); props.setShow(false); }}
                sx={{ mr: 2 }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button onClick={(event) => {props.onConfirmHandler(event); props.setShow(false); }}
                sx={{
                  backgroundColor: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.dark'
                  }
                }}
                variant="contained"
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    )
};

DeleteConfirmationDialog.propTypes = {
    id: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    onCancelHandler: PropTypes.func.isRequired,
    onConfirmHandler: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired
};
