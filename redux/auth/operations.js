import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

export const authSignUpUser = createAsyncThunk(
  'auth/signUpUser',
  async ({ mail, password, login, avatar }, thunkApi) => {
    try {
      await createUserWithEmailAndPassword(auth, mail, password);
      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: avatar,
      });
      const { uid, displayName, email, photoURL } = auth.currentUser;
      return { uid, displayName, email, photoURL };
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const authSignInUser = createAsyncThunk(
  'auth/signInUser',
  async ({ mail, password }, thunkApi) => {
    try {
      await signInWithEmailAndPassword(auth, mail, password);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const authSingOutUser = createAsyncThunk(
  'auth/singOutUser',
  async (_, thunkApi) => {
    try {
      await signOut(auth);``
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

