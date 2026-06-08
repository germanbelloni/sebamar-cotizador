import { create } from "zustand";

type UIState = {
  usersPanelOpen: boolean;

  createUserModalOpen: boolean;

  createUserType: "admin" | "user";

  openUsersPanel: () => void;

  closeUsersPanel: () => void;

  openCreateUserModal: (type: "admin" | "user") => void;

  closeCreateUserModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  usersPanelOpen: false,

  createUserModalOpen: false,

  createUserType: "user",

  openUsersPanel: () =>
    set({
      usersPanelOpen: true,
    }),

  closeUsersPanel: () =>
    set({
      usersPanelOpen: false,
    }),

  openCreateUserModal: (type) =>
    set({
      createUserModalOpen: true,

      createUserType: type,
    }),

  closeCreateUserModal: () =>
    set({
      createUserModalOpen: false,
    }),
}));
