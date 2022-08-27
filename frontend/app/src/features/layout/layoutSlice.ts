import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LAYOUT_STATE } from '../../types/Types';

const initialState: LAYOUT_STATE = {
  isDrawer: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    isToggleDrawer(state) {
      state.isDrawer = !state.isDrawer;
    },
  },
});

export const { isToggleDrawer } = layoutSlice.actions;

export const selectIsDrawer = (state: RootState) => state.layout.isDrawer;

export default layoutSlice.reducer;
