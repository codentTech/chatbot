/* eslint-disable react/forbid-prop-types */

"use client";

import FieldError from "@/common/components/field-error/field-error.component";
import PropTypes from "prop-types";
import FieldLabel from "../field-label/field-label.component";
import useCustomInput from "./use-custom-input.hook";
import { Eye, EyeOff } from "lucide-react";

/**
 * CustomInput component with glassmorphism theme integration
 * @param type - The type of input (text, email, password, number, date, etc.)
 * @param placeholder - The placeholder text
 * @param onChange - The function to call when the input changes
 * @param name - The name of input to get value in onSubmit
 * @param defaultValue - The value that will be displayed on input field on first time
 * @param value - The value of the input
 * @param className - Additional CSS classes
 * @param endIcon - The icon to display at the end of the input
 * @param startIcon - The icon to display at the start of the input
 * @param disabled - Whether the input is disabled
 * @param errors - Form validation errors object
 * @param register - React Hook Form register function
 * @param label - Label text for the input
 * @param isRequired - Whether the field is required
 * @param inlineLabel - Whether to display label inline
 * @param labelClassName - Additional classes for label
 * @param readOnly - Whether the input is read-only
 * @param onClick - Click handler function
 * @param onKeyPress - Key press handler function
 * @param onKeyDown - Key down handler function
 * @param customRef - Custom ref for the input
 * @param onBlur - Blur handler function
 * @param onFocus - Focus handler function
 * @param size - Size variant (sm, md, lg)
 * @param variant - Visual variant (default, bordered, minimal)
 * @param helperText - Helper text displayed below the input
 * @returns A custom input component
 */

export default function CustomInput({
  type = "text",
  placeholder = "",
  name,
  onChange = null,
  defaultValue = null,
  value = null,
  className = "",
  endIcon = null,
  startIcon = null,
  disabled = false,
  errors = null,
  register = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  onClick = null,
  onKeyPress = null,
  onKeyDown = null,
  customRef = null,
  onBlur = null,
  onFocus = null,
  size = "md",
  variant = "default",
  helperText = null,
}) {
  const { inputChangeHandler, showPassword, togglePasswordVisibility } =
    useCustomInput(onChange, type);

  // Get error state
  const hasError = errors && errors[name];
  const errorMessage = hasError ? errors[name].message : null;

  // Get input classes based on glassmorphism theme
  const getInputClasses = () => {
    const baseClasses =
      "w-full bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200";

    // Size classes
    const sizeClasses = {
      sm: "text-sm py-2 px-3 h-9",
      md: "text-sm py-2.5 px-4 h-11", // default
      lg: "text-base py-3 px-4 h-12",
    };

    // Variant classes
    const variantClasses = {
      default: "",
      bordered: "border-2 border-white/30",
      minimal:
        "border-0 border-b-2 border-white/20 rounded-none bg-transparent",
    };

    // State classes
    const stateClasses = hasError
      ? "border-red-400 focus:border-red-400"
      : "focus:border-purple-400";
    const disabledClasses = disabled
      ? "opacity-60 cursor-not-allowed bg-white/10"
      : "";
    const readOnlyClasses = readOnly ? "bg-white/10 cursor-default" : "";

    return `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant]} ${stateClasses} ${disabledClasses} ${readOnlyClasses} ${className}`.trim();
  };

  // Container classes
  const containerClasses = inlineLabel
    ? "grid w-full grid-cols-[130px_1fr] items-center gap-4"
    : "w-full";

  // Get padding based on icons and size
  const getPaddingClasses = () => {
    const sizeMap = {
      sm: { start: "pl-9", end: "pr-9", both: "px-3" },
      md: { start: "pl-9", end: "pr-10", both: "px-4" },
      lg: { start: "pl-10", end: "pr-10", both: "px-4" },
    };

    const sizePadding = sizeMap[size] || sizeMap.md;

    if (startIcon && (endIcon || type === "password"))
      return `${sizePadding.start} ${sizePadding.end}`;
    if (startIcon) return `${sizePadding.start} pr-4`;
    if (endIcon || type === "password") return `${sizePadding.end} pl-4`;
    return sizePadding.both;
  };

  return (
    <div className={containerClasses}>
      {label && (
        <div className="w-full flex justify-between items-center mb-1">
          <FieldLabel
            label={label}
            isRequired={isRequired}
            className={`${inlineLabel ? "mt-0" : ""} ${labelClassName}`}
          />

          {/* Helper text */}
          {helperText && (
            <p className="min-w-24 text-xs text-purple-300 font-normal leading-[15px] whitespace-nowrap truncate">
              {helperText}
            </p>
          )}
        </div>
      )}

      <div className="relative w-full">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-purple-400">{startIcon}</div>
          </div>
        )}

        {/* Input Field */}
        <input
          {...(register &&
            register(name, {
              required: isRequired
                ? `${label || "This field"} is required`
                : false,
            }))}
          {...(onClick && { onClick })}
          {...(onKeyPress && { onKeyPress })}
          {...(onKeyDown && { onKeyDown })}
          name={name}
          onFocus={onFocus}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className={`${getInputClasses()} ${getPaddingClasses()}`}
          {...(defaultValue !== null &&
            defaultValue !== undefined && { defaultValue })}
          {...(value !== null && value !== undefined && { value })}
          {...(customRef && { ref: customRef })}
          disabled={disabled}
          {...(onChange && { onChange: inputChangeHandler })}
          readOnly={readOnly}
          {...(onBlur && { onBlur })}
        />

        {/* End Icon or Password Toggle */}
        {(endIcon || type === "password") && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === "password" ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-purple-400 hover:text-purple-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="text-purple-400">{endIcon}</div>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-1">
            <FieldError className="normal-case" error={errorMessage} />
          </div>
        )}
      </div>
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  register: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  customRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["default", "bordered", "minimal"]),
  helperText: PropTypes.string,
};

// Export size and variant constants for easy usage
export const INPUT_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};

export const INPUT_VARIANTS = {
  DEFAULT: "default",
  BORDERED: "bordered",
  MINIMAL: "minimal",
};

export const INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  DATE: "date",
  TIME: "time",
  DATETIME_LOCAL: "datetime-local",
  TEL: "tel",
  URL: "url",
  SEARCH: "search",
};
