const CheckboxInput = ({ label, name, options, emptyMsg }) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <div className="flex gap-x-4">
        {options.length
          ? options.map((option) => {
              const { text, value } = option;
              return (
                <label key={value} className="label justify-normal gap-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={value}
                    name={name}
                    className="checkbox"
                  />
                  <span className="label-text">{text}</span>
                </label>
              );
            })
          : <p className="ml-4 font-light text-sm">{emptyMsg}</p>}
      </div>
    </div>
  );
};
export default CheckboxInput;
