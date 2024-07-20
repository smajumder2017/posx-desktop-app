import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IResponseError } from '../../models/common';
import { RequestStatus } from '../../utils/enums';

import * as api from './../../apis';
import { IShopConfigResponse } from '@/models/shop';

type SliceState<T> = {
  data: T | null;
  error: IResponseError | null;
  asyncStatus: RequestStatus;
};

const initialState: SliceState<IShopConfigResponse> = {
  data: null,
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

export const getShopConfig = createAsyncThunk(
  'shop/getShopConfig',
  async (shopId: string, thunkApi) => {
    try {
      const response = await api.fetchShopConfig(shopId);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const shopConfigSlice = createSlice({
  name: 'config',
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
      .addCase(getShopConfig.pending, (state) => {
        state.asyncStatus = RequestStatus.Loading;
      })
      .addCase(getShopConfig.fulfilled, (state, action) => {
        state.asyncStatus = RequestStatus.Success;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(getShopConfig.rejected, (state, action) => {
        state.asyncStatus = RequestStatus.Failed;
        state.error = action.error;
      });
  },
});

export default shopConfigSlice;