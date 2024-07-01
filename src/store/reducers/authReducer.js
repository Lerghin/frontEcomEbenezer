import { createReducer } from "@reduxjs/toolkit";
import { login, signup, authenticate, logout } from './../actions/authActions';
const initialState = {
 
    user:{},
    token:null,
    status: "offline"
   
  };

  const authReducer = createReducer(initialState,
(builder) => builder
.addCase(login,  (state,action)=>{
const newState= {...state, ...action.payload}
return newState
})

.addCase(signup,  (state,action)=>{
    const newState= {...state, ...action.payload}
 return newState
})
.addCase(authenticate.fulfilled,  (state,action)=>{
    const newState= {...state, ...action.payload}
    console.log(data);
    console.log(reducerData)
 return newState
})
.addCase(logout, (state) => {
  state.user = {};
  state.token = null;
  state.status = "offline";
})

  )

  export default authReducer
  

