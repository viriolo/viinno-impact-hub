export const APP_NAME = "Viinno";

export const ROLES = {
  SCHOLAR: "scholar",
  MENTOR: "mentor",
  NGO: "ngo",
  CSR_FUNDER: "csr_funder",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  DASHBOARD: "/dashboard",
  IMPACT_CARDS: "/impact-cards",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];