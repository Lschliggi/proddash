import React from 'react';
import "./styles.css";


const CheckBox = ({ checked, onChange }) => {
  return (
    <label className="checkboxlabel">
      <input type="checkbox" className="checkbox" checked={checked} onChange={onChange} />
      Keep data updated
    </label>
  );
};


export default CheckBox;