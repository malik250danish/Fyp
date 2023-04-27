import React, { useState , useEffect } from 'react'
import { Link , useNavigate , useLocation } from 'react-router-dom'
import login from '../assets/img/login.svg'
import logoBlue from '../assets/img/logoBlue.svg'
import eyeBlue from '../assets/icons/eyeBlue.svg'
import {LogInPartner , LogOutPartner} from "../redux/actions/PartnerActions"
import Cookies from 'universal-cookie';
import {useSelector, useDispatch} from 'react-redux'
import { toast } from 'react-toastify';
import { encrypt, decrypt, compare } from 'n-krypta'; 

const PartnerLogin = () => {

    const [password, setPassword] = useState(true)
    const [msg, setMsg] = useState("")
    const [ userData , setUserData ] = useState({
        email : "",
        password : ""
    })

    // logging in any partner using credentials in encrypted form
    const myParam = useLocation().search;
    const email = new URLSearchParams(myParam.toString()).get("user");
    let decodedUri = decodeURIComponent(email);
    useEffect(() => {
        if(decodedUri !== null){
            const decryptedCredentials = decrypt(decodedUri, "Z94g6^4k0Q@#");
            if(decryptedCredentials?.email !== "" && decryptedCredentials?.password !== ""){
                console.log("===>>> final : "  ,  decryptedCredentials?.email, decryptedCredentials?.password)
                dispatch(LogInPartner({email : decryptedCredentials?.email , password : decryptedCredentials?.password} , dispatch))
            }
        }
    },[decodedUri])

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isPartnerSignInFetching , isPartnerSignInError , isPartnerSignInErrorMsg , isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    const { userSignInSuccess } = useSelector(state => state.usersReducer)
    // checking if partner is already signed in
    useEffect(() => {
        if(userSignInSuccess === true){
            toast.error("You are Already Signed in as Customer, Please Logout First.")
            navigate(-1)
        }
    },[])

    const cookies = new Cookies();
    // checking if user is signed in or not
    useEffect(() => {
        const checkUser = () => {
            // let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            // console.log("tokens : ", isPartnerSignInSuccess)
            // if(isPartnerSignInSuccess === false){
            //     //navigate(-1)
            //     console.log("login inside",partnerToken)
            // }else{
            //     console.log("else inside",partnerToken)
            //     navigate("/partner/orders")
            // }
        }
        checkUser()
    },[navigate ,isPartnerSignInSuccess])

    // logging in
    const loginNow = async () => {
        if(userData?.email == "" || userData?.password == ""){
            toast.warning("Email and Password must not br Empty")
        }else{
            //if(isPartnerSignInSuccess === false){
                dispatch(LogInPartner(userData , dispatch))
                navigate('/partner/login')
            //}
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
                        <h4 className='partner-login-title'>5 Chef's Partner</h4>
                        <h2 className='login-heading'>Login</h2>
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
                        <Link className='login-btn text-light bg-color-primary partner-login-btn' to={''} onClick={loginNow} >LOGIN</Link>
                        <div className='fw-bold mt-4 text-center' style={{display : "flex" , flexDirection : "column"}} >
                            Don’t have an account?
                            <Link className='text-color-primary' to={'/partner/signup'}> Sign Up</Link>
                            <Link className='text-color-#2E3192' style={{marginTop : "20px"}} to={'/'} >Back to Home</Link>
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