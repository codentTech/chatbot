"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ChatbotLayout from "@/common/layouts/chatbot-layout.component";
import ChatbotConversations from "@/components/chatbot-conversations/chatbot-conversations.component";
import { fetchChatbotById } from "@/provider/features/chatbot/chatbot.slice";

export default function ChatbotPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const { selectedChatbot, loading, error } = useSelector(
    (state) => state.chatbot
  );

  useEffect(() => {
    if (params.id) {
      dispatch(fetchChatbotById(params.id));
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (error && !loading) {
      // Chatbot not found or error, redirect to chatbots list
      router.push("/chatbots");
    }
  }, [error, loading, router]);

  const handleBackToChatbots = () => {
    router.push("/chatbots");
  };

  const handleNewConversation = (newConversation) => {
    // Handle new conversation creation
    // Navigate to the new conversation
    router.push(`/chat/${newConversation.id}`);
  };

  if (loading) {
    return (
      <ChatbotLayout title="Loading...">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-purple-300">Loading chatbot...</p>
          </div>
        </div>
      </ChatbotLayout>
    );
  }

  if (!selectedChatbot) {
    return null;
  }

  return (
    <ChatbotLayout
      title={selectedChatbot.name}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showSearch={true}
    >
      <ChatbotConversations
        chatbot={selectedChatbot}
        onBackToChatbots={handleBackToChatbots}
        onNewConversation={handleNewConversation}
        searchQuery={searchQuery}
      />
    </ChatbotLayout>
  );
}
