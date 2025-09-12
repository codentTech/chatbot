"use client";

import { useState } from "react";
import ChatbotLayout from "@/common/layouts/chatbot-layout.component";
import ChatbotManagement from "@/components/chatbot-management/chatbot-management.component";

export default function ChatbotsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateChatbot = (newChatbot) => {
    // Handle new chatbot creation
    // You could add it to the list here
  };

  return (
    <ChatbotLayout
      title="My Chatbots"
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showSearch={false}
    >
      <ChatbotManagement onCreateChatbot={handleCreateChatbot} />
    </ChatbotLayout>
  );
}
