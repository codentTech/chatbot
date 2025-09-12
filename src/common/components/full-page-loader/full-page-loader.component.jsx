import { Brain } from "lucide-react";

function FullPageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Pattern - Same theme as main app */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="text-center relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-700 via-purple-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse shadow-2xl shadow-slate-500/25 border border-slate-600/30">
          <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      </div>
    </div>
  );
}

export default FullPageLoader;
