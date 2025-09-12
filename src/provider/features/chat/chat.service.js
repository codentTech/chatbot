import api from "@/common/utils/api";

const chatService = {
  // Get all conversations for the current user
  getConversations: async (skip = 0, limit = 100) => {
    try {
      const response = await api().get(
        `/api/chat/conversations?skip=${skip}&limit=${limit}`
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Create a new conversation
  createConversation: async (title) => {
    try {
      const response = await api().post("/api/chat/conversations", {
        title: title || "New Conversation",
      });
      return response.data; // Backend returns ConversationResponse directly
    } catch (error) {
      throw error;
    }
  },

  // Get a specific conversation by ID
  getConversationById: async (conversationId) => {
    try {
      const response = await api().get(
        `/api/chat/conversations/${conversationId}`
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Get messages for a conversation
  getConversationMessages: async (conversationId, skip = 0, limit = 100) => {
    try {
      const response = await api().get(
        `/api/chat/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Send a message
  sendMessage: async (message, conversationId = null, model = "gpt-4o") => {
    try {
      const response = await api().post("/api/chat/send", {
        message,
        conversation_id: conversationId,
        model,
      });
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await api().delete(
        `/api/chat/conversations/${conversationId}`
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Clear conversation messages
  clearConversation: async (conversationId) => {
    try {
      const response = await api().post(
        `/api/chat/conversations/${conversationId}/clear`
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Toggle conversation star (using updateConversation API)
  toggleConversationStar: async (conversationId, isStarred) => {
    try {
      const response = await api().put(
        `/api/chat/conversations/${conversationId}`,
        { is_starred: isStarred }
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Update conversation title
  updateConversation: async (conversationId, title) => {
    try {
      const response = await api().put(
        `/api/chat/conversations/${conversationId}`,
        { title }
      );
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },

  // Get available AI models
  getModels: async () => {
    try {
      const response = await api().get("/api/chat/models");
      return response.data.data; // Extract data from APIResponse format
    } catch (error) {
      throw error;
    }
  },
};

export default chatService;
