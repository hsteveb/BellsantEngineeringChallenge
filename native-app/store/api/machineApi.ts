import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';

export const machineApi = createApi({
  reducerPath: 'machineApi',
  tagTypes: ['MachineHealth'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: async (headers) => {
      const user = auth().currentUser;
      const token = await user.getIdToken();
      if (user) headers.set('authorization', `Bearer ${token}`)
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getMachineHealth: builder.query({
      query: () => 'machine-health',
      providesTags: ['MachineHealth'],
    }),
    postCalculateMachineHealth: builder.mutation({
      query: ({ body }) => ({
        url: 'machine-health',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, error) => error ? [] : ['MachineHealth']
    }),
    postResetMachineHealth: builder.mutation({
      query: () => ({
        url:'reset-machine-health',
        method: 'POST'
      }),
      invalidatesTags: (_, error) => error ? [] : ['MachineHealth']
    }),
    putMachineHealth: builder.mutation({
      query: ({ body }) => ({
        url: 'machine-health',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, error) => error ? [] : ['MachineHealth']
    })
  })
});

export const { useGetMachineHealthQuery, usePutMachineHealthMutation, usePostCalculateMachineHealthMutation, usePostResetMachineHealthMutation } = machineApi;
