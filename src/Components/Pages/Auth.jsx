import React, { useRef, useState } from "react";
import { Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { globalActions } from '../Store/globalSlice';
import { useDispatch } from "react-redux";

const Auth = () => {
  localStorage.clear();
  const dispatch = useDispatch();
  const [login, setLogin] = useState(false)
  const [sendingReq, setSendingReq] = useState(false);
  const [openalert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertMsg, setAlertMsg] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate()

  const AuthHandler = async (obj) => {
    try {
      setSendingReq(true);
      let response;
      if (login) {
        response = await axios.post(`https://mail-box-1-d23c1-default-rtdb.firebaseio.com/user.json`, obj);
        localStorage.setItem('userEmail', obj.email);
      }
      else {
        response = await axios.post(`https://mail-box-1-d23c1-default-rtdb.firebaseio.com/user.json`, obj);
          setLogin(true);
      }
      setSendingReq(false);
      setAlertSeverity('success');
      setAlertMsg(response.data.msg);
      localStorage.setItem('token', JSON.stringify(response.data.token));
      dispatch(globalActions.toggleAuth());
      localStorage.setItem('isLogin', true);
      if(login) navigate('/inbox')
    } catch (error) {
      console.log(error);
      setAlertSeverity('error');
      setSendingReq(false);
      console.log(error)
      setAlertMsg(error.response.data.msg);
    }
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 5000)
  }


  const formSubmitHandler = async (e) => {
    e.preventDefault();
    let Obj = {
      email: emailRef.current.value,
      password: passwordRef.current.value
      
    }
    passwordRef.current.value = emailRef.current.value = "";
    login ? AuthHandler(Obj) : AuthHandler(Obj)
  }


  return (
    <div className="mt-[50px] flex flex-col items-center p-8 " >
      <div className=" grid sm:grid-cols-2 sm:grid-rows-1 p-7 bg-gradient-to-r from-[#709ad4] to-[#87CEEB] ... ">
        <div className=" bg-white p-5 flex flex-col justify-evenly">

          {openalert && <Alert severity={alertSeverity}>{alertMsg}!</Alert>}

          <form className="  min-h-[400px] flex flex-col justify-evenly " action="" onSubmit={formSubmitHandler}>
            <p className="font-Indie text-4xl font-bold tracking-[4px]">{login ? 'Login' : 'SignUp'}</p>

            <div className="flex flex-col py-3">
              <label>Email :</label>
              <input ref={emailRef} className="text-center border-b-4 p-2 border-gray-400" type="email" ></input>
            </div>
            <div className="flex flex-col py-3">
              <label >Password</label>
              <input ref={passwordRef} className=" text-center border-b-4 p-2 border-gray-400" type="string" ></input>
            </div>

            {!sendingReq && <button className="bg-[#1F2937] rounded-md active:bg-[#586b86] duration-700 text-white text-2xl p-2 text-center" >{login ? 'login' : 'signUp '}</button>}
            {sendingReq && <button className="bg-[#1F2937] rounded-md active:bg-[#586b86] duration-700 text-white text-2xl p-2 text-center">sending Req</button>}

          </form>
          <div className="text-2xl p-2 text-center font-QuickSand " onClick={() => setLogin((state) => !state)}>
            <button >{login ? 'New User??' : 'Already a member??'}
              <p>Click Here</p></button>
          </div>
        </div>
        <div className=" hidden sm:block bg-white   ">
          <img className="object-cover max-h-[650px] w-full " src="https://media.istockphoto.com/id/545240218/vector/mail-box.jpg?s=612x612&w=0&k=20&c=B8iazd49L0ser8eVnkAJAHlNZqd11iYdPQg7PEUNRoY=" alt="" />

        </div>
      </div>
    </div>


  );
}

export default Auth







