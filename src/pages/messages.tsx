
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { MessagesSidebar } from "@/components/messages/MessagesSidebar";
import { MessageThread } from "@/components/messages/MessageThread";
import { MessageInput } from "@/components/messages/MessageInput";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/layouts/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";

export type Conversation = {
  id: string;
  otherUser: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  lastMessage: {
    content: string;
    created_at: string;
    is_read: boolean;
  } | null;
};

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { conversationId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  
  // Fetch conversations on component mount
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        // Get all direct messages where the user is either sender or recipient
        const { data: messages, error: messagesError } = await supabase
          .from("direct_messages")
          .select(`
            id,
            content,
            created_at,
            is_read,
            sender_id,
            recipient_id,
            sender:sender_id(id, username, avatar_url),
            recipient:recipient_id(id, username, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: false });
        
        if (messagesError) throw messagesError;
        
        // Process messages into conversations
        const conversationsMap = new Map<string, Conversation>();
        
        messages.forEach((message) => {
          const isUserSender = message.sender_id === user.id;
          const otherUserId = isUserSender ? message.recipient_id : message.sender_id;
          const otherUser = isUserSender ? message.recipient : message.sender;
          
          if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, {
              id: otherUserId,
              otherUser: {
                id: otherUserId,
                username: otherUser.username,
                avatar_url: otherUser.avatar_url,
              },
              lastMessage: {
                content: message.content,
                created_at: message.created_at,
                is_read: message.is_read,
              },
            });
          }
        });
        
        setConversations(Array.from(conversationsMap.values()));
        
        // If conversationId is provided, set the current conversation
        if (conversationId) {
          const conversation = Array.from(conversationsMap.values()).find(
            (c) => c.otherUser.id === conversationId
          );
          setCurrentConversation(conversation || null);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Failed to load conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Subscribe to new messages
    const channel = supabase
      .channel("direct_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          // When a new message arrives
          const newMessage = payload.new;
          
          // Fetch sender details
          const fetchSender = async () => {
            const { data: sender } = await supabase
              .from("profiles")
              .select("id, username, avatar_url")
              .eq("id", newMessage.sender_id)
              .single();
            
            if (sender) {
              // Update conversations list
              setConversations((prev) => {
                const existing = prev.find((c) => c.otherUser.id === sender.id);
                
                if (existing) {
                  // Update existing conversation
                  return prev.map((c) =>
                    c.otherUser.id === sender.id
                      ? {
                          ...c,
                          lastMessage: {
                            content: newMessage.content,
                            created_at: newMessage.created_at,
                            is_read: newMessage.is_read,
                          },
                        }
                      : c
                  );
                } else {
                  // Create new conversation
                  return [
                    {
                      id: sender.id,
                      otherUser: {
                        id: sender.id,
                        username: sender.username,
                        avatar_url: sender.avatar_url,
                      },
                      lastMessage: {
                        content: newMessage.content,
                        created_at: newMessage.created_at,
                        is_read: newMessage.is_read,
                      },
                    },
                    ...prev,
                  ];
                }
              });
              
              // Show notification if not on this conversation
              if (
                !window.location.pathname.includes("/messages") ||
                currentConversation?.otherUser.id !== sender.id
              ) {
                toast({
                  title: `New message from ${sender.username || "User"}`,
                  description: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? "..." : ""),
                  action: (
                    <button
                      onClick={() => navigate(`/messages/${sender.id}`)}
                      className="text-primary hover:underline"
                    >
                      View
                    </button>
                  ),
                });
              }
              
              // Invalidate queries to force refresh
              queryClient.invalidateQueries({ queryKey: ['messages'] });
            }
          };
          
          fetchSender();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId, navigate, toast, queryClient]);
  
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    navigate(`/messages/${conversation.otherUser.id}`);
  };
  
  if (!user) {
    return <div>Please log in to access messages</div>;
  }
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-100px)] bg-white rounded-lg overflow-hidden border">
        <div className="col-span-1 border-r">
          <MessagesSidebar
            conversations={conversations}
            currentConversationId={currentConversation?.otherUser.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div className="col-span-1 md:col-span-3 flex flex-col">
          {currentConversation ? (
            <>
              <div className="flex-1 overflow-hidden">
                <MessageThread 
                  conversationId={currentConversation.otherUser.id} 
                  otherUser={currentConversation.otherUser}
                />
              </div>
              <div className="p-4 border-t">
                <MessageInput recipientId={currentConversation.otherUser.id} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation or start a new message
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;
