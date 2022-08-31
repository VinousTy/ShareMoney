import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LAYOUT_STATE } from '../../types/Types';

const initialState: LAYOUT_STATE = {
  isDrawer: false,
  // isModal: false,
  isDeleteModal: false,
  isPostModal: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    isToggleDrawer(state) {
      state.isDrawer = !state.isDrawer;
    },
    // isModalOpen(state) {
    //   state.isModal = true;
    // },
    // isModalClose(state) {
    //   state.isModal = false;
    // },
    isDeleteModalOpen(state) {
      state.isDeleteModal = true;
    },
    isDeleteModalClose(state) {
      state.isDeleteModal = false;
    },
    isPostModalOpen(state) {
      state.isPostModal = true;
    },
    isPostModalClose(state) {
      state.isPostModal = false;
    },
  },
});

export const {
  isToggleDrawer,
  // isModalOpen,
  // isModalClose,
  isDeleteModalOpen,
  isDeleteModalClose,
  isPostModalOpen,
  isPostModalClose,
} = layoutSlice.actions;

export const selectIsDrawer = (state: RootState) => state.layout.isDrawer;
// export const selectIsModal = (state: RootState) => state.layout.isModal;
export const selectIsDeleteModal = (state: RootState) =>
  state.layout.isDeleteModal;
export const selectIsPostModal = (state: RootState) => state.layout.isPostModal;

export default layoutSlice.reducer;
