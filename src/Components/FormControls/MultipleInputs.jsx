const MultipleInputs = ({
  label,
  name,
  type,
  defaultValue,
  manageFields,
  labelColor = 'black',
}) => {
  const labelClass = 'label-text capitalize ' + 'text-' + labelColor;

  return (
    <div className="form-control">
      <div className="flex justify-between">
        <label htmlFor={name} className="label text-lg">
          <span className={labelClass}>{label}</span>
        </label>
        <button
          type="button"
          className="btn btn-xs"
          onClick={() => {
            manageFields([...defaultValue, '']);
          }}
        >
          + Add Field
        </button>
      </div>
      <div id={`${name}Container`} className="flex gap-4 flex-wrap">
        {defaultValue.map((value, idx) => {
          return (
            <input
              type={type}
              name={`${name}`}
              defaultValue={value}
              className={`input input-bordered w-2/5`}
              key={value + idx}
              required
            />
          );
        })}
      </div>
    </div>
  );
};
export default MultipleInputs;
