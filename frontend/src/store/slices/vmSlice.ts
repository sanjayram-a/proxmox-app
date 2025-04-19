import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  // ActionReducerMapBuilder // Often optional, let RTK infer
} from '@reduxjs/toolkit';
import api from '../../services/api';
import {
  VM,
  VMState,
  ApiError,
  VMCreateData,
  VMActionData,
  // Removed AsyncThunkConfig and ThunkConfig imports if they existed
} from '../../types';

const initialState: VMState = {
  vms: [],
  selectedVM: null,
  isLoading: false,
  error: null,
};

// Use inline config { rejectValue: ApiError } for the 3rd type argument
export const fetchVMs = createAsyncThunk<
  VM[], // Return type
  void, // Argument type (no argument needed)
  { rejectValue: ApiError } // Config with rejectValue type
>('vm/fetchVMs', async (_, { rejectWithValue }) => {
  // Args types are now inferred
  try {
    return await api.getVMs();
  } catch (error) {
    // Ensure rejected value matches { rejectValue: ApiError }
    if (error instanceof Error) {
      // Cast to ApiError to match rejectValue type
      return rejectWithValue({ message: error.message } as ApiError);
    }
    return rejectWithValue({ message: 'Failed to fetch VMs' } as ApiError);
  }
});

// Use inline config { rejectValue: ApiError } for the 3rd type argument
export const createVM = createAsyncThunk<
  VM, // Return type
  VMCreateData, // Argument type
  { rejectValue: ApiError } // Config with rejectValue type
>('vm/createVM', async (vmData, { rejectWithValue }) => {
  // Args types are now inferred
  try {
    return await api.createVM(vmData);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message } as ApiError);
    }
    return rejectWithValue({ message: 'Failed to create VM' } as ApiError);
  }
});

// Use inline config { rejectValue: ApiError } for the 3rd type argument
export const performVMAction = createAsyncThunk<
  VM, // Return type
  { vmId: number; action: VMActionData['action'] }, // Argument type
  { rejectValue: ApiError } // Config with rejectValue type
>('vm/performAction', async ({ vmId, action }, { rejectWithValue }) => {
  // Args types are now inferred
  try {
    return await api.performVMAction(vmId, { action });
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message } as ApiError);
    }
    return rejectWithValue({ message: 'Failed to perform action' } as ApiError);
  }
});

const vmSlice = createSlice({
  name: 'vm',
  initialState,
  reducers: {
    selectVM: (state, action: PayloadAction<VM | null>) => {
      // Allow null
      state.selectedVM = action.payload;
    },
    clearVMError: (state) => {
      state.error = null;
    },
  },
  // Let RTK infer builder type
  extraReducers: (builder) => {
    builder
      // Fetch VMs
      .addCase(fetchVMs.pending, (state) => {
        // Let RTK infer state type
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVMs.fulfilled, (state, action) => {
        // Let RTK infer state/action types
        state.isLoading = false;
        state.vms = action.payload;
        state.error = null;
      })
      // action.payload type is now correctly inferred as ApiError | undefined
      .addCase(fetchVMs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? {
          message: 'Unknown error fetching VMs',
        };
      })
      // Create VM
      .addCase(createVM.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vms.push(action.payload);
        state.error = null;
      })
      .addCase(createVM.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? {
          message: 'Unknown error creating VM',
        };
      })
      // Perform VM Action
      .addCase(performVMAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performVMAction.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.vms.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.vms[index] = action.payload;
        }
        if (state.selectedVM?.id === action.payload.id) {
          state.selectedVM = action.payload;
        }
        state.error = null;
      })
      .addCase(performVMAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? {
          message: 'Unknown error performing VM action',
        };
      });
  },
});

export const { selectVM, clearVMError } = vmSlice.actions;
export default vmSlice.reducer;
