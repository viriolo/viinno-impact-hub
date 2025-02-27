
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

    // Load unread achievements
    const loadUnreadAchievements = async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          achieved_at,
          is_seen,
          achievements(
            id,
            name,
            description,
            icon,
            badge_url
          )
        `)
        .eq('user_id', user.id)
        .eq('is_seen', false);

      if (error) {
        console.error('Error loading unread achievements:', error);
        return;
      }

      if (data && data.length > 0) {
        // Convert to notifications
        const achievementNotifications = data.map(item => ({
          id: item.id,
          type: 'achievement' as NotificationType,
          title: '🏆 New Achievement Unlocked!',
          message: `You've earned: ${item.achievements.name}`,
          createdAt: new Date(item.achieved_at),
          read: false,
          data: item.achievements
        }));

        // Add to notifications
        setNotifications(prev => [...prev, ...achievementNotifications]);

        // Show toast for the most recent achievement
        const mostRecent = achievementNotifications[0];
        toast({
          title: mostRecent.title,
          description: mostRecent.message,
          action: (
            <div className="flex items-center justify-center rounded-full bg-primary w-8 h-8">
              <Award className="h-4 w-4 text-white" />
            </div>
          )
        });

        // Mark as seen in the database
        await Promise.all(
          data.map(item => 
            supabase
              .from('user_achievements')
              .update({ is_seen: true })
              .eq('id', item.id)
          )
        );
      }
    };

    // Set up subscription for new endorsements
    const endorsementsSubscription = supabase
      .channel('endorsements-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'skill_endorsements',
          filter: `endorsed_user_id=eq.${user.id}`
        },
        async (payload) => {
          // Get endorser info
          const { data: endorserData } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.endorser_id)
            .single();

          // Get skill info
          const { data: skillData } = await supabase
            .from('skills')
            .select('name')
            .eq('id', payload.new.skill_id)
            .single();

          if (endorserData && skillData) {
            const notification = {
              id: payload.new.id,
              type: 'endorsement' as NotificationType,
              title: '👍 New Skill Endorsement',
              message: `${endorserData.username} endorsed you for ${skillData.name}`,
              createdAt: new Date(payload.commit_timestamp),
              read: false,
              data: {
                endorserId: payload.new.endorser_id,
                endorserName: endorserData.username,
                endorserAvatar: endorserData.avatar_url,
                skillId: payload.new.skill_id,
                skillName: skillData.name
              }
            };

            setNotifications(prev => [notification, ...prev]);

            toast({
              title: notification.title,
              description: notification.message,
            });
          }
        }
      )
      .subscribe();

    // Load initial data
    loadUnreadAchievements();

    return () => {
      supabase.removeChannel(endorsementsSubscription);
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
