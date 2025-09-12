import api from "../../../common/utils/api";

class ChatbotService {
  // Get all chatbots for the current user
  async getChatbots(params = {}) {
    const { skip = 0, limit = 100, search, category, status } = params;
    const queryParams = new URLSearchParams();

    if (skip) queryParams.append("skip", skip);
    if (limit) queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (status) queryParams.append("status", status);

    const queryString = queryParams.toString();
    const url = `/api/chatbots/${queryString ? `?${queryString}` : ""}`;

    const response = await api().get(url);
    return response.data.data; // Extract data from APIResponse format
  }

  // Get a specific chatbot by ID
  async getChatbotById(chatbotId) {
    const response = await api().get(`/api/chatbots/${chatbotId}`);
    return response.data.data;
  }

  // Create a new chatbot
  async createChatbot(chatbotData) {
    const response = await api().post("/api/chatbots/", chatbotData);
    return response.data.data;
  }

  // Update a chatbot
  async updateChatbot(chatbotId, updateData) {
    const response = await api().put(`/api/chatbots/${chatbotId}`, updateData);
    return response.data.data;
  }

  // Delete a chatbot
  async deleteChatbot(chatbotId) {
    const response = await api().delete(`/api/chatbots/${chatbotId}`);
    return response.data.data;
  }

  // Get public chatbots
  async getPublicChatbots(params = {}) {
    const { skip = 0, limit = 100, search, category } = params;
    const queryParams = new URLSearchParams();

    if (skip) queryParams.append("skip", skip);
    if (limit) queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);

    const queryString = queryParams.toString();
    const url = `/api/chatbots/public${queryString ? `?${queryString}` : ""}`;

    const response = await api().get(url);
    return response.data.data;
  }

  // Search chatbots
  async searchChatbots(query, params = {}) {
    const { skip = 0, limit = 100 } = params;
    const queryParams = new URLSearchParams();

    queryParams.append("query", query);
    if (skip) queryParams.append("skip", skip);
    if (limit) queryParams.append("limit", limit);

    const queryString = queryParams.toString();
    const url = `/api/chatbots/search?${queryString}`;

    const response = await api().get(url);
    return response.data.data;
  }

  // Get chatbot statistics
  async getChatbotStats(chatbotId) {
    const response = await api().get(`/api/chatbots/${chatbotId}/stats`);
    return response.data.data;
  }

  // Create a conversation in a chatbot
  async createConversationInChatbot(chatbotId, conversationData) {
    const response = await api().post(
      `/api/chatbots/${chatbotId}/conversations`,
      conversationData
    );
    return response.data.data;
  }

  // Get conversations in a chatbot
  async getConversationsInChatbot(chatbotId, params = {}) {
    const { skip = 0, limit = 100 } = params;
    const queryParams = new URLSearchParams();

    if (skip) queryParams.append("skip", skip);
    if (limit) queryParams.append("limit", limit);

    const queryString = queryParams.toString();
    const url = `/api/chatbots/${chatbotId}/conversations${queryString ? `?${queryString}` : ""}`;

    const response = await api().get(url);
    return response.data.data;
  }

  // Duplicate a chatbot
  async duplicateChatbot(chatbotId, newName) {
    const response = await api().post(`/api/chatbots/${chatbotId}/duplicate`, {
      new_name: newName,
    });
    return response.data.data;
  }

  // Archive a chatbot
  async archiveChatbot(chatbotId) {
    const response = await api().post(`/api/chatbots/${chatbotId}/archive`);
    return response.data.data;
  }

  // Activate a chatbot
  async activateChatbot(chatbotId) {
    const response = await api().post(`/api/chatbots/${chatbotId}/activate`);
    return response.data.data;
  }
}

export default new ChatbotService();
