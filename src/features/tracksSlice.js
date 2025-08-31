import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an async thunk to fetch track data from a local JSON file
export const fetchTracks = createAsyncThunk('tracks/fetchTracks', async () => {
  const response = await axios.get(`${process.env.PUBLIC_URL}/tracks.json`);
  return response.data;
});

const initialState = {
  tracks: [],
  status: 'idle',
  error: null,
};

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default tracksSlice.reducer;

// export default tracksSlice.reducer;
