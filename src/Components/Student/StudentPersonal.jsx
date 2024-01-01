import { useLoaderData } from 'react-router-dom';

const StudentPersonal = () => {
  const { student } = useLoaderData().personal;
  const { name, email, personal_details } = student;
  const { fatherName, motherName, contactNumber, address, district, state } =
    personal_details;

  return (
    <section id="personal" className="p-8 border shadow">
      <h3 className="text-center text-2xl font-medium mb-4">Personal Details</h3>
      <div className='flex flex-col gap-y-4'>
        <div>
          <p>Name: {name}</p>
          <p>Father Name Name: {fatherName}</p>
          <p>Mother Name: {motherName}</p>
        </div>
        <div>
          <p>Address: {address}</p>
          <p>District: {district}</p>
          <p>State: {state}</p>
        </div>
        <div>
          <p>Email: {email}</p>
          <p>Contact Number: {contactNumber}</p>
        </div>
      </div>
    </section>
  );
};
export default StudentPersonal;
