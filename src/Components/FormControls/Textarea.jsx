const Textarea = ({ label, name, placeholder, labelColor = 'black' }) => {
  const labelClass = 'label-text capitalize ' + 'text-' + labelColor;
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className={labelClass}>{label}</span>
      </label>
      <textarea
        className="textarea textarea-lg textarea-bordered p-2"
        placeholder={placeholder}
        name={name}
      ></textarea>
    </div>
  );
};
export default Textarea;
