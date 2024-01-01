const FileInput = ({ name, label, accept }) => {
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
      />
    </div>
  );
};
export default FileInput;
