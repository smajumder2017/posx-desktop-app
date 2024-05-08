import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IResponseError } from '../../models/common';
import { RequestStatus } from '../../utils/enums';

import * as api from './../../apis';
import { ILicenseResponse } from '@/models/license';

type SliceState<T> = {
  data: T | null;
  error: IResponseError | null;
  asyncStatus: RequestStatus;
};

const initialState: SliceState<Partial<ILicenseResponse>> = {
  data: {},
  error: null,
  asyncStatus: RequestStatus.Init,
};

// export const login = createAsyncThunk(
//   "auth/login",
//   async (payload: ILoginRequest, thunkApi) => {
//     try {
//       const response = await api.login(payload);
//       return response;
//     } catch (error) {
//       return thunkApi.rejectWithValue(error);
//     }
//   }
// );

// export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
//   try {
//     const response = await api.logout();
//     return response;
//   } catch (error) {
//     return thunkApi.rejectWithValue(error);
//   }
// });

export const getValidLicense = createAsyncThunk(
  'license/getValidLicense',
  async (_, thunkApi) => {
    try {
      const response = await api.getActiveLicenses();
      return response.data.find((license) => license.valid)?.license || {};
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder
    //   .addCase(login.pending, (state, action) => {
    //     state.asyncStatus = RequestStatus.Loading;
    //   })
    //   .addCase(login.fulfilled, (state, action) => {
    //     state.asyncStatus = RequestStatus.Success;
    //     state.data = { ...state.data, ...action.payload };
    //   })
    //   .addCase(login.rejected, (state, action) => {
    //     state.asyncStatus = RequestStatus.Failed;
    //     state.error = action.error;
    //   });

    builder
      .addCase(getValidLicense.pending, (state) => {
        state.asyncStatus = RequestStatus.Loading;
      })
      .addCase(getValidLicense.fulfilled, (state, action) => {
        state.asyncStatus = RequestStatus.Success;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(getValidLicense.rejected, (state, action) => {
        state.asyncStatus = RequestStatus.Failed;
        state.error = action.error;
      });
  },
});

export default licenseSlice;
