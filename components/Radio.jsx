import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";

const Radio = ({ name, value, callback }) => {
  const key = useRef(uuidv4());
  return (
    <div>
      <input type="radio" id={key} name={name} value={value} onChange={callback} required />
      <label htmlFor={key}> {value}</label>
    </div>
  );
};

export default Radio;
