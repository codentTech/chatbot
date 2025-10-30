"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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

  // Use separate selectors to avoid unnecessary re-renders
  const selectedChatbot = useSelector((state) => state.chatbot.selectedChatbot);
  const loading = useSelector((state) => state.chatbot.loading);
  const error = useSelector((state) => state.chatbot.error);

  // Get chatbot ID only (stable primitive value)
  const chatbotId = selectedChatbot?.id ? String(selectedChatbot.id) : null;

  // Use ref to store stable chatbot reference - only update when ID changes
  const chatbotRef = useRef(null);
  const chatbotIdRef = useRef(null);

  // Only update refs if ID actually changed (not just object reference)
  if (chatbotId !== chatbotIdRef.current) {
    chatbotIdRef.current = chatbotId;
    chatbotRef.current = selectedChatbot;
  } else if (selectedChatbot && chatbotRef.current?.id === selectedChatbot.id) {
    // ID same, but object reference might have changed - keep old reference to prevent re-render
    // Only update if selectedChatbot exists but ref doesn't (initial load)
    if (!chatbotRef.current) {
      chatbotRef.current = selectedChatbot;
    }
  }

  // Use ref value to ensure stable prop
  const memoizedChatbot = chatbotRef.current;

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

  if (!selectedChatbot || !memoizedChatbot) {
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
        chatbot={memoizedChatbot}
        onBackToChatbots={handleBackToChatbots}
        onNewConversation={handleNewConversation}
        searchQuery={searchQuery}
      />
    </ChatbotLayout>
  );
}
