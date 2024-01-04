const DateInput = ({
  label,
  name,
  defaultValue,
  size,
  minDate,
  labelColor = 'black',
}) => {
  const labelClass = 'label-text capitalize ' + 'text-' + labelColor;

  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className={labelClass}>{label}</span>
      </label>
      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        className={`input input-bordered ${size}`}
        min={minDate}
        required
      />
    </div>
  );
};
export default DateInput;
