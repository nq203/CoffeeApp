import { User } from "@/app/Types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
    user: User | null;
}
const initialState :userState = {
    user : null,
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        },
      },
});
export const {setUser} = userSlice.actions;
export default userSlice.reducer;