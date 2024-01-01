import { Form } from 'react-router-dom';
import { FileInput, FormInput } from '../';

const JobApplicationForm = () => {
  return (
    <dialog id="jobApplicationModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Job Application Form</h3>
        <Form
          method="POST"
          encType="multipart/form-data"
          className="mt-2 flex flex-col gap-4"
        >
          <FormInput label="Portfolio Link" name="portfolio" type="url" />
          <FormInput label="Cover Letter" name="coverLetter" type="text" />
          <FileInput
            label="Resume"
            name="resumeFile"
            accept="application/pdf"
          />
          <button
            type="submit"
            className="btn btn-success self-center btn-sm h-9 px-4"
          >
            Apply
          </button>
        </Form>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
export default JobApplicationForm;
