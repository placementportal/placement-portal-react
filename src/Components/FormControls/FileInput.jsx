const FileInput = ({ name, label, accept, isRequired = false }) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text text-black capitalize">{label}</span>
      </label>
      <input
        type="file"
        name={name}
        className="file-input file-input-bordered file-input-sm w-full max-w-xs"
        accept={accept}
        required={isRequired}
      />
    </div>
  );
};
export default FileInput;
