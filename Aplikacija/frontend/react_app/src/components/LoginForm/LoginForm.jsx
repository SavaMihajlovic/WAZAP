import React, { useState } from 'react'
import './LoginForm.css'
import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'


const LoginForm = () => {

  const [action,setAction] = useState("Sign Up");
  
  return (
    <div className="login-container">
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src={email_icon} alt=''/>
                <input type='email' placeholder='Email'/>
            </div>
            <div className="input">
                <img src={password_icon} alt=''/>
                <input type='password' placeholder='Password'/>
            </div>
        </div>
        <div className="forgot-password">Lost password? <span>Send via email!</span> </div>
        <div className="submit-container">
            <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
    </div>
  )
}

export default LoginForm;