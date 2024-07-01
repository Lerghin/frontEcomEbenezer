
import axios from 'axios';
import { LS } from './LS';
//import { logoutUser } from '../store/Actions/authActions';

import store from '../store/store';
import { logoutUser } from '../store/actions/authActions.js';


const API = axios.create({
  
 // baseURL:'http://localhost:4000/api',
  baseURL:'https://ecomerceebenezerback.onrender.com/api',
});

API.interceptors.request.use(config => {
  const token = LS.getText('token');


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

 

  return config;
}, error => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401|| error.response && error.response.status===403) {
      store.dispatch(logoutUser());
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { API };
