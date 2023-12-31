const NumberInput = ({
  label,
  name,
  defaultValue,
  size,
  minValue,
  labelColor = 'black',
}) => {
  const labelClass = 'label-text capitalize ' + 'text-' + labelColor;

  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className={labelClass}>{label}</span>
      </label>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        className={`input input-bordered ${size}`}
        min={minValue}
        required
      />
    </div>
  );
};
export default NumberInput;
