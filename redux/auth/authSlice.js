import { createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { authSignUpUser, authSignInUser, authSingOutUser } from './operations';

const initialState = {
  userId: null,
  nickname: null,
  stateChange: false,
  email: null,
  avatar: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStateChanged: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickname: payload.nickname,
      email: payload.email,
      stateChange: true,
      avatar: payload.avatar,
    }),
  },
  extraReducers: builder =>
    builder
      .addCase(authSignUpUser.fulfilled, (state, action) => {
        state.userId = action.payload.uid;
        state.nickname = action.payload.displayName;
        state.email = action.payload.email;
        state.avatar = action.payload.photoURL;
      })
      .addCase(authSignUpUser.rejected, () => {
        Toast.show({ type: 'error', text1: 'Wrong email' });
      })
      .addCase(authSignInUser.fulfilled, () => {
        Toast.show({ type: 'success', text1: `Welcome` });
      })
      .addCase(authSignInUser.rejected, () => {
        Toast.show({ type: 'error', text1: 'Wrong email or password' });
      })
      .addCase(authSingOutUser.fulfilled, state => {
        state.userId = null;
        state.nickname = null;
        state.stateChange = false;
        state.email = null;
        state.avatar = null;
      }),
});

export const authReducer = authSlice.reducer;
export const onStateChange = authSlice.actions.authStateChanged;