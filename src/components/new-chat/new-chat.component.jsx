"use client";

import {
  Code,
  FileText,
  Mic,
  Palette,
  Paperclip,
  Search,
  Send,
} from "lucide-react";
import { useRef } from "react";

export default function NewChat({
  message,
  setMessage,
  isLoading,
  isRecording,
  setIsRecording,
  onSendMessage,
  onKeyPress,
}) {
  const textareaRef = useRef(null);

  // Helper function to focus textarea and position cursor at end
  const focusTextarea = () => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length
        );
      }
    }, 0);
  };

  // Handler for "Explain this code" quick action
  const handleExplainCode = () => {
    setMessage("Explain this code:\n\n```\n// Your code here\n```");
    focusTextarea();
  };

  // Handler for "Design ideas" quick action
  const handleDesignIdeas = () => {
    setMessage("Help me with design ideas for: ");
    focusTextarea();
  };

  // Handler for "Write content" quick action
  const handleWriteContent = () => {
    setMessage("Write content about: ");
    focusTextarea();
  };

  // Handler for "Research topic" quick action
  const handleResearchTopic = () => {
    setMessage("Research and provide information about: ");
    focusTextarea();
  };

  // Handler for toggle recording
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      {/* Clean New Chat Header */}
      <div className="text-center mb-12 w-full max-w-xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 leading-tight">
          How can I help you today?
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
          Ask me anything - I'm here to help with coding, design, writing,
          research, and much more.
        </p>
      </div>

      {/* Chat Input Area */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 sm:p-3">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="Ask me anything... I'm here to help!"
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-24 text-xs sm:text-sm focus:outline-none"
                rows="1"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            {/* Quick Actions */}
            <div className="hidden md:flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-center sm:justify-start">
              <button
                onClick={handleExplainCode}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Code className="w-3 h-3" />
                <span>Explain this code</span>
              </button>
              <button
                onClick={handleDesignIdeas}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Palette className="w-3 h-3" />
                <span>Design ideas</span>
              </button>
              <button
                onClick={handleWriteContent}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Write content</span>
              </button>
              <button
                onClick={handleResearchTopic}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3 h-3" />
                <span>Research topic</span>
              </button>
            </div>

            <div className="flex justify-end items-center gap-1.5 sm:gap-2 mt-2 sm:mt-0">
              <button className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-white flex items-center justify-center">
                <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={handleToggleRecording}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "hover:bg-white/10"
                }`}
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={onSendMessage}
                disabled={!message.trim() || isLoading}
                className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
