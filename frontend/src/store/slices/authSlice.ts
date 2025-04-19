import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  // ActionReducerMapBuilder // Often optional, let RTK infer
} from '@reduxjs/toolkit';
import api from '../../services/api';
// Make sure ApiError is imported correctly
import { ApiError, User, AuthState } from '../../types';
// Removed AsyncThunkConfig if it was imported

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Use inline config { rejectValue: ApiError } for the 3rd type argument
export const login = createAsyncThunk<
  string, // Return type
  { username: string; password: string }, // Argument type
  { rejectValue: ApiError } // Config with rejectValue type
>('auth/login', async (credentials, { rejectWithValue }) => {
  // Args types inferred
  try {
    const { access_token } = await api.login(credentials);
    localStorage.setItem('token', access_token);
    return access_token;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message } as ApiError);
    }
    return rejectWithValue({ message: 'Login failed' } as ApiError);
  }
});

// Use inline config { rejectValue: ApiError } for the 3rd type argument
export const fetchUser = createAsyncThunk<
  User, // Return type
  void, // Argument type
  { rejectValue: ApiError } // Config with rejectValue type
>('auth/fetchUser', async (_, { rejectWithValue }) => {
  // Args types inferred
  try {
    return await api.getCurrentUser();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message } as ApiError);
    }
    return rejectWithValue({ message: 'Failed to fetch user' } as ApiError);
  }
});

// Use inline config { rejectValue: ApiError } for the 3rd type argument
export const logout = createAsyncThunk<
  void, // Return type
  void, // Argument type
  { rejectValue: ApiError } // Config with rejectValue type
>('auth/logout', async (_, { rejectWithValue }) => {
  // Args types inferred
  try {
    // Note: Logout action might not typically fail in a way that needs rejectWithValue
    localStorage.removeItem('token');
    // No return needed for void return type
  } catch (error) {
    // This catch block might be unnecessary unless localStorage operations can throw significantly
    console.error('Logout error (unexpected):', error);
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message } as ApiError);
    }
    return rejectWithValue({ message: 'Failed to logout' } as ApiError);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      // Let RTK infer state type
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Let RTK infer builder type
    builder
      .addCase(login.pending, (state) => {
        // Let RTK infer state type
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // Let RTK infer state/action types
        state.isLoading = false;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        // action.payload type is ApiError | undefined
        state.isLoading = false;
        state.error = action.payload ?? { message: 'Unknown login error' };
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        // User likely null if fetch failed after login
        state.user = null;
        // Might want to clear token too if user fetch fails
        // localStorage.removeItem('token');
        // state.token = null;
        state.error = action.payload ?? {
          message: 'Unknown error fetching user',
        };
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.isLoading = false; // Ensure loading is reset
      })
      // Handle potential logout rejection, although less common
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false; // Still reset loading
        state.error = action.payload ?? { message: 'Unknown logout error' };
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
