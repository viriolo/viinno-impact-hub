
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Award } from "lucide-react";

type NotificationType = "achievement" | "endorsement" | "connection" | "message";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return;

    // Mock the achievements notification for now
    const mockAchievement = {
      id: crypto.randomUUID(),
      type: 'achievement' as NotificationType,
      title: '🏆 New Achievement Unlocked!',
      message: "You've earned: Profile Perfectionist",
      createdAt: new Date(),
      read: false,
      data: { 
        id: "1", 
        name: "Profile Perfectionist",
        description: "Completed 100% of your profile",
        icon: "award",
        badge_url: "/badges/profile-perfectionist.png"
      }
    };
    
    // Add the mock achievement to notifications
    setNotifications(prev => [...prev, mockAchievement]);
    
    // Show toast for the achievement
    toast({
      title: mockAchievement.title,
      description: mockAchievement.message,
      action: (
        <div className="flex items-center justify-center rounded-full bg-primary w-8 h-8">
          <Award className="h-4 w-4 text-white" />
        </div>
      )
    });

    // Set up a mock subscription for endorsements
    const timer = setTimeout(() => {
      const mockEndorsement = {
        id: crypto.randomUUID(),
        type: 'endorsement' as NotificationType,
        title: '👍 New Skill Endorsement',
        message: `John Doe endorsed you for React`,
        createdAt: new Date(),
        read: false,
        data: {
          endorserId: "user-123",
          endorserName: "John Doe",
          endorserAvatar: null,
          skillId: "skill-react",
          skillName: "React"
        }
      };

      setNotifications(prev => [mockEndorsement, ...prev]);

      toast({
        title: mockEndorsement.title,
        description: mockEndorsement.message,
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [user, toast]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
