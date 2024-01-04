import { Form } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { FileInput, FormInput, Textarea } from '../';

const JobApplicationForm = () => {
  const jobApply = useSelector((state) => state?.jobState?.jobApply);
  const profile = jobApply?.profile || '';
  const company = jobApply?.company || '';

  return (
    <dialog id="jobApplicationModal" className="modal">
      <div className="modal-box pb-0">
        <h3 className="font-bold text-lg underline">Job Application Form</h3>
        <div className="mt-4 font-medium text-lg flex justify-between">
          <span>{profile}</span>
          <span>{company}</span>
        </div>
        <Form
          method="POST"
          encType="multipart/form-data"
          className="mt-2 flex flex-col gap-4"
        >
          <FormInput label="Portfolio Link" name="portfolio" type="url" />
          <Textarea
            label="Cover Letter"
            name="coverLetter"
            placeholder="You want to apply for this job because..."
          />
          <FileInput
            label="Resume"
            name="resumeFile"
            accept="application/pdf"
          />
          <button
            type="submit"
            className="btn btn-success self-center btn-sm h-9 px-4"
            name="intent"
            value="jobApplyAction"
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
