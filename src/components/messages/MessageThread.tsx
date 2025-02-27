
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
}

interface OtherUser {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface MessageThreadProps {
  conversationId: string;
  otherUser: OtherUser;
}

export function MessageThread({ conversationId, otherUser }: MessageThreadProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages on component mount and when conversationId changes
  useEffect(() => {
    if (!user || !conversationId) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Get all direct messages between current user and the other user
        const { data, error } = await supabase
          .from("direct_messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id})`)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        setMessages(data || []);
        
        // Mark unread messages as read
        const unreadMessages = data?.filter(
          (msg) => msg.recipient_id === user.id && !msg.is_read
        ) || [];
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map((msg) =>
              supabase
                .from("direct_messages")
                .update({ is_read: true })
                .eq("id", msg.id)
            )
          );
          
          // Invalidate queries to refresh sidebar
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages for this conversation
    const channel = supabase
      .channel(`direct_messages_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id}))`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          
          // Mark as read if user is the recipient
          if (newMessage.recipient_id === user.id) {
            supabase
              .from("direct_messages")
              .update({ is_read: true })
              .eq("id", newMessage.id)
              .then(() => {
                // Invalidate queries to refresh sidebar
                queryClient.invalidateQueries({ queryKey: ['messages'] });
              });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId, queryClient]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={otherUser.avatar_url || ""} />
          <AvatarFallback>
            {otherUser.username
              ? otherUser.username.charAt(0).toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{otherUser.username || "Unknown User"}</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            No messages yet. Start a conversation!
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="text-xs text-center text-muted-foreground my-4">
                {new Date(date).toDateString() === new Date().toDateString()
                  ? "Today"
                  : format(new Date(date), "MMMM d, yyyy")}
              </div>
              
              {dateMessages.map((message) => {
                const isUserSender = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${
                      isUserSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUserSender && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={otherUser.avatar_url || ""} />
                        <AvatarFallback>
                          {otherUser.username
                            ? otherUser.username.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        isUserSender
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-gray-100 rounded-tl-none"
                      }`}
                    >
                      <div className="break-words">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          isUserSender ? "text-primary-50" : "text-muted-foreground"
                        }`}
                      >
                        {format(new Date(message.created_at), "h:mm a")}
                        {isUserSender && (
                          <span className="ml-2">
                            {message.is_read ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
