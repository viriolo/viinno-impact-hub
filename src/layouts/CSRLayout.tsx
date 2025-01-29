import { MainLayout } from "./MainLayout";
import { ReactNode } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";

interface CSRLayoutProps {
  children: ReactNode;
}

export function CSRLayout({ children }: CSRLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}