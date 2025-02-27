
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Conversation } from "@/pages/messages";
import { formatDistanceToNow } from "date-fns";

interface MessagesSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export function MessagesSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
}: MessagesSidebarProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.otherUser.id}
              className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer ${
                currentConversationId === conversation.otherUser.id ? "bg-slate-100" : ""
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.otherUser.avatar_url || ""} />
                <AvatarFallback>
                  {conversation.otherUser.username
                    ? conversation.otherUser.username.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate">
                    {conversation.otherUser.username || "Unknown User"}
                  </div>
                  {conversation.lastMessage && (
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
                {conversation.lastMessage && (
                  <div className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.content}
                  </div>
                )}
              </div>
              {conversation.lastMessage && !conversation.lastMessage.is_read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
