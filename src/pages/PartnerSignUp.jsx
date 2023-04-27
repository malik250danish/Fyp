import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import login from '../assets/img/login.svg'
import logoBlue from '../assets/img/logoBlue.svg'
import eyeBlue from '../assets/icons/eyeBlue.svg'
import {signUpPartner} from '../api/CommonApi'

const PartnerLogin = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState(true)
    const [msg, setMsg] = useState("")
    const [ userData , setUserData ] = useState({
        username : "",
        email : "",
        password : ""
    })

    const SignMeUp = async () => {
        if(userData?.username == "" || userData?.email == "" || userData?.password == ""){
            setMsg("Please fill all Required Fields")
        }else{
            const {data} = await signUpPartner(userData);
            setMsg(data?.message)
            if(data?.success === true){
                //setMsg("")
                navigate("/partner/login")
            }else{
                //setMsg(data?.message)
            }
            console.log("response : ", data)
        }
    }

    return (
        <div className='container-fluid partner-login-container'>
            <div className="row h-100">

                <div className="col-md-6 login-left h-100">
                    <div className="col-lg-6 col-sm-8 col-11 m-auto login-form">
                        <div className="login-logo w-100 d-flex align-items-center justify-content-center">
                            <img src={logoBlue} alt="" />
                        </div>
                        <h4 className='partner-login-title'>Partner App</h4>
                        <h2 className='login-heading'>Sign Up</h2>
                        <div className="login-input-container mb-4 w-100">
                            <label>User Name</label>
                            <input type="text" placeholder='Your Name Please' value={userData?.username} onChange={(e) => setUserData({...userData , username : e.target.value})} />
                        </div>
                        <div className="login-input-container mb-4 w-100">
                            <label>E-mail</label>
                            <input type="email" placeholder='Your email please' value={userData?.email} onChange={(e) => setUserData({...userData , email : e.target.value})} />
                        </div>
                        <div className="login-input-container mb-4 w-100">
                            <label>Password</label>
                            <div className="login-password">
                                <input type={password ? 'password' : 'text'} placeholder='Enter Password please ' value={userData?.password} onChange={(e) => setUserData({...userData , password : e.target.value})} />
                                <img onClick={() => setPassword(!password)} src={eyeBlue} alt="" />
                            </div>
                        </div>
                        {/* <Link className='d-block w-100 text-center fw-bold text-color-primary mb-4' to={'/partner/forgotPassword'}>Forgot password?</Link> */}
                        {
                            <p style={{color : "crimson"}} >{msg}</p>
                        }
                        <Link className='login-btn text-light bg-color-primary partner-login-btn' to={''}  onClick={SignMeUp} >Sign Up</Link>
                        <div className='fw-bold mt-4 text-center'>
                            Already have an account?
                            <Link className='text-color-primary' to={'/partner/login'}>Login</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 p-0 login-right h-100">
                    <img src={login} className='login-img' alt="" />
                </div>

            </div>
        </div>
    )
}

export default PartnerLogin