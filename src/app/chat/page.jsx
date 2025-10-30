"use client";

export default function ChatLoadingPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh]">
      <div className="flex items-center gap-3 text-purple-300">
        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Preparing your chat…</span>
      </div>
    </div>
  );
}
