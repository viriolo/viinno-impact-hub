
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export interface MessageData {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

/**
 * Send a direct message to another user
 */
export const sendMessage = async (
  content: string,
  recipientId: string,
  currentUser: User
): Promise<MessageData | null> => {
  try {
    if (!content.trim()) {
      toast({
        title: "Message cannot be empty",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: currentUser.id,
        recipient_id: recipientId,
        content: content.trim(),
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    toast({
      title: "Something went wrong",
      description: "Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Mark a message as read
 */
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("direct_messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) {
      console.error("Error marking message as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markMessageAsRead:", error);
    return false;
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

/**
 * Subscribe to new messages
 */
export const subscribeToMessages = (
  userId: string,
  onNewMessage: (message: MessageData) => void
) => {
  const channel = supabase
    .channel("direct_messages_subscription")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => {
        onNewMessage(payload.new as MessageData);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
