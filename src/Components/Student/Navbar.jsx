import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { FaPowerOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { logoutUser } from '../../features/user/userSlice';
import { customFetch } from '../../utils';
import { options } from './options';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userState.user.name);
  const queryClient = useQueryClient();

  async function logout() {
    try {
      await customFetch.get('/auth/logout');
      toast.error('Logged out successfully!');
      dispatch(logoutUser());
      queryClient.clear();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="navbar bg-sky-100">
      <div className="navbar-start ml-4">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="jobs">Jobs</NavLink>
            </li>
            <li tabIndex={0}>
              <details>
                <summary>Details</summary>
                <ul className="p-2 z-10">
                  {options.map((option) => {
                    const { id, text, href } = option;
                    return (
                      <li key={id} className="hover:bg-emerald-100 capitalize">
                        <a href={href}>{text}</a>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
            <li>
              <a>Notices</a>
            </li>
            <li>
              <a>My Jobs</a>
            </li>
          </ul>
        </div>
        <p className="normal-case text-xl">Hello, {userName}</p>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="jobs">Jobs</NavLink>
          </li>
          <li tabIndex={0}>
            <details>
              <summary>Details</summary>
              <ul className="p-2 z-10">
                {options.map((option) => {
                  const { id, text, href } = option;
                  return (
                    <li key={id} className="hover:bg-emerald-100 capitalize">
                      <a href={href}>{text}</a>
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>
          <li>
            <a>Notices</a>
          </li>
          <li>
            <a>My Jobs</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="p-4 hover:text-red-500" onClick={logout}>
          <FaPowerOff />
        </button>
      </div>
    </div>
  );
};
export default Navbar;
