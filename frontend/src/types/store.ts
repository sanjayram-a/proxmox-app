// In /d:/proxmox-app/frontend/src/types/store.ts (or wherever store.ts is)

import { configureStore } from '@reduxjs/toolkit';
// FIX: Adjust paths relative to src/types/
import authReducer from '../store/slices/authSlice';
import vmReducer from '../store/slices/vmSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    vm: vmReducer,
  },
  // Type inference should now work correctly for getDefaultMiddleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'vm/performVMAction/fulfilled',
          'vm/performVMAction/rejected',
        ],
      },
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
