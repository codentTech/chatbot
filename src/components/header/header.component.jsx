import {
  Brain,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Share2,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { removeUser } from "@/common/utils/users.util";
import { useRouter } from "next/navigation";
import { getUser } from "@/common/utils/users.util";

export default function Header({
  selectedModel = "gpt-4o", // Keep this as the default value for backward compatibility
  setSelectedModel = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  searchPlaceholder = "Search...",
  showSearch = false,
  sidebarOpen = false,
  setSidebarOpen = () => {},
}) {
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const [modelDropdownPosition, setModelDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Get authentication state
  const user = getUser()?.user || {};
  const isAuthenticated = isLoginVerified();

  // Close dropdowns when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (showModelDropdown) {
        setShowModelDropdown(false);
      }
      if (showUserDropdown) {
        setShowUserDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showModelDropdown, showUserDropdown]);

  // Close dropdowns when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (showModelDropdown) {
        setShowModelDropdown(false);
      }
      if (showUserDropdown) {
        setShowUserDropdown(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showModelDropdown, showUserDropdown]);

  const models = [
    {
      label: "Omni",
      value: "gpt-4o",
      icon: Sparkles,
    },
    {
      label: "Turbo",
      value: "gpt-4-turbo",
      icon: Zap,
    },
    {
      label: "Classic",
      value: "gpt-4",
      icon: Brain,
    },
    {
      label: "Swift",
      value: "gpt-3.5-turbo",
      icon: Zap,
    },
    {
      label: "Sonnet",
      value: "claude-3.5-sonnet",
      icon: Brain,
    },
    {
      label: "Opus",
      value: "claude-3-opus",
      icon: Brain,
    },
    {
      label: "Harmony",
      value: "claude-3-sonnet",
      icon: Brain,
    },
    {
      label: "Haiku",
      value: "claude-3-haiku",
      icon: Zap,
    },
    {
      label: "Pro",
      value: "gemini-1.5-pro",
      icon: Sparkles,
    },
    {
      label: "Flash",
      value: "gemini-1.5-flash",
      icon: Zap,
    },
    {
      label: "Gemini",
      value: "gemini-pro",
      icon: Brain,
    },
    {
      label: "Large",
      value: "mistral-large",
      icon: Brain,
    },
    {
      label: "Medium",
      value: "mistral-medium",
      icon: Zap,
    },
    {
      label: "Small",
      value: "mistral-small",
      icon: Zap,
    },
  ];

  const userMenuItems = [
    {
      label: "Settings",
      icon: Settings,
      action: () => {
        router.push("/settings");
      },
    },
    {
      label: "Logout",
      icon: LogOut,
      action: () => {
        removeUser();
        router.push("/login");
      },
    },
  ];

  // Update dropdown position when button is clicked
  const handleDropdownToggle = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setShowUserDropdown(!showUserDropdown);
  };

  const handleModelDropdownToggle = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setModelDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
    setShowModelDropdown(!showModelDropdown);
  };

  const handleModelSelect = (modelValue) => {
    if (typeof setSelectedModel === "function") {
      setSelectedModel(modelValue);
    }

    setShowModelDropdown(false);
  };

  const getSelectedModel = () => {
    const selected =
      models.find((model) => model.value === selectedModel) || models[0];
    return selected;
  };

  const selectedModelData = getSelectedModel();

  return (
    <>
      <div className="relative px-2 sm:px-4 py-2 sm:py-[7px] h-[3.5rem] flex items-center overflow-hidden z-20 border-b border-purple-600/30 w-full">
        {/* Animated Background Pattern - Same theme as ChatArea */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/2 right-1/4 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Header Content with proper z-index and width constraints */}
        <div className="relative z-10 flex items-center w-full min-w-0">
          {/* Left Section */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button - Only show when sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 bg-slate-800/90 hover:bg-slate-700/90 border border-purple-700/50 rounded-lg text-purple-200 backdrop-blur-md transition-all duration-200 flex items-center justify-center"
              >
                <Menu size={16} className="sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Model Dropdown - Left on desktop, hidden on mobile */}
            <div className="relative w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] hidden md:block">
              <button
                onClick={handleModelDropdownToggle}
                className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg border shadow-sm transition-all duration-200 text-xs font-medium group hover:shadow-md bg-gray-900 border-purple-900 text-purple-200 hover:border-purple-700 hover:bg-gray-800`}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <selectedModelData.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="font-semibold text-xs truncate">
                      {selectedModelData.label}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 flex-shrink-0 ${
                    showModelDropdown ? "rotate-180" : ""
                  } text-purple-400`}
                />
              </button>
            </div>
          </div>

          {/* Center Section - Search Bar (when enabled) or Model Dropdown (Mobile) */}
          <div className="flex items-center justify-center flex-1 min-w-0">
            {/* Search Bar - Center when enabled */}
            <div className="w-full min-w-[230px] px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 z-10" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 p-2 bg-slate-800/50 border-purple-700/50 text-white placeholder-purple-400 border rounded-lg text-xs outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-end min-w-0">
            <button className="hidden md:flex justify-center items-center rounded-full bg-purple-600 p-1.5 sm:p-2 text-white hover:bg-gray-800 transition-colors backdrop-blur-sm flex-shrink-0">
              <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Conditional Rendering based on Authentication */}
            {!isAuthenticated ? (
              /* Sign In/Login Button */
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-purple-500/25"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            ) : (
              /* User Profile Dropdown */
              <div className="relative flex-shrink-0">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center gap-1.5 sm:gap-1.5 p-10 sm:p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors text-white backdrop-blur-sm"
                >
                  <button className="hidden md:flex justify-center items-center rounded-full bg-purple-600 p-1.5 sm:p-2 text-white hover:bg-gray-800 transition-colors backdrop-blur-sm flex-shrink-0">
                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <span className="text-xs sm:text-xs font-medium text-white hidden sm:block truncate">
                    {user?.username || user?.email || "User"}
                  </span>
                  <ChevronDown
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform flex-shrink-0 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Dropdown Menu - Rendered at body level */}
      {showModelDropdown && (
        <div
          style={{
            position: "fixed",
            top: modelDropdownPosition.top,
            left: modelDropdownPosition.left,
            width: modelDropdownPosition.width,
            zIndex: 999999,
          }}
          className="pointer-events-auto"
        >
          <div className="rounded-lg shadow-2xl border max-h-72 sm:max-h-80 overflow-hidden bg-gray-900 border-gray-700 shadow-gray-900/50">
            {/* Scrollable container */}
            <div
              className="max-h-56 sm:max-h-72 overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#6b7280 #374151",
              }}
            >
              <style jsx>{`
                .overflow-y-auto::-webkit-scrollbar {
                  width: 4px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                  background: #374151;
                  border-radius: 2px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                  background: #6b7280;
                  border-radius: 2px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                  background: #9ca3af;
                }
              `}</style>
              {models.map((model) => (
                <button
                  key={model.value}
                  onClick={() => handleModelSelect(model.value)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-left hover:transition-colors ${
                    model.value === selectedModel
                      ? "bg-purple-900/20 text-purple-200 border-l-2 border-purple-500"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <model.icon
                    className={`w-3 h-3 ${
                      model.value === selectedModel
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-xs">{model.label}</div>
                  </div>
                  {model.value === selectedModel && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Dropdown Menu - Rendered at body level */}
      {showUserDropdown && (
        <div
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            zIndex: 999999,
          }}
          className="w-48 rounded-lg shadow-xl border bg-gray-900 border-gray-700"
        >
          <div className="py-1">
            {userMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setShowUserDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-800 transition-colors text-gray-300"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showModelDropdown || showUserDropdown) && (
        <div
          className="fixed inset-0 z-[999998]"
          onClick={() => {
            setShowModelDropdown(false);
            setShowUserDropdown(false);
          }}
        />
      )}
    </>
  );
}
