import PropTypes from "prop-types";

/**
 * Create custom button with glassmorphism theme
 * @param text to be displayed on button
 * @param onClick function to be called on click
 * @param className is used to add custom styles classes to button
 * @param type type of button
 * @param variant variant of button (primary, secondary, outline, danger, ghost, cancel)
 * @param size size of button (sm, md, lg)
 * @param disabled to button disabled
 * @param href to be used as link
 * @param endIcon icon to be displayed at end of button
 * @param startIcon icon to be displayed at start of button
 * @param loading loading state for button
 * @returns component
 */

export default function CustomButton({
  id = null,
  text,
  onClick = null,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  href = null,
  endIcon = null,
  startIcon = null,
  loading = false,
}) {
  // Get the theme-based button classes
  const getButtonClasses = () => {
    const baseClasses =
      "font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg";

    // Variant classes using glassmorphism theme
    const variantClasses = {
      primary:
        "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white hover:shadow-purple-500/25",
      secondary:
        "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-gray-600 disabled:to-gray-700 text-white hover:shadow-slate-500/25",
      outline:
        "bg-white/10 border border-white/20 hover:bg-white/20 text-white hover:shadow-white/25",
      danger:
        "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white hover:shadow-red-500/25",
      ghost:
        "bg-transparent hover:bg-white/10 text-white hover:shadow-white/25",
      cancel:
        "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-600 disabled:to-gray-700 text-white hover:shadow-gray-500/25",
    };

    // Size classes
    const sizeClasses = {
      sm: "text-sm py-2 px-3 h-9",
      md: "text-sm py-2.5 px-4 h-11", // default
      lg: "text-base py-3 px-6 h-12",
    };

    return `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || ""} ${className}`;
  };

  // Handle loading state
  const buttonContent = loading ? (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      {text}
    </span>
  ) : (
    <span className="flex items-center gap-2">
      {startIcon && <span>{startIcon}</span>}
      {text}
      {endIcon && <span>{endIcon}</span>}
    </span>
  );

  const buttonElement = (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={getButtonClasses()}
    >
      {buttonContent}
    </button>
  );

  // If href is provided, wrap in a link
  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonElement}
      </a>
    );
  }

  return buttonElement;
}

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "danger",
    "ghost",
    "cancel",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  href: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  id: PropTypes.string,
  loading: PropTypes.bool,
};

// Export variant constants for easy usage
export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  OUTLINE: "outline",
  DANGER: "danger",
  GHOST: "ghost",
  CANCEL: "cancel",
};

export const BUTTON_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};
