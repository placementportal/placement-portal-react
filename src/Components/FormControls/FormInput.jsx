const FormInput = ({
  label,
  name,
  type,
  defaultValue,
  size,
  labelColor = 'black',
}) => {
  const labelClass = 'label-text capitalize ' + 'text-' + labelColor;

  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className={labelClass}>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={`input input-bordered ${size}`}
        required
      />
    </div>
  );
};
export default FormInput;
