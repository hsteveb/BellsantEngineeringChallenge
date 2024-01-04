import { configureStore } from '@reduxjs/toolkit';
import { machineApi } from './api/machineApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [machineApi.reducerPath]: machineApi.reducer,
  },

  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(machineApi.middleware)
})

setupListeners(store.dispatch);

