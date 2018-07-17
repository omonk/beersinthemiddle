import React from 'react';

const Input = (props) => {
  const {
    updateLocationValue,
    name,
    value,
    id,
  } = props;
  return (
    <input onChange={updateLocationValue(id)} name={name} defaultValue={value} />
  );
};

export default Input;
