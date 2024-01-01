const SelectInput = ({ label, options, value, id, changeFn }) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered"
        value={value}
        id={id}
        onChange={changeFn}
      >
        {options.map((option) => {
          return (
            <option key={option} value={option} className="capitalize">
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default SelectInput;
