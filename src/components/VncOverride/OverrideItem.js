import React from "react";
import Checkbox from "components/Form/Checkbox";

export function OverrideCheckbox({ name, data, onChange }) {
  return (
    <div>
      <Checkbox name={name} value={data[name]} onChange={onChange} />
      <label>Override</label>
    </div>
  );
}
