import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { LS } from "../../utils/LS";




export const login = createAction('login', (credentials) => {
    console.log("Dispatching login with credentials: ", credentials);
  
    const reducerData = {
      user: credentials.userData || {},
      token: credentials.token || '',
      status: "online"
    };
  
    LS.set('token', credentials.token);
    if (credentials.userData && credentials.userData.role) {
      LS.set('role', credentials.userData.role);
    }
  
    return {
      payload: reducerData
    };
  });
  
export const signup= createAction ('signup',(credentials)=>{
    const reducerData={
        user: credentials.userData,
        token: credentials.token,
        status: "online"
      
    }
    LS.set('token', credentials.token)
  
return {

    payload: reducerData
}

})

export const authenticate= createAsyncThunk ('authenticate',async()=>{
  const token= LS.getText('token')
  const role= LS.getText('role')
  console.log(token)
  const {data} = await server.get('/auth/token', {
        headers: {
            Authotization: "Bearer"+ token

        }

    })
    const reducerData={
        user: data.userData,
    
        status: "online"
    }

    
    return reducerData
})




export const logout = createAction('logout');

export const logoutUser = () => {
  return (dispatch) => {
  
    LS.rm('token');
    LS.rm('role');


    dispatch(logout());
  };
};