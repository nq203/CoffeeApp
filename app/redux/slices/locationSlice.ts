import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Location from "expo-location";

// Định nghĩa type cho vị trí
interface LocationState {
  location: Location.LocationObject | null;
  loading: boolean;
}

const initialState: LocationState = {
  location: null,
  loading: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location.LocationObject>) => {
      state.location = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Xuất reducer và actions
export const { setLocation, setLoading } = locationSlice.actions;
export default locationSlice.reducer;
