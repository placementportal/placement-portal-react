const MultipleInputs = ({ label, name, type, labelColor = 'black' }) => {
  const labelClass = 'label-text capitalize ' + 'text-' + labelColor;

  function addInput() {
    const container = document.getElementById('skillsContainer');

    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', type);
    inputElement.setAttribute('name', `${name}`);
    inputElement.classList.add('input', 'input-bordered', 'w-2/5');
    inputElement.required = true;

    container.appendChild(inputElement);
  }

  return (
    <div className="form-control">
      <div className="flex justify-between">
        <label htmlFor={name} className="label text-lg">
          <span className={labelClass}>{label}</span>
        </label>
        <button type="button" className="btn btn-xs" onClick={addInput}>
          + Add Field
        </button>
      </div>
      <div id="skillsContainer" className="flex gap-4 flex-wrap">
        <input
          type={type}
          name={`${name}`}
          className={`input input-bordered w-2/5`}
          required
        />
      </div>
    </div>
  );
};
export default MultipleInputs;
