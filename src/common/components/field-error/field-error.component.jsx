import PropTypes from "prop-types";

export default function FieldError({ className = "", error = "" }) {
  return <p className={`text-xs text-red-400 ${className}`}>{error}</p>;
}

FieldError.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
};
