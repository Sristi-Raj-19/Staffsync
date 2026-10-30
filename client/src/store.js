import { configureStore, createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: JSON.parse(localStorage.getItem('staffsync_user') || 'null') },
  reducers: {
    setUser(state, action) { state.user = action.payload; localStorage.setItem('staffsync_user', JSON.stringify(action.payload)); },
    clearUser(state) { state.user = null; localStorage.removeItem('staffsync_user'); localStorage.removeItem('staffsync_token'); }
  }
});
export const { setUser, clearUser } = authSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer } });
