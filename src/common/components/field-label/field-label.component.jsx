import PropTypes from "prop-types";

export default function FieldLabel({
  label,
  isRequired = false,
  className = "",
}) {
  return (
    <label className={`text-xs font-medium text-purple-200 ${className}`}>
      {label} {isRequired ? <span className="ml-1 text-red-400">*</span> : null}
    </label>
  );
}

FieldLabel.propTypes = {
  label: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
};
