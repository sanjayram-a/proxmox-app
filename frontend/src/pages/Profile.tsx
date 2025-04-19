import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { RootState } from '../types/store';
import { useForm, FormConfig } from '../hooks/useForm';
import api from '../services/api';

interface ProfileFormData {
  email: string;
  fullName: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const formConfig: FormConfig<ProfileFormData> = {
    email: {
      initialValue: user?.email || '',
      validation: [
        { required: true, message: 'Email is required' },
        {
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      ],
    },
    fullName: {
      initialValue: user?.fullName || '',
    },
    currentPassword: {
      initialValue: '',
      validation: [
        {
          required: true,
          message: 'Current password is required to make changes',
        },
      ],
    },
    newPassword: {
      initialValue: '',
      validation: [
        {
          custom: (value: string) => !value || value.length >= 6,
          message: 'New password must be at least 6 characters',
        },
      ],
    },
    confirmPassword: {
      initialValue: '',
      validation: [
        {
          custom: (value: string, values) =>
            !values.newPassword || value === values.newPassword,
          message: 'Passwords do not match',
        },
      ],
    },
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm(formConfig);

  const handleUpdateProfile = async () => {
    try {
      await api.put('/auth/profile', {
        email: values.email,
        fullName: values.fullName,
        ...(values.newPassword
          ? {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            }
          : {}),
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error; // Let the form handler deal with the error
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Paper sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  mb: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Change Password
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.currentPassword && !!errors.currentPassword}
                helperText={touched.currentPassword && errors.currentPassword}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && !!errors.newPassword}
                helperText={touched.newPassword && errors.newPassword}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(handleUpdateProfile)}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
