"use client";

import {
  Check,
  Code,
  Copy,
  Edit,
  FileText,
  Mic,
  Palette,
  Paperclip,
  RefreshCcw,
  Search,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import MessageRenderer from "./messagee-renderer";
import useChatArea from "./use-chat-area.hook";
import { isLoginVerified } from "@/common/utils/access-token.util";

function ChatArea({
  isDarkMode,
  chatMessages,
  setChatMessages,
  message,
  setMessage,
  isRecording,
  setIsRecording,
  onSendMessage,
  onKeyPress,
  isLoading = false,
  onRetryMessage,
}) {
  const isLoggedIn = isLoginVerified();

  const {
    messagesEndRef,
    textareaRef,
    streamingMessageId,
    isAiTyping,
    copiedMessageId,
    isChatDisabled,
    getMessageContent,
    handleExplainCode,
    handleDesignIdeas,
    handleWriteContent,
    handleResearchTopic,
    handleSendMessage,
    handleKeyPress,
    handleCopyMessage,
    handleEditMessage,
    handleRetryMessage,
  } = useChatArea({
    chatMessages,
    setChatMessages,
    message,
    setMessage,
    isLoading,
    onSendMessage,
    onRetryMessage,
    isLoggedIn,
  });

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-2 sm:space-y-4 mt-4">
          {chatMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-purple-300 text-sm">No conversation found</p>
              </div>
            </div>
          ) : (
            chatMessages.map((msg, index) => {
              const content = getMessageContent(msg);
              const isStreaming =
                msg.type === "ai" && streamingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} transform transition-all duration-300 ease-out`}
                  style={{
                    animationDelay: `${Math.min(index * 0.03, 0.5)}s`,
                  }}
                >
                  <div
                    className={`max-w-[85vw] sm:max-w-2xl relative transition-all duration-300 ease-out group ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-800/50 via-purple-700/60 to-purple-800/50 text-white border border-purple-600/40 shadow-purple-500/20 rounded-xl p-3 sm:p-4 rounded-br-md shadow-lg hover:shadow-2xl backdrop-blur-sm"
                        : `bg-white/5 ${isDarkMode ? "text-white" : "text-slate-900"} p-3 sm:p-4 rounded-xl rounded-bl-md border border-white/10`
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      <MessageRenderer
                        content={content}
                        isDarkMode={isDarkMode}
                      />
                      {isStreaming && (
                        <span className="inline-block w-0.5 h-4 bg-gradient-to-b from-purple-400 to-purple-600 ml-1 animate-pulse rounded-full"></span>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${
                        isDarkMode
                          ? "border-purple-700/20"
                          : "border-purple-300/20"
                      }`}
                    >
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        {msg.timestamp}
                      </div>

                      {msg.type === "ai" ? (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyMessage(content, msg.id);
                            }}
                            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                              copiedMessageId === msg.id
                                ? "bg-green-500/20"
                                : isDarkMode
                                  ? "hover:bg-slate-700/40"
                                  : "hover:bg-purple-100/50"
                            } ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                            title={
                              copiedMessageId === msg.id ? "Copied!" : "Copy"
                            }
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            )}
                          </button>
                          <button
                            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                              isDarkMode
                                ? "hover:bg-slate-700/40 text-purple-300"
                                : "hover:bg-purple-100/50 text-purple-600"
                            }`}
                            title="Like"
                          >
                            <ThumbsUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                              isDarkMode
                                ? "hover:bg-slate-700/40 text-purple-300"
                                : "hover:bg-purple-100/50 text-purple-600"
                            }`}
                            title="Dislike"
                          >
                            <ThumbsDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyMessage(msg.content, msg.id);
                            }}
                            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                              copiedMessageId === msg.id
                                ? "bg-green-500/20"
                                : isDarkMode
                                  ? "hover:bg-slate-700/40"
                                  : "hover:bg-purple-100/50"
                            } ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                            title={
                              copiedMessageId === msg.id ? "Copied!" : "Copy"
                            }
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMessage(index);
                            }}
                            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                              isDarkMode
                                ? "hover:bg-slate-700/40 text-purple-300"
                                : "hover:bg-purple-100/50 text-purple-600"
                            }`}
                            title="Edit message"
                          >
                            <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryMessage(index);
                            }}
                            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                              isDarkMode
                                ? "hover:bg-slate-700/40 text-purple-300"
                                : "hover:bg-purple-100/50 text-purple-600"
                            }`}
                            title="Retry"
                            disabled={isLoading}
                          >
                            <RefreshCcw
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                isLoading ? "opacity-50" : ""
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/* ok */}
          {isAiTyping && !streamingMessageId && (
            <div className="flex justify-start transition-all duration-300 ease-in-out">
              <div className="max-w-[85vw] sm:max-w-2xl bg-gradient-to-r from-slate-800/30 to-purple-800/20 backdrop-blur-sm rounded-xl rounded-bl-md px-3 py-2 border border-purple-500/20 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-purple-300 text-xs font-medium">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-2 sm:p-4 relative z-10   border-t border-white/5">
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="rounded-xl border border-white/20 p-2 sm:p-3 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={onKeyPress || handleKeyPress}
                  placeholder={
                    isChatDisabled
                      ? "Please sign in or open a new chat to continue..."
                      : "Ask me anything... I'm here to help!"
                  }
                  disabled={isChatDisabled}
                  className={`w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-24 text-xs sm:text-sm focus:outline-none transition-all duration-200 ${
                    isChatDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  rows="1"
                  onInput={(e) => {
                    if (!isChatDisabled) {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="hidden md:flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-center sm:justify-start">
                <button
                  onClick={handleExplainCode}
                  disabled={isChatDisabled}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-all duration-200 text-white flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isChatDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Code className="w-3 h-3" />
                  <span>Explain this code</span>
                </button>
                <button
                  onClick={handleDesignIdeas}
                  disabled={isChatDisabled}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-all duration-200 text-white flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isChatDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Palette className="w-3 h-3" />
                  <span>Design ideas</span>
                </button>
                <button
                  onClick={handleWriteContent}
                  disabled={isChatDisabled}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-all duration-200 text-white flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isChatDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Write content</span>
                </button>
                <button
                  onClick={handleResearchTopic}
                  disabled={isChatDisabled}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-all duration-200 text-white flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isChatDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Search className="w-3 h-3" />
                  <span>Research topic</span>
                </button>
              </div>

              <div className="flex justify-end items-center gap-1.5 sm:gap-2 mt-2 sm:mt-0">
                <button className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white flex items-center justify-center">
                  <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex items-center justify-center text-white ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading || isChatDisabled}
                  className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                  title={
                    isChatDisabled ? "Please sign in or open a new chat" : ""
                  }
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
