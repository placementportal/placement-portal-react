import { Form, redirect } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

import { FormInput } from '../Components';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await customFetch.post('/auth/login', data);
    console.log(response);
    toast.success('Login successful!');

    const { role } = response.data;
    if (role == 'student') return redirect('/student-dashboard');

    if (role == 'admin') return redirect('/admin-dashboard');

    if (role == 'company_admin') return redirect('/company-dashboard');
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.error?.message ||
      'please double check your credentials';
    toast.error(errorMessage);
    return null;
  }
};

const Login = () => {
  return (
    <section className="h-screen grid place-items-center bg-gray-100">
      <Form
        method="POST"
        className="card w-96 p-8 bg-slate-600 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className='text-center text-white font-bold text-3xl'>Login</h4>
        <FormInput type="email" name="email" label="email" />
        <FormInput type="password" name="password" label="password" />
        <button type="submit" className='btn btn-success'>Login</button>
      </Form>
    </section>
  );
};
export default Login;
