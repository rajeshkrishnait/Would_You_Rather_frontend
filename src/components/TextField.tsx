import React, { useState } from "react";
import "../styles/TextField.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, ...props }, ref) => {
    const [hasValue, setHasValue] = useState(!!props.defaultValue);

    return (
      <div className="App">
        <div className="input-field">
          <input
            id={label}
            className="field"
            ref={ref}
            {...props}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
          />
          <label htmlFor={label} className={hasValue ? "label-up" : ""}>
            {label}
          </label>
          <div className="field-focus" />
        </div>
      </div>
    );
  }
);

TextField.displayName = "TextField"; // Required for debugging with React DevTools

export default TextField;
