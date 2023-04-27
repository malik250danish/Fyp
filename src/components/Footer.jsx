import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/img/logo.svg'
import send from '../assets/icons/send.svg'
import { RiInstagramFill, RiFacebookFill, RiTwitterFill } from 'react-icons/ri'

const Footer = () => {
  return (
    <div className='container mt-5 p-3 pt-5 footer'>
        <div className="row">
            <div className="col-lg-3 col-md-6">
                <Link className='footer-logo' to={'/'}>
                    <img src={logo} alt="" />
                </Link>
                <p className='footer-about'>
                    Our job is to filling your tummy with delicious food and  with fast and free delivery.
                </p>
                <div className="footer-social">
                    <Link to={'#'}>
                        <RiInstagramFill className='social-icon' />
                    </Link>
                    <Link to={'#'}>
                        <RiFacebookFill className='social-icon' />
                    </Link>
                    <Link to={'#'}>
                        <RiTwitterFill className='social-icon' />
                    </Link>
                </div>
                <p>
                    Copyrights © 2022 <Link to={'/'} className='text-color-primary'>5 Chefs</Link>
                </p>
            </div>
            <div className="col-lg-2 col-md-6 d-flex">
                <ul>
                    <li><h4>About</h4></li>
                    <li><Link to={'/about-us'}>About Us</Link></li>
                    <li><Link to={'/terms-and-conditions'}>Terms & Conditions</Link></li>
                    <li><Link to={'/faq'}>FAQ</Link></li>
                    {/* <li><Link to={'#'}>Features</Link></li> */}
                    {/* <li><Link to={'#'}>News</Link></li> */}
                    
                </ul>
            </div>
            <div className="col-lg-2 col-md-6 d-flex">
                <ul>
                    <li><h4>Company</h4></li>
                    {/* <li><Link to={'#'}>Partner With Us</Link></li> */}
                    <li><Link to={'/view-all-forums'}>Forums</Link></li>
                    <li><Link to={'/all-orders-of-any-customer'}>Orders</Link></li>
                    <li><Link to={'/partner/orders'}>Become Partner</Link></li>
                    {/* <li><Link to={'#'}>Blog</Link></li> */}
                </ul>
            </div>
            <div className="col-lg-2 col-md-6">
                <ul>
                    <li><h4>Support</h4></li>
                    <li><Link to={'/customer-profile'}>Account</Link></li>
                    <li><Link to={'/view-all-tickets'}>Support Center</Link></li>
                    
                    
                    {/* <li><Link to={'#'}>Accessibilty</Link></li> */}
                </ul>
            </div>
            <div className="col-lg-3 col-md-6">
                <ul>
                    <li><h4>Get in Touch</h4></li>
                    <li> <Link to={'/contact'}> Question or feedback?</Link></li>
                    <li>We’d love to hear from you</li>
                </ul>
                <div className="footer-input">
                    <input type="text" placeholder='Email Address' />
                    <img src={send} alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer