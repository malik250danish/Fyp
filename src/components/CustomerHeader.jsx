import React from 'react'
import { useState , useEffect } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import logo from '../assets/img/logo.svg'
import search from '../assets/icons/search.svg'
import cart from '../assets/icons/cart.svg'
import login from '../assets/icons/login.svg'
import { LogOutUser } from "../redux/actions/UserActions"
import {useSelector, useDispatch} from 'react-redux'
import Cookies from 'universal-cookie';
import Notification from '../components/CustomerNotifications'
import Dropdown from 'react-bootstrap/Dropdown';

const Header = () => {

    const [activeMenu, setActiveMenu] = useState(false)
    const [active, setActive] = useState(false)
    const handleOpen = () => {
        setActive(!active)
    }
    const dispatch = useDispatch()
    const { userSignInSuccess , appMenus , customMenu , userDetails } = useSelector(state => state.usersReducer)
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    const logMeOut = () => {
        dispatch(LogOutUser(dispatch))
        navigate(-1)
    }

    const navigate = useNavigate()
    const cookies = new Cookies();
    // checking if user is signed in or not
    useEffect(() => {
        const checkUser = () => {
            let customerToken = cookies.get('fiveChefsCustomerTempToken')
            // if(!customerToken){
            //     navigate("/login")
            // }
        }
        checkUser()
    },[navigate ,userSignInSuccess])

  return (
    <div className='header'>
        <div className="container d-flex align-items-center justify-content-between">
            <Link className='logo-link' to='/'>
                <img src={logo} className='h-100' alt="" />
            </Link>
            <div className='d-flex align-items-center header-right d-none d-lg-flex'>
                <Link to='/'>Home</Link>
                <Link to='/contact'>Contact Us</Link>
                <Link to='/faq'>Help & FAQ</Link>
                {/* {
                    isPartnerSignInSuccess === true ? (
                        <Link to='/partner-chat'>Chat</Link>
                    ) : (
                        null
                    )
                } */}
                {
                        userSignInSuccess === true ? (
                            <Link to='/customer-chat'>Chat</Link>
                        ) : (
                            isPartnerSignInSuccess === true ? (
                                <Link to='/partner-chat'>Chat</Link>
                            ) : (
                                <Link to='/customer-chat'>Chat</Link>
                            )
                        )
                }
                
                
                <Link to='#' data-bs-toggle="modal" data-bs-target="#searchModal"><img src={search} alt="" /></Link>
                {/* {
                    userSignInSuccess === true && ( */}
                        <Link to='/cart' className='cart-navlink'>
                            <img src={cart} alt="" />
                            <span className='bg-color-primary'>{
                                    Number(appMenus?.length) + Number(customMenu?.products?.length > 0 ? 1 : 0)
                                }</span>
                        </Link>
                    {/* )
                } */}
                
                {
                    userSignInSuccess === true ? (
                        <Dropdown>
                            <Dropdown.Toggle style={{backgroundColor : "transparent" , color : "white", border : "none"}} id="dropdown-basic">
                                {userDetails?.UserName}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{backgroundColor : "black" , color : "white", border : "none", height : "35px"}}>
                                <Dropdown.Item href="/customer-profile" style={{backgroundColor : "black" , color : "white", border : "none", height : "35px"}}>Profile</Dropdown.Item>
                                <Dropdown.Item href="/all-orders-of-any-customer" style={{backgroundColor : "black" , color : "white", border : "none", height : "35px"}}>Orders</Dropdown.Item>
                                <Dropdown.Item href="/customer-chat" style={{backgroundColor : "black" , color : "white", border : "none", height : "35px"}}>Chat</Dropdown.Item>
                                <Dropdown.Item href="" style={{backgroundColor : "black" , color : "white", border : "none", height : "35px"}} onClick={logMeOut}> 
                                        Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Link to='/login' className='d-flex align-items-center justify-content-center bg-color-primary login-navlink'>
                            <img src={login} className='me-1' alt="" />
                            Login
                        </Link>
                    )
                }
            </div>
            <div id='menu' className={`${activeMenu ? 'rotate' : ''} d-lg-none`} onClick={() => setActiveMenu(!activeMenu)}>
                <div className={`menu-line1 ${activeMenu ? 'rotate1' : ''}`}></div>
                <div className={`menu-line2 ${activeMenu ? 'rotate2' : ''}`}></div>
            </div>
        </div>

        <div className={`mobile-header ${activeMenu ? 'active' : ''}`}>
            <Link className='logo-link' to='/'>
                <img src={logo} className='h-100' alt="" />
            </Link>
            <div className='d-flex align-items-center header-right'>
                <Link to='/'>Home</Link>
                <Link to='/contact'>Contact Us</Link>
                <Link to='/faq'>Help & FAQ</Link>
                <Link to='#'><img src={search} alt="" /></Link>
                <Link to='/cart' className='cart-navlink'>
                    <img src={cart} alt="" />
                    <span className='bg-color-primary'>{ Number(appMenus?.length + customMenu?.length > 0 ? 1 : 0)}</span>
                </Link>
                <Link to='/login' className='d-flex align-items-center justify-content-center bg-color-primary login-navlink'>
                    <img src={login} className='me-1' alt="" />
                    Login
                </Link>
            </div>
        </div>

        <div class="modal fade" id='searchModal' tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content search-modal">
                    <div class="modal-header border-0">
                        <h5 class="modal-title w-100">
                            <input type="text" placeholder='Search...' className='modal-search-input' />
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Header