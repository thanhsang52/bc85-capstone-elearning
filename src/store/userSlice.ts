import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../services/elearningService';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (user && token) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    }
  }
});

export const { loginSuccess, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;