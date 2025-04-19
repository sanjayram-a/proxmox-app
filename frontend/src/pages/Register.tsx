import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { FormConfig } from '../hooks/useForm';
import api from '../services/api';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm<RegisterFormData>({
      username: {
        initialValue: '',
        validation: [{ required: true, message: 'Username is required' }],
      },
      email: {
        initialValue: '',
        validation: [
          { required: true, message: 'Email is required' },
          {
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        ],
      },
      password: {
        initialValue: '',
        validation: [
          { required: true, message: 'Password is required' },
          {
            custom: (value: string) => value.length >= 8,
            message: 'Password must be at least 8 characters',
          },
        ],
      },
      confirmPassword: {
        initialValue: '',
        validation: [
          { required: true, message: 'Please confirm your password' },
          {
            custom: (value: string, values: RegisterFormData) =>
              value === values.password,
            message: 'Passwords do not match',
          },
        ],
      },
    });

  const onSubmit = useCallback(async () => {
    try {
      await api.register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Registration failed:', error.message);
      }
    }
  }, [values, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
