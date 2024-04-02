import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom"; // Assuming Navigate is imported from react-router-dom
import RegisterImg from "./assets/13082.jpg";
import Nav from "./nav";
import { BASE_URL } from './api';





const Register = () => {
  
  const [data, setData] = useState({
      first_name: '',
      last_name: '',
      login: '',
      password: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const changeHandler = e => {
      setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
      // Add validation logic for each field
      if (!data.first_name || !data.last_name || !data.login || !data.password) {
          toast.error('All fields are required.');
          return false;
      }

      if (!/^[a-zA-Z]+$/.test(data.first_name) || !/^[a-zA-Z]+$/.test(data.last_name)) {
          toast.error('First name and last name should only contain letters.');
          return false;
      }

      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(data.login)) {
          toast.error('Email is not valid. Please include an "@" in the email address.');
          return false;
      }

      if (!data.password.match(/^\d+$/)) {
          toast.error('Password should only contain numbers.');
          return false;
      }

      return true;
  };

  const submitHandler = e => {
      e.preventDefault();
      setFormSubmitted(true);

      if (!validateForm()) {
          return;
      }

      axios.post(`${BASE_URL}/register`, data)
      .then(res => {
          if (res.data && res.data.status_code === 200) {
              toast.success('Registration Successful!', {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 300
              });
              console.log(res);
              setRegistrationSuccess(true);
          } else if (res.data && res.data.status_code === 400 && res.data.message === 'User Already Exists.') {
              toast.error('User already exists. Please use a different email.');
          } else {
              toast.error('Registration Failed. Please try again.');
          }
      })
      .catch(error => {
          toast.error('Registration Failed. Please try again.');
          console.error(error);
      });
  };

  if (registrationSuccess) {
      return <Navigate to='/login' />;
  }

  return (
    <>
      <Nav></Nav>
      <br />
      <br />
      <br />
      <div className="container ">
        <div className="row justify-content-center">
          <div className="row">
            <div className="col-md-6 col-lg-6 text-center mb-3">
              <img
                src={RegisterImg}
                alt="Foo eating a sandwich."
                className="img-fluid ui"
              />
            </div>
            <div className="col-md-5 col-lg-5">
              <br />
             <br/>
             <br/>
              <form
                onSubmit={submitHandler}
                className="container mt-1 mb-3"
                noValidate
              >
                <h3 className="text-center mb-2 rounded text-dark">Register</h3>
                <div className="mb-3">
                  <label htmlFor="text" className="form-label">
                    First Name<span className="errmsg">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={changeHandler}
                    // onBlur={() => handleBlur('first_name')}
                    name="first_name"
                    placeholder="Enter your first name"
                    id="first_name"
                    className={`form-control custom-border ${
                      formSubmitted && !data.first_name && "border-red"
                    }`}
                  />
                  {formSubmitted && !data.first_name && (
                    <span className="error-message">
                      <b>First Name is required</b>
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="text" className="form-label">
                    Last Name<span className="errmsg">*</span>
                  </label>

                  <input
                    type="text"
                    onChange={changeHandler}
                    // onBlur={() => handleBlur('last_name')}
                    name="last_name"
                    placeholder="Enter your last name"
                    id="last_name"
                    className={`form-control custom-border ${
                      formSubmitted && !data.last_name && "border-red"
                    }`}
                  />
                  {formSubmitted && !data.last_name && (
                    <span className="error-message">
                      {" "}
                      <b>Last Name is required</b>
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">
                    Email<span className="errmsg">*</span>
                  </label>
                  <input
                    type="email"
                    onChange={changeHandler}
                    //onBlur={() => handleBlur('login')}
                    name="login"
                    placeholder="Enter Email"
                    id="login"
                    className={`form-control custom-border ${
                      formSubmitted && !data.login && "border-red"
                    }`}
                  />
                  {formSubmitted && !data.login && (
                    <span className="error-message text-red">
                      {" "}
                      <b>Email is required</b>
                    </span>
                  )}
                  {formSubmitted &&
  data.login &&
  !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(data.login) && (
    <span className="error-message text-red">
      <b>
        Email is not valid. Please include an '@' in the email address.
      </b>
    </span>
  )}

                </div>
                <div className="mb-2">
                  <label htmlFor="password" className="form-label">
                    Password<span className="errmsg">*</span>
                  </label>
                  <input
                    type="password"
                    onChange={changeHandler}
                    // onBlur={() => handleBlur('password')}
                    name="password"
                    placeholder="Enter Password"
                    id="password"
                    className={`form-control custom-border ${
                      formSubmitted && !data.password && "border-red"
                    }`}
                  />
                  {formSubmitted && !data.password && (
                    <span className="error-message">
                      {" "}
                      <b>password is required</b>
                    </span>
                  )}
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="checkbox"
                  />
                  <label htmlFor="checkbox" className="form-check-label">
                    Remember Me
                  </label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-dark rounded-pill">
                    R E G I S T E R
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
