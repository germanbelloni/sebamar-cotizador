import { create } from "zustand";

type UIState = {
  usersPanelOpen: boolean;

  createUserModalOpen: boolean;

  openUsersPanel: () => void;

  closeUsersPanel: () => void;

  openCreateUserModal: () => void;

  closeCreateUserModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  usersPanelOpen: false,

  createUserModalOpen: false,

  openUsersPanel: () =>
    set({
      usersPanelOpen: true,
    }),

  closeUsersPanel: () =>
    set({
      usersPanelOpen: false,
    }),

  openCreateUserModal: () =>
    set({
      createUserModalOpen: true,
    }),

  closeCreateUserModal: () =>
    set({
      createUserModalOpen: false,
    }),
}));
