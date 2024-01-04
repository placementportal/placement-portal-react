const SelectInput = ({ label, name, options, id, changeFn }) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered"
        id={id}
        onChange={changeFn}
        name={name}
      >
        {options.map((option) => {
          const { text, value } = option;
          return (
            <option key={value} value={value} className="capitalize">
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default SelectInput;
