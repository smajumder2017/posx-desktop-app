import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ILoginRequest,
  // ICreateUserRequest,
  // ILoginRequest,
  // ILoginResponse,
  IUserInfoResponse,
} from '../../models/auth';
import { IResponseError } from '../../models/common';
import { RequestStatus } from '../../utils/enums';

import * as api from './../../apis';
import { getApiError } from '@/utils/processApiError';

type SliceState<T> = {
  data: T | null;
  error: IResponseError | unknown;
  asyncStatus: RequestStatus;
};

const initialState: SliceState<IUserInfoResponse> = {
  data: null,
  error: null,
  asyncStatus: RequestStatus.Init,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: ILoginRequest, thunkApi) => {
    try {
      const response = await api.login(payload);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

// export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
//   try {
//     const response = await api.logout();
//     return response;
//   } catch (error) {
//     return thunkApi.rejectWithValue(error);
//   }
// });

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, thunkApi) => {
    try {
      const response = await api.userInfo();
      return response.data;
    } catch (error) {
      const err = getApiError(error);
      return thunkApi.rejectWithValue(err);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
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
      .addCase(getUserInfo.pending, (state) => {
        state.asyncStatus = RequestStatus.Loading;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.asyncStatus = RequestStatus.Success;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.asyncStatus = RequestStatus.Failed;
        console.log(action.payload);
        state.error = action.payload;
      });
  },
});

export default authSlice;
