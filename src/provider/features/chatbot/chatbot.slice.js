import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatbotService from "./chatbot.service";

// Async thunks
export const fetchChatbots = createAsyncThunk(
  "chatbot/fetchChatbots",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await chatbotService.getChatbots(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chatbots"
      );
    }
  }
);

export const fetchChatbotById = createAsyncThunk(
  "chatbot/fetchChatbotById",
  async (chatbotId, { rejectWithValue }) => {
    try {
      const data = await chatbotService.getChatbotById(chatbotId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chatbot"
      );
    }
  }
);

export const createChatbot = createAsyncThunk(
  "chatbot/createChatbot",
  async (chatbotData, { rejectWithValue }) => {
    try {
      const data = await chatbotService.createChatbot(chatbotData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateChatbot = createAsyncThunk(
  "chatbot/updateChatbot",
  async ({ chatbotId, updateData }, { rejectWithValue }) => {
    try {
      const data = await chatbotService.updateChatbot(chatbotId, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update chatbot"
      );
    }
  }
);

export const deleteChatbot = createAsyncThunk(
  "chatbot/deleteChatbot",
  async (chatbotId, { rejectWithValue }) => {
    try {
      await chatbotService.deleteChatbot(chatbotId);
      return chatbotId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chatbot"
      );
    }
  }
);

export const fetchPublicChatbots = createAsyncThunk(
  "chatbot/fetchPublicChatbots",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await chatbotService.getPublicChatbots(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch public chatbots"
      );
    }
  }
);

export const searchChatbots = createAsyncThunk(
  "chatbot/searchChatbots",
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const data = await chatbotService.searchChatbots(query, params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search chatbots"
      );
    }
  }
);

export const fetchConversationsInChatbot = createAsyncThunk(
  "chatbot/fetchConversationsInChatbot",
  async ({ chatbotId, params = {} }, { rejectWithValue }) => {
    try {
      const data = await chatbotService.getConversationsInChatbot(
        chatbotId,
        params
      );
      return { chatbotId, conversations: data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversations"
      );
    }
  }
);

export const createConversationInChatbot = createAsyncThunk(
  "chatbot/createConversationInChatbot",
  async ({ chatbotId, conversationData }, { rejectWithValue }) => {
    try {
      const data = await chatbotService.createConversationInChatbot(
        chatbotId,
        conversationData
      );
      return { chatbotId, conversation: data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create conversation"
      );
    }
  }
);

// Initial state
const initialState = {
  chatbots: [],
  publicChatbots: [],
  searchResults: [],
  selectedChatbot: null,
  chatbotConversations: {}, // chatbotId -> conversations array
  loading: false,
  error: null,
  lastUpdated: null, // Track when chatbots were last modified
  filters: {
    search: "",
    category: "",
    status: "active",
  },
  pagination: {
    skip: 0,
    limit: 100,
    hasMore: true,
  },
};

// Slice
const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        status: "active",
      };
    },
    setSelectedChatbot: (state, action) => {
      state.selectedChatbot = action.payload;
    },
    clearSelectedChatbot: (state) => {
      state.selectedChatbot = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearChatbotConversations: (state, action) => {
      if (action.payload) {
        delete state.chatbotConversations[action.payload];
      } else {
        state.chatbotConversations = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chatbots
      .addCase(fetchChatbots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatbots.fulfilled, (state, action) => {
        state.loading = false;
        state.chatbots = action.payload;
        state.error = null;
      })
      .addCase(fetchChatbots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch chatbot by ID
      .addCase(fetchChatbotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatbotById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedChatbot = action.payload;
        state.error = null;
      })
      .addCase(fetchChatbotById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create chatbot
      .addCase(createChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatbot.fulfilled, (state, action) => {
        state.loading = false;
        state.chatbots.unshift(action.payload);
        state.error = null;
        state.lastUpdated = Date.now();
      })
      .addCase(createChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update chatbot
      .addCase(updateChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatbot.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.chatbots.findIndex(
          (chatbot) => chatbot.id === action.payload.id
        );
        if (index !== -1) {
          state.chatbots[index] = action.payload;
        }
        if (state.selectedChatbot?.id === action.payload.id) {
          state.selectedChatbot = action.payload;
        }
        state.error = null;
        state.lastUpdated = Date.now();
      })
      .addCase(updateChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete chatbot
      .addCase(deleteChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChatbot.fulfilled, (state, action) => {
        state.loading = false;
        state.chatbots = state.chatbots.filter(
          (chatbot) => chatbot.id !== action.payload
        );
        if (state.selectedChatbot?.id === action.payload) {
          state.selectedChatbot = null;
        }
        delete state.chatbotConversations[action.payload];
        state.error = null;
        state.lastUpdated = Date.now();
      })
      .addCase(deleteChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch public chatbots
      .addCase(fetchPublicChatbots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicChatbots.fulfilled, (state, action) => {
        state.loading = false;
        state.publicChatbots = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicChatbots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search chatbots
      .addCase(searchChatbots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchChatbots.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchChatbots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch conversations in chatbot
      .addCase(fetchConversationsInChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationsInChatbot.fulfilled, (state, action) => {
        state.loading = false;
        state.chatbotConversations[action.payload.chatbotId] =
          action.payload.conversations;
        state.error = null;
      })
      .addCase(fetchConversationsInChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create conversation in chatbot
      .addCase(createConversationInChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversationInChatbot.fulfilled, (state, action) => {
        state.loading = false;
        const { chatbotId, conversation } = action.payload;
        if (!state.chatbotConversations[chatbotId]) {
          state.chatbotConversations[chatbotId] = [];
        }
        state.chatbotConversations[chatbotId].unshift(conversation);
        state.error = null;
      })
      .addCase(createConversationInChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setSelectedChatbot,
  clearSelectedChatbot,
  clearSearchResults,
  clearChatbotConversations,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
