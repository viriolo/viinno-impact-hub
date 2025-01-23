import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const AuthContainer = ({ children, title, description }: AuthContainerProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};