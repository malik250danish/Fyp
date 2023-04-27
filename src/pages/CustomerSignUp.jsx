import React, { useState } from 'react'
import Header from '../components/Header'
import login from '../assets/img/login.svg'
import eye from '../assets/icons/eye.svg'
import twitter from '../assets/icons/twitter.svg'
import google from '../assets/icons/google.svg'
import email from '../assets/icons/email.svg'
import { Link } from 'react-router-dom'
import { LogInUserWithGoogle } from '../redux/actions/UserActions'
import {useSelector, useDispatch} from 'react-redux'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
// import { GoogleLogin } from 'react-google-login';
import {auth,provider} from "../firebase"
import {signInWithPopup} from "firebase/auth"
import {signUpCustomer} from "../api/CommonApi"

const Login = ({socket}) => {
    const [password, setPassword] = useState(true)
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isSignInFetching , isSignInError , isSignInErrorMsg , userDetails ,  userSignInSuccess } = useSelector(state => state.usersReducer)

    const [ userData , setUserData ] = useState({
        email : "",
        username : "",
        password : ""
    })

    // logging in
    const SignUpNow = async () => {
        if(userData?.email == "" || userData?.password == "" || userData?.username == ""){
            toast.warning("Email, Username and Password are Required")
        }else{
            const {data} = await signUpCustomer(userData);
            console.log("data of respnonse : ", data)
            if(data?.success === true){
                toast.success(data?.message)
                navigate('/login')
            }else{
                toast.error(data?.message)
            }
        }
    }

    // mocking google sign in popup
    const handleClick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            dispatch(LogInUserWithGoogle({email : data?.user?.email , username : data?.user?.displayName} , dispatch))

        })
    }

  return (
    <div className='login-page'>
        
        <Header socket={socket}  />

        <div className="container-fluid login-container">
            <div className="row h-100">
                <div className="col-md-6 login-left h-100">
                        <h1 className='login-title text-center'>Welcome to 5 Chef’s</h1>
                    <div className="col-lg-6 col-sm-8 col-11 m-auto login-form">
                        <p className='mt-4 login-create'>
                            If you have an account, you can <Link className='text-color-primary text-decoration-underline' to={'/login'}>Login Now</Link>
                        </p>
                        <div className="login-input mb-3">
                            <input type="email" placeholder='E-mail' value={userData?.email} onChange={(e) => setUserData({...userData , email : e.target.value})} />
                        </div>
                        <div className="login-input mb-3">
                            <input type="text" placeholder='User Name' value={userData?.username} onChange={(e) => setUserData({...userData , username : e.target.value})} />
                        </div>
                        <div className="login-input mb-2">
                            <input type={password ? 'password' : 'text'} placeholder='Password' value={userData?.password} onChange={(e) => setUserData({...userData , password : e.target.value})} />
                            <img className='ms-2' src={eye} alt="" onClick={() => setPassword(!password)} />
                        </div>
                        {
                            isSignInFetching === true ? (
                                <h4>Please wait</h4>
                            ) : (
                                <>
                                    {/* <Link className='text-light text-decoration-underline d-block mb-4' to={'/forgotPassword'}>Forgot password?</Link> */}
                                    <Link className='login-btn text-light bg-color-primary hover-blue' onClick={SignUpNow}  >Sign Up</Link>
                                    {
                                        isSignInError === true && (
                                            <h6 style={{color : 'crimson', textAlign: "center" , marginTop : "15px"}} >{isSignInErrorMsg}</h6>
                                        )
                                    }
                                    <p className='w-100 text-center my-4'>Or</p>
                                    {/* <Link className='login-btn bg-white text-dark mb-3' to={'#'}>
                                        <img className='me-3' src={twitter} alt="" />
                                        Continue with Twitter
                                    </Link> */}
                                    <Link className='login-btn bg-white text-dark mb-3' to={'#'} onClick={handleClick} >
                                        <img className='me-3' src={google} alt="" />
                                        Continue with Google
                                    </Link>
                                    <Link className='login-btn bg-white text-dark mb-3' to={'/login'}>
                                        <img className='me-3' src={email} alt="" />
                                        Continue with Email
                                    </Link>
                                    {/* <Link className='text-center w-100 d-block mt-4 text-light' to={'/'}>Login later</Link> */}
                                </>
                            )
                        }
                    </div>
                </div>
                <div className="col-md-6 login-right h-100 p-0">
                    <img src={login} className='login-img' alt="" />
                </div>
            </div>
        </div>

    </div>
  )
}

export default Login