import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authSlice from './features/authSlice';
import licenseSlice from './features/licenseSlice';
import shopSlice from './features/shopSlice';
import { createLogger } from 'redux-logger';
// import orderSlice from "./features/order/orderSlice";
// import printerSlice from "./features/printer/printerSlice";
// import restaurantSlice from "./features/restaurant/restaurantSlice";
// import tableSlice from "./features/table/tableSlice";
// import ticketSlice from "./features/ticket/ticketSlice";

const logger = createLogger();

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  license: licenseSlice.reducer,
  shop: shopSlice.reducer,
  // restaurants: restaurantSlice.reducer,
  // tables: tableSlice.reducer,
  // tickets: ticketSlice.reducer,
  // orders: orderSlice.reducer,
  // printers: printerSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // .prepend(
      //   // correctly typed middlewares can just be used
      //   additionalMiddleware,
      // )
      // prepend and concat calls can be chained
      .concat(logger),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
