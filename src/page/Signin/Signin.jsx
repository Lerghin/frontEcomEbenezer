import  { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../utils/axios';
import '../Signin/signin.css';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

import { login } from '../../Store/Actions/authActions';
import { LS } from '../../Utils/LS';



const Signin = () => {
  const navigate = useNavigate();
  const inputEmail = useRef();
  const inputPass = useRef();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = LS.getText('token');
    const role = LS.getText('role');
    console.log("Retrieved token: ", token);
    console.log("Retrieved role: ", role);
  
    if (token && role) {
      dispatch(login({ token, role }));
      navigate('/comprar');
    } else if (token) {
      console.warn('Token is available, but role is not set in local storage');
      // Navigate to a fallback or handle accordingly
      navigate('/home');
    }
  }, [dispatch, navigate]);
  

  const handleSubmit = async () => {
    
    const userData = {
      email: inputEmail.current.value,
      password: inputPass.current.value,
    };
    try {
    const res = await API.post('/auth/in', userData);
    const { userData: { _id } } = res.data;
    console.log(res.data);
    dispatch(login(res.data));
     
    if (res.status === 200) {
      alert('Te has logueado Satisfactoriamente');
     
      const { token } = res.data;
      console.log(res.data);
      LS.set('token', token);
      const { userData: { _id } } = res.data; // Extrae role y userId del usuario registrado

  
      LS.set('userID', _id);
   
     
      navigate('/homeAdmin',  { state: { userId: _id } });
    
    }  } catch (error) {
      alert("usuario o contraseña invalida");
      console.error(error);
    }

  };
 

  const handleGoogleLogin = async (response) => {
    console.log(response);
    const infoUser = jwtDecode(response.credential);
    console.log(infoUser);

    console.log(infoUser.email);
    setData({
      email: infoUser.email,
      password: 'Alicia.0609',
    });

    const userData = {
      email: infoUser.email,
      password: 'Alicia.0609',
    };

    const res = await API.post('/auth/in', userData);
    console.log(res);
    dispatch(login(res.data));
 
    if (res.status === 200) {
      alert('You are logged in successfully');
      navigate('/comprar');
      const { token } = res.data;
      LS.set('token', token);

      navigate('/comprar');

    }
  };



  return (
    <div className="signin-container">
      <h2>Ingresar</h2>
      <div className="signin-form">
        <input
          className="signin-button"
          type="email"
          name="email"
          placeholder="Email"
          ref={inputEmail}
        />
        <input
          className="signin-button"
          type="password"
          name="password"
          placeholder="Password"
          ref={inputPass}
        />
        <button className="signin-button" onClick={handleSubmit}>
          Ingresar
        </button>
        <p>
          No tienes cuenta? <Link to="/signup">Registrate</Link>
        </p>
      </div>

      <div className="google">
        <GoogleLogin
          clientId="302009379903-lvfvam4poqchau007anb4eqh2oshuoig.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={handleGoogleLogin}
          onFailure={(error) => {
            console.log('Login Failed:', error);
          }}
          useOneTap
        />
      </div>
    </div>
  );
};


export default Signin;