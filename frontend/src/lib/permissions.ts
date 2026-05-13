export type UserRole = "superadmin" | "admin" | "user";

export const permissions = {
  canViewCosts(role?: UserRole) {
    return role === "superadmin";
  },

  canViewMargins(role?: UserRole) {
    return role === "superadmin" || role === "admin";
  },

  canManageUsers(role?: UserRole) {
    return role === "superadmin" || role === "admin";
  },

  canCreateAdmin(role?: UserRole) {
    return role === "superadmin";
  },

  canCreateSeller(role?: UserRole) {
    return role === "admin";
  },

  canViewAdminDashboard(role?: UserRole) {
    return role === "superadmin" || role === "admin";
  },

  canEditBranding(role?: UserRole) {
    return role === "superadmin" || role === "admin";
  },

  canViewProviderPricing(role?: UserRole) {
    return role === "superadmin";
  },

  canViewFinalClientPricing(role?: UserRole) {
    return true;
  },
};
