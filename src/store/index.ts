import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import { dashboardApiSlice } from './slices/dashboardApiSlice';
import { patientApiSlice } from './slices/patientApiSlice';
import { notificationsApiSlice } from './slices/notificationsApiSlice';
import { consultationApiSlice } from './slices/consultationApiSlice';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [dashboardApiSlice.reducerPath]: dashboardApiSlice.reducer,
  [patientApiSlice.reducerPath]: patientApiSlice.reducer,
  [notificationsApiSlice.reducerPath]: notificationsApiSlice.reducer,
  [consultationApiSlice.reducerPath]: consultationApiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      apiSlice.middleware,
      dashboardApiSlice.middleware,
      patientApiSlice.middleware,
      notificationsApiSlice.middleware,
      consultationApiSlice.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;