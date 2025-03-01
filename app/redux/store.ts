import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationSlice";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    location: locationReducer,
    user: userReducer,
  },
});

// TypeScript: Định nghĩa RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
