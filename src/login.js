import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginImg from "./assets/sl_031623_56570_43.jpg";
import { BASE_URL } from './api';



const Login = () => {
  

  const navigate = useNavigate();
  const [data, setData] = useState({
    login: '',
    password: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleBlur = (fieldName) => {
    if (fieldName === 'login') {
      if (data.login === "") {
        document.getElementById('login').classList.add('border-red');
        setEmailError('Please enter email');
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(data.login)) {
        document.getElementById('login').classList.add('border-red');
        setEmailError('Not a valid email format');
      } else {
        document.getElementById('login').classList.remove('border-red');
        setEmailError('');
      }
    }

    if (fieldName === 'password') {
      if (data.password === "") {
        document.getElementById('password').classList.add('border-red');
      } else {
        document.getElementById('password').classList.remove('border-red');
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    try {
      if (data.login === "" || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(data.login)) {
        document.getElementById('login').classList.add('border-red');
        if (data.login === "") {
          setEmailError('Please enter email');
        } else {
          setEmailError('Enter valid email ');
        }
       // toast.error('Invalid Email');
        return;
      }

      if (data.password === "") {
        document.getElementById('password').classList.add('border-red');
       // toast.error('Password is required');
        return;
      }

      const response = await axios.post(`${BASE_URL}/login`, data);

      if (response && response.status === 200 && response.data.access_token) {
        const accessToken = response.data.access_token;
        localStorage.setItem("token", accessToken);
        toast.success('Login Successful!');
        setTimeout(() => {
          navigate('/home');
        }, 300);
      } else {
        document.getElementById('login').classList.add('border-red');
        document.getElementById('password').classList.add('border-red');
        toast.error('Invalid Credentials!');
      }
    } catch (error) {
      console.error('Error in API call:', error);
      toast.error('Error in API call');
    }
  };

  return (
    <>
      <div className='container'>
        <div className='row justify-content-center bottum'>
          <div className='col-md-12 col-lg-12'>
            <div className='card p-4 rounded-5 shadow-lg'>
              <div className='row'>
                <div className='col-md-5 mb-3'>
                  <img src={LoginImg} alt="yoga" className='img-fluid' />
                </div>
                <div className='col-md-6 col-lg-6'>
                  <div className="container mt-4 ">
                    <div className="tab-content">
                      <div id="home" className="container tab-pane active">
                        <br />
                        <form onSubmit={submitHandler} noValidate>
                          <h2 className='text-center mb-3 text-dark'>Admin Sign In</h2>
                          <div className='mb-3'>
                            <label htmlFor='email' className='form-label'>Email</label>
                            <input
                              type='email'
                              onChange={changeHandler}
                              onBlur={() => handleBlur('login')}
                              name="login"
                              id="login"
                              placeholder='Enter Email'
                              className={`form-control ${formSubmitted && emailError ? 'border-red' : ''}`}
                            />
                            {formSubmitted && emailError && (
                              <div className="text-danger">{emailError}</div>
                            )}
                          </div>

                          <div className='mb-3'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input
                              type='password'
                              onChange={changeHandler}
                              onBlur={() => handleBlur('password')}
                              name="password"
                              id="password"
                              placeholder='Enter Password'
                              className={`form-control ${formSubmitted && !data.password ? 'border-red' : ''}`}
                            />
                            {formSubmitted && !data.password && (
                              <div className="text-danger">Please enter Password </div>
                            )}
                          </div>
                          <div className='mb-3 form-check'>
                            <input type="checkbox" className='form-check-input' id='checkbox' />
                            <label htmlFor='checkbox' className='form-check-label'>Remember Me</label>
                          </div>
                          <div className='d-grid'>
                            <button type='submit' className='btn btn-dark rounded-pill'>
                              Sign In
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
//login
