import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vmReducer from './slices/vmSlice';
import type { AuthState, VMState } from '../types';

const store = configureStore({
  reducer: {
    auth: authReducer,
    vm: vmReducer,
  },
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

export { store };
export default store;
