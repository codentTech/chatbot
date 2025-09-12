import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "./chat.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  conversations: generalState,
  currentConversation: generalState,
  messages: generalState,
  sendMessage: generalState,
  createConversation: generalState,
  deleteConversation: generalState,
  clearConversation: generalState,
  toggleStar: generalState,
  updateConversation: generalState,
  models: generalState,
};

// Get all conversations
export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async ({ skip = 0, limit = 100 }, thunkAPI) => {
    try {
      const response = await chatService.getConversations(skip, limit);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new conversation
export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async ({ title }, thunkAPI) => {
    try {
      const response = await chatService.createConversation(title);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get conversation by ID
export const getConversationById = createAsyncThunk(
  "chat/getConversationById",
  async ({ conversationId }, thunkAPI) => {
    try {
      const response = await chatService.getConversationById(conversationId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get conversation messages
export const getConversationMessages = createAsyncThunk(
  "chat/getConversationMessages",
  async ({ conversationId, skip = 0, limit = 100 }, thunkAPI) => {
    try {
      const response = await chatService.getConversationMessages(
        conversationId,
        skip,
        limit
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, conversationId, model = "gpt-4o" }, thunkAPI) => {
    try {
      const response = await chatService.sendMessage(
        message,
        conversationId,
        model
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete conversation
export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async ({ conversationId }, thunkAPI) => {
    try {
      const response = await chatService.deleteConversation(conversationId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clear conversation
export const clearConversation = createAsyncThunk(
  "chat/clearConversation",
  async ({ conversationId }, thunkAPI) => {
    try {
      const response = await chatService.clearConversation(conversationId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle conversation star
export const toggleConversationStar = createAsyncThunk(
  "chat/toggleConversationStar",
  async ({ conversationId, isStarred }, thunkAPI) => {
    try {
      const response = await chatService.toggleConversationStar(
        conversationId,
        isStarred
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update conversation title
export const updateConversation = createAsyncThunk(
  "chat/updateConversation",
  async ({ conversationId, title }, thunkAPI) => {
    try {
      const response = await chatService.updateConversation(
        conversationId,
        title
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get AI models
export const getModels = createAsyncThunk(
  "chat/getModels",
  async (_, thunkAPI) => {
    try {
      const response = await chatService.getModels();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = generalState;
      });
    },
    resetConversations: (state) => {
      state.conversations = generalState;
    },
    resetCurrentConversation: (state) => {
      state.currentConversation = generalState;
    },
    resetMessages: (state) => {
      state.messages = generalState;
    },
    resetSendMessage: (state) => {
      state.sendMessage = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get conversations
      .addCase(getConversations.pending, (state) => {
        state.conversations.isLoading = true;
        state.conversations.isError = false;
        state.conversations.isSuccess = false;
        state.conversations.message = "";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations.isLoading = false;
        state.conversations.isSuccess = true;
        state.conversations.data = action.payload;
        state.conversations.message = "Conversations loaded successfully";
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.conversations.isLoading = false;
        state.conversations.isError = true;
        state.conversations.message =
          action.payload?.message || "Failed to load conversations";
        state.conversations.data = null;
      })

      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.createConversation.isLoading = true;
        state.createConversation.isError = false;
        state.createConversation.isSuccess = false;
        state.createConversation.message = "";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.createConversation.isLoading = false;
        state.createConversation.isSuccess = true;
        state.createConversation.data = action.payload;
        state.createConversation.message = "Conversation created successfully";
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.createConversation.isLoading = false;
        state.createConversation.isError = true;
        state.createConversation.message =
          action.payload?.message || "Failed to create conversation";
        state.createConversation.data = null;
      })

      // Get conversation by ID
      .addCase(getConversationById.pending, (state) => {
        state.currentConversation.isLoading = true;
        state.currentConversation.isError = false;
        state.currentConversation.isSuccess = false;
        state.currentConversation.message = "";
      })
      .addCase(getConversationById.fulfilled, (state, action) => {
        state.currentConversation.isLoading = false;
        state.currentConversation.isSuccess = true;
        state.currentConversation.data = action.payload;
        state.currentConversation.message = "Conversation loaded successfully";
      })
      .addCase(getConversationById.rejected, (state, action) => {
        state.currentConversation.isLoading = false;
        state.currentConversation.isError = true;
        state.currentConversation.message =
          action.payload?.message || "Failed to load conversation";
        state.currentConversation.data = null;
      })

      // Get conversation messages
      .addCase(getConversationMessages.pending, (state) => {
        state.messages.isLoading = true;
        state.messages.isError = false;
        state.messages.isSuccess = false;
        state.messages.message = "";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.messages.isLoading = false;
        state.messages.isSuccess = true;
        state.messages.data = action.payload;
        state.messages.message = "Messages loaded successfully";
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.messages.isLoading = false;
        state.messages.isError = true;
        state.messages.message =
          action.payload?.message || "Failed to load messages";
        state.messages.data = null;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendMessage.isLoading = true;
        state.sendMessage.isError = false;
        state.sendMessage.isSuccess = false;
        state.sendMessage.message = "";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendMessage.isLoading = false;
        state.sendMessage.isSuccess = true;
        state.sendMessage.data = action.payload;
        state.sendMessage.message = "Message sent successfully";
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessage.isLoading = false;
        state.sendMessage.isError = true;
        state.sendMessage.message =
          action.payload?.message || "Failed to send message";
        state.sendMessage.data = null;
      })

      // Delete conversation
      .addCase(deleteConversation.pending, (state) => {
        state.deleteConversation.isLoading = true;
        state.deleteConversation.isError = false;
        state.deleteConversation.isSuccess = false;
        state.deleteConversation.message = "";
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.deleteConversation.isLoading = false;
        state.deleteConversation.isSuccess = true;
        state.deleteConversation.data = action.payload;
        state.deleteConversation.message = "Conversation deleted successfully";
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.deleteConversation.isLoading = false;
        state.deleteConversation.isError = true;
        state.deleteConversation.message =
          action.payload?.message || "Failed to delete conversation";
        state.deleteConversation.data = null;
      })

      // Clear conversation
      .addCase(clearConversation.pending, (state) => {
        state.clearConversation.isLoading = true;
        state.clearConversation.isError = false;
        state.clearConversation.isSuccess = false;
        state.clearConversation.message = "";
      })
      .addCase(clearConversation.fulfilled, (state, action) => {
        state.clearConversation.isLoading = false;
        state.clearConversation.isSuccess = true;
        state.clearConversation.data = action.payload;
        state.clearConversation.message = "Conversation cleared successfully";
      })
      .addCase(clearConversation.rejected, (state, action) => {
        state.clearConversation.isLoading = false;
        state.clearConversation.isError = true;
        state.clearConversation.message =
          action.payload?.message || "Failed to clear conversation";
        state.clearConversation.data = null;
      })

      // Toggle star
      .addCase(toggleConversationStar.pending, (state) => {
        state.toggleStar.isLoading = true;
        state.toggleStar.isError = false;
        state.toggleStar.isSuccess = false;
        state.toggleStar.message = "";
      })
      .addCase(toggleConversationStar.fulfilled, (state, action) => {
        state.toggleStar.isLoading = false;
        state.toggleStar.isSuccess = true;
        state.toggleStar.data = action.payload;
        state.toggleStar.message = "Star status updated successfully";
      })
      .addCase(toggleConversationStar.rejected, (state, action) => {
        state.toggleStar.isLoading = false;
        state.toggleStar.isError = true;
        state.toggleStar.message =
          action.payload?.message || "Failed to update star status";
        state.toggleStar.data = null;
      })

      // Update conversation
      .addCase(updateConversation.pending, (state) => {
        state.updateConversation.isLoading = true;
        state.updateConversation.isError = false;
        state.updateConversation.isSuccess = false;
        state.updateConversation.message = "";
      })
      .addCase(updateConversation.fulfilled, (state, action) => {
        state.updateConversation.isLoading = false;
        state.updateConversation.isSuccess = true;
        state.updateConversation.data = action.payload;
        state.updateConversation.message = "Conversation updated successfully";
      })
      .addCase(updateConversation.rejected, (state, action) => {
        state.updateConversation.isLoading = false;
        state.updateConversation.isError = true;
        state.updateConversation.message =
          action.payload?.message || "Failed to update conversation";
        state.updateConversation.data = null;
      })

      // Get models
      .addCase(getModels.pending, (state) => {
        state.models.isLoading = true;
        state.models.isError = false;
        state.models.isSuccess = false;
        state.models.message = "";
      })
      .addCase(getModels.fulfilled, (state, action) => {
        state.models.isLoading = false;
        state.models.isSuccess = true;
        state.models.data = action.payload;
        state.models.message = "Models loaded successfully";
      })
      .addCase(getModels.rejected, (state, action) => {
        state.models.isLoading = false;
        state.models.isError = true;
        state.models.message =
          action.payload?.message || "Failed to load models";
        state.models.data = null;
      });
  },
});

export const {
  reset,
  resetConversations,
  resetCurrentConversation,
  resetMessages,
  resetSendMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
