import { configureStore } from '@reduxjs/toolkit';
import tracksReducer from './features/tracksSlice';

const store = configureStore({
  reducer: {
    tracks: tracksReducer,
  },
});

export default store;
