import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export default function Messages() {
  const { recipientId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  // Get or create conversation
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ["conversation", user?.id, recipientId],
    queryFn: async () => {
      // First try to find existing conversation
      const { data: existingParticipations } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user?.id);

      if (existingParticipations?.length) {
        for (const participation of existingParticipations) {
          const { data: otherParticipant } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", participation.conversation_id)
            .eq("user_id", recipientId)
            .single();

          if (otherParticipant) {
            return { id: participation.conversation_id };
          }
        }
      }

      // Create new conversation if none exists
      const { data: newConversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .insert([
          { conversation_id: newConversation.id, user_id: user?.id },
          { conversation_id: newConversation.id, user_id: recipientId }
        ]);

      if (participantsError) throw participantsError;

      return newConversation;
    },
    enabled: !!user?.id && !!recipientId,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversation?.id,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation?.id,
          sender_id: user?.id,
          content
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage.mutate(newMessage);
    }
  };

  if (isLoadingConversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4">
            <div className="h-[60vh] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : messages?.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No messages yet
                  </p>
                ) : (
                  messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}