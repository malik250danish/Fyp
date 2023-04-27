import React , {useEffect} from 'react'
import { Link , useNavigate } from 'react-router-dom'
import logoBlue from '../assets/img/logoBlue.svg'
import home from '../assets/icons/home.svg'
import orders from '../assets/icons/orders.svg'
import analytics from '../assets/icons/analytics.svg'
import settings from '../assets/icons/settings.svg'
import logout from '../assets/icons/logout.svg'
import { LogOutPartner} from "../redux/actions/PartnerActions"
import {useSelector, useDispatch} from 'react-redux'
import Cookies from 'universal-cookie';

const Sidebar = ({ className }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    const SignMeOut = () => {
        dispatch(LogOutPartner(dispatch))
    }

    const cookies = new Cookies();
    // checking if user is signed in or not
    useEffect(() => {
        const checkUser = () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if(partnerToken){
                //navigate('/partner')
            }else{
                navigate("/partner/login")
            }
        }
        checkUser()
    },[navigate ,isPartnerSignInSuccess])

  return (
    <div className={className} style={{maxHeight : "100vh", overflowY : "scroll"}} >
        
        <div className="sidebar-top w-100">
            <Link to={'/'} className='d-flex align-items-center m-auto sidebar-logo'>
                <img src={logoBlue} alt="" />
                <h3 className='font-nexa mb-0 ms-1 me-4'>Partner App</h3>
            </Link>

            <Link to={'/partner'} className='mt-4 sidebar-navlink mb-3'>
                <img src={home} alt="" />
                Dashboard
            </Link>
            <Link to={'/partner/orders'} className='sidebar-navlink mb-3'>
                <div className="cart-img">
                    <img src={orders} alt="" />
                </div>
                Recent Orders
            </Link>
            <Link to={'/partner/allOrders'} className='sidebar-navlink mb-3'>
                <div className="cart-img">
                    <img src={orders} alt="" />
                </div>
                All Orders
            </Link>
            <Link to={'/partner/all-menus'} className='sidebar-navlink mb-3'>
                <img src={analytics} alt="" />
                    Menus
            </Link>
            <Link to={'/partner/all-products'} className='sidebar-navlink mb-3'>
                <img src={analytics} alt="" />
                    Products
            </Link>
            <Link to={'/partner/all-coupons'} className='sidebar-navlink mb-3'>
                <img src={analytics} alt="" />
                    Coupons
            </Link>
            <Link to={'/partner/all-restaurants'} className='sidebar-navlink mb-3'>
                <img src={analytics} alt="" />
                    Restaurants
            </Link>
            <Link to={'/partner/calender'} className='sidebar-navlink mb-3'>
                <img src={analytics} alt="" />
                    Calender
            </Link>
            <Link to={'/partner/complaints'} className='sidebar-navlink mb-3'>
                <img src={analytics} alt="" />
                    Complaints
            </Link>
            <Link to={'/partner/review-management'} className='sidebar-navlink mb-3'>
                <img src={settings} alt="" />
                Reviews
            </Link>
            <Link to={'/partner/articles'} className='mt-4 sidebar-navlink mb-3'>
                <img src={home} alt="" />
                Articles
            </Link>
            <Link to={'/partner/profile'} className='sidebar-navlink mb-3'>
                <img src={settings} alt="" />
                Profile
            </Link>
        </div>

        <div className="sidebar-bottom w-100">
            <Link to={''} onClick={SignMeOut} className='sidebar-navlink'>
                <img src={logout} alt="" />
                Sign Out
            </Link>
        </div>

    </div>
  )
}

export default Sidebar