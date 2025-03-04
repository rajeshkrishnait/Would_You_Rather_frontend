import React, { useState } from "react";
import "../styles/TextField.css";

const TextField = ({ label, props }) => {
  const [hasValue, setHasValue] = useState(!!props?.defaultValue); // Initialize with existing value if any

  return (
    <div className="App">
      <div className="input-field">
        <input
          id="_name"
          className="field"
          {...props}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props?.onChange?.(e); // Preserve existing onChange if provided
          }}
        />
        <label htmlFor="_name" className={hasValue ? "label-up" : ""}>
          {label}
        </label>
        <div className="field-focus" />
      </div>
    </div>
  );
};

export default TextField;
