import React from "react";

export default function Select({
  id,
  name,
  value,
  onChange,
  className = "w-180 h-32",
  style = {},
  options = [],
  disabled = false,
}) {
  return (
    <select
      className={className}
      style={style}
      id={id}
      name={name}
      onChange={onChange}
      disabled={disabled}
      value={value}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
