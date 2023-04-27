import React, { useState } from 'react'
import Header from '../components/CustomerHeader'
import login from '../assets/img/login.svg'
import eye from '../assets/icons/eye.svg'
import twitter from '../assets/icons/twitter.svg'
import google from '../assets/icons/google.svg'
import email from '../assets/icons/email.svg'
import { Link , useLocation, useParams } from 'react-router-dom'
import {LogInUser , LogOutUser , LogInUserWithGoogle } from '../redux/actions/UserActions'
import {useSelector, useDispatch} from 'react-redux'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import {auth,provider} from "../firebase"
import {signInWithPopup} from "firebase/auth"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const Login = () => {
    
    // sending email for forget password
    const [showSendEmail, setShowSendEmail] = useState(false);
    const handleCloseEmail = () => setShowSendEmail(false);
    const handleShowSendEmail = () => setShowSendEmail(true);
    
    // sending code for verifying password
    const [showSendCode, setShowSendCode] = useState(false);
    const handleCloseCode = () => setShowSendCode(false);
    const handleShowSendCode = () => setShowSendCode(true);
    
    // sending new password
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleCloseNewPassword = () => setShowNewPassword(false);
    const handleShowNewPassword = () => setShowNewPassword(true);
    
    const [ myEmail , setMyEmail ] = useState("")
    const [ myCode , setMyCode ] = useState("")
    const [ myNewPassword , setMyNewPassword ] = useState("")

    const [ userData , setUserData ] = useState({
        email : "",
        password : ""
    })

    const [password, setPassword] = useState(true)
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isSignInFetching , isSignInError , isSignInErrorMsg , userDetails ,  userSignInSuccess } = useSelector(state => state.usersReducer)
    const { isPartnerSignInSuccess} = useSelector(state => state.partnerReducer)
    
    const cookies = new Cookies();

    // checking if partner is already signed in
    useEffect(() => {
        if(isPartnerSignInSuccess === true){
            toast.error("You are Already Signed in as Partner, Please Logout First.")
            navigate(-1)
        }
    },[])

    // checking if user is signed in or not
    useEffect(() => {
        const checkUser = () => {
            // let customerToken = cookies.get('fiveChefsCustomerTempToken')
            // console.log("Customer Token got: ",customerToken)
            // if(userSignInSuccess === true){
            //     socket.emit("newCustomerConnected",  userDetails)
            //     //toast.success("You are Already Signed In")
            //     navigate(-1)
            // }
        }
        checkUser()
    },[userSignInSuccess])

    // logging in
    const loginNow = async () => {
        if(userData?.email == "" || userData?.password == ""){
            toast.warning("Email and Password both are Required")
        }else{
            if(userSignInSuccess === false){
                dispatch(LogInUser(userData , dispatch))
                //navigate(-1)
            }
        }
    }

    // mocking google sign in popup
    const handleClick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            //console.log("response got : ", data?.user?.email , data?.user?.displayName)
            dispatch(LogInUserWithGoogle({email : data?.user?.email , username : data?.user?.displayName} , dispatch))
        })
    }
    
    // sending email for forget password
    const sendEmail = async () => {
        if(myEmail == ""){
            toast.error("Email  is Required")
        }else{
            toast.success("Verification Code Sent to your Email.")
            handleShowSendCode()
            handleCloseEmail()
            setMyEmail("")
        }
    }
    
    // sending email for forget password
    const verifyCode = async () => {
        if(myCode == ""){
            toast.error("Verification Code is Required")
        }else{
            toast.success("Verification Code Matched SuccessFully")
            handleShowNewPassword()
            handleCloseCode()
            setMyCode("")
        }
    }
    
    // sending email for forget password
    const updateMyPassword = async () => {
        if(myNewPassword == ""){
            toast.error("New Password can not be Empty is Required")
        }else{
            toast.success("Password Updated SuccessFully")
            handleShowNewPassword()
            handleCloseNewPassword()
            setMyNewPassword("")
        }
    }
    
  return (
    <div className='login-page'>
        
        <Header  />

        <div className="container-fluid login-container">
            <div className="row h-100">
                <div className="col-md-6 login-left h-100">
                        <h1 className='login-title text-center'>Welcome to 5 Chef’s</h1>
                    <div className="col-lg-6 col-sm-8 col-11 m-auto login-form">
                        <p className='mt-4 login-create'>
                            If you don’t have account, you can <Link className='text-color-primary text-decoration-underline' to={'/signup'}>Create new account</Link>
                        </p>
                        <div className="login-input mb-3">
                            <input type="email" placeholder='E-mail' value={userData?.email} onChange={(e) => setUserData({...userData , email : e.target.value})} />
                        </div>
                        <div className="login-input mb-2">
                            <input type={password ? 'password' : 'text'} placeholder='Password' value={userData?.password} onChange={(e) => setUserData({...userData , password : e.target.value})} />
                            <img className='ms-2' src={eye} alt="" onClick={() => setPassword(!password)} />
                        </div>
                        <p style={{color : "crimson", fontWeight : 600 , cursor : "pointer", fontSize : "13px" , marginLeft : "15px" }} onClick={handleShowSendEmail} >Forgot Password</p>
                        {
                            isSignInFetching === true ? (
                                <h4>Please wait</h4>
                            ) : (
                                <>
                                    {/* <Link className='text-light text-decoration-underline d-block mb-4' to={'/forgotPassword'}>Forgot password?</Link> */}
                                    <Link className='login-btn text-light bg-color-primary hover-blue' onClick={loginNow}  >Login</Link>
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
                                    {/* <Link className='login-btn bg-white text-dark mb-3' to={'#'}>
                                        <img className='me-3' src={email} alt="" />
                                        Continue with Email
                                    </Link> */}
                                    <Link className='text-center w-100 d-block mt-4 text-light' to={'/'}>Login later</Link>
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
        
        {/* sending email for forget password */}
        <Modal
            show={showSendEmail}
            onHide={handleCloseEmail}
            backdrop="static"
            keyboard={false}
            style={{backdrop : "5px"}}
          >
            <Modal.Header style={{backgroundColor : "#000000" , color : "white"}}>
              <Modal.Title style={{fontSize : "20px", }} >Forgot Password</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor : "#000000" , color : "white"}} >
                 <div style={{display : "flex" , flexDirection : 'column' , justifyContent : "center"}} >
                    <h6>Your Email:</h6>
                    <input type="email" style={{padding : "5px" , borderRadius : "10px"}} value={myEmail} onChange={(e) => setMyEmail(e.target.value)} />
                 </div>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor : "#000000" , color : "white"}}>
              <Button variant="danger" size="sm" onClick={handleCloseEmail}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={sendEmail} >Send Code</Button>
            </Modal.Footer>
        </Modal>
        
        {/* sending code for verification */}
        <Modal
            show={showSendCode}
            onHide={handleCloseCode}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header style={{backgroundColor : "#000000" , color : "white"}}>
              <Modal.Title>Verifying Code</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor : "#000000" , color : "white"}}>
                <div style={{display : "flex" , flexDirection : 'column' , justifyContent : "center"}} >
                    <h6>Enter Received Code:</h6>
                    <input type="number" style={{padding : "5px" , borderRadius : "10px"}} value={myCode} onChange={(e) => setMyCode(e.target.value)} />
                 </div>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor : "#000000" , color : "white"}}>
              <Button variant="danger" size="sm" onClick={handleCloseCode}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={verifyCode} >Verify Code</Button>
            </Modal.Footer>
        </Modal>
        
         {/* updating password */}
         <Modal
            show={showNewPassword}
            onHide={handleCloseNewPassword}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header style={{backgroundColor : "#000000" , color : "white"}}>
              <Modal.Title>Update Password</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor : "#000000" , color : "white"}}>
                <div style={{display : "flex" , flexDirection : 'column' , justifyContent : "center"}} >
                    <h6>Enter New Password:</h6>
                    <input type="text" style={{padding : "5px" , borderRadius : "10px"}} value={myNewPassword} onChange={(e) => setMyNewPassword(e.target.value)} />
                </div>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor : "#000000" , color : "white"}}>
              <Button variant="secondary" size="sm" onClick={handleCloseNewPassword}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={updateMyPassword} >Update Now</Button>
            </Modal.Footer>
        </Modal>

    </div>
  )
}

export default Login