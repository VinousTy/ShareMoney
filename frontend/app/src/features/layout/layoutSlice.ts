import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LAYOUT_STATE } from '../../types/Types';

const initialState: LAYOUT_STATE = {
  isLoading: false,
  isDrawer: false,
  isDeleteModal: false,
  isPostModal: false,
  isSearchModal: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    isLoadingStart(state) {
      state.isLoading = true;
    },
    isLoadingEnd(state) {
      state.isLoading = false;
    },
    isToggleDrawer(state) {
      state.isDrawer = !state.isDrawer;
    },
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
    isSearchModalOpen(state) {
      state.isSearchModal = true;
    },
    isSearchModalClose(state) {
      state.isSearchModal = false;
    },
  },
});

export const {
  isLoadingStart,
  isLoadingEnd,
  isToggleDrawer,
  isDeleteModalOpen,
  isDeleteModalClose,
  isPostModalOpen,
  isPostModalClose,
  isSearchModalOpen,
  isSearchModalClose,
} = layoutSlice.actions;

export const selectIsLoading = (state: RootState) => state.layout.isLoading;
export const selectIsDrawer = (state: RootState) => state.layout.isDrawer;
export const selectIsDeleteModal = (state: RootState) =>
  state.layout.isDeleteModal;
export const selectIsPostModal = (state: RootState) => state.layout.isPostModal;
export const selectIsSearchModal = (state: RootState) =>
  state.layout.isSearchModal;

export default layoutSlice.reducer;
