import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/img/logo.svg'
import search from '../assets/icons/search.svg'
import cart from '../assets/icons/cart.svg'
import login from '../assets/icons/login.svg'
import { LogOutUser, hideReplaceRestaurant, emptyingMyCustomMenu } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'universal-cookie';
import Notification from '../components/CustomerNotifications'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getRestaurantsForSearching } from "../api/CommonApi"

const Header = ({ socket }) => {

    const [text, setText] = useState("")
    const [activeMenu, setActiveMenu] = useState(false)
    const [allRestaurants, setAllRestaurants] = useState([])
    const [allMatchedRestaurants, setAllMatchedRestaurants] = useState([])
    const [active, setActive] = useState(false)
    const handleOpen = () => {
        setActive(!active)
    }
    const dispatch = useDispatch()
    const { userSignInSuccess, appMenus, customMenu, userDetails, differentRestaurant } = useSelector(state => state.usersReducer)
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    // modal for asking to change restaurant or not
    const [show, setShow] = useState(differentRestaurant);

    const handleClose = () => {
        dispatch(hideReplaceRestaurant(dispatch))
        setShow(false)
    };

    // checking if different restaurant product is added
    useEffect(() => {
        setShow(differentRestaurant)
    }, [differentRestaurant])


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
    }, [navigate, userSignInSuccess])

    // clearing cart
    const clearMyCart = () => {
        dispatch(emptyingMyCustomMenu(dispatch))
    }

    // searching modal
    const [showSearch, setShowSearch] = useState(false);
    const handleCloseSearch = () => {
        setShowSearch(false);
        setAllRestaurants([])
        setAllMatchedRestaurants([])
    }
    const handleShowSearch = async () => {
        setShowSearch(true);
        setAllMatchedRestaurants([])
        const { data } = await getRestaurantsForSearching();
        if (data?.success === true) {
            setAllRestaurants(data?.AllRestaurants)
        } else {
            setAllRestaurants([])
        }
    }

    {/* searching any restaurant on basis of city/name/rating/address */ }
    const getMatchedRestaurants = (value) => {
        if (value?.length > 0) {
            let newArr = []
            let myText = value.toLocaleLowerCase()
            for (let i = 0; i !== allRestaurants.length; i++) {
                if (allRestaurants[i]?.name?.toLowerCase()?.includes(myText) === true || allRestaurants[i]?.rating == myText || allRestaurants[i].address?.toLowerCase()?.includes(myText) === true || allRestaurants[i]?.city?.toLowerCase()?.includes(myText) === true) {
                    newArr.push(allRestaurants[i])
                }
            }
            setText("")
            setAllMatchedRestaurants(newArr)
        } else {
            setAllMatchedRestaurants([])
        }
    }

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


                    <Link to='#' onClick={handleShowSearch} ><img src={search} alt="" /></Link>
                    {/* {
                    userSignInSuccess === true && ( */}
                    {/* <Link to='/cart' className='cart-navlink'>
                            <img src={cart} alt="" />
                            <span className='bg-color-primary'>{
                                    Number(appMenus?.length) + Number(customMenu?.products?.length > 0 ? 1 : 0)
                                }</span>
                        </Link> */}
                    {/* )
                } */}
                    {
                        userSignInSuccess === true && (
                            <Notification click={handleOpen} active={active} socket={socket} />
                        )
                    }
                    {
                        userSignInSuccess === true ? (
                            <Dropdown>
                                <Dropdown.Toggle style={{ backgroundColor: "transparent", color: "white", border: "none" }} id="dropdown-basic">
                                    {userDetails?.UserName}
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }}>
                                    <Dropdown.Item href="/customer-profile" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }}>Profile</Dropdown.Item>
                                    <Dropdown.Item href="/all-orders-of-any-customer" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }}>Orders</Dropdown.Item>
                                    <Dropdown.Item href="/customer-chat" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }}>Chat</Dropdown.Item>
                                    <Dropdown.Item href="/favourities" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }}>Favourites</Dropdown.Item>
                                    <Dropdown.Item href="/customer-chat" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }}>
                                        <Link to='/cart' className='cart-navlink'>
                                            Cart <img src={cart} alt="" />
                                            <span className='bg-color-primary'>{
                                                Number(appMenus?.length) + Number(customMenu?.products?.length > 0 ? 1 : 0)
                                            }</span>
                                        </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }} onClick={logMeOut}>
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
                    <Link to=''><img src={search} alt="" /></Link>
                    <Link to='/cart' className='cart-navlink'>
                        <img src={cart} alt="" />
                        <span className='bg-color-primary'>{Number(appMenus?.length + customMenu?.length > 0 ? 1 : 0)}</span>
                    </Link>
                    <Link to='/login' className='d-flex align-items-center justify-content-center bg-color-primary login-navlink'>
                        <img src={login} className='me-1' alt="" />
                        Login
                    </Link>
                </div>
            </div>


            {/* searching any restaurant on basis of city,name,rating,address */}
            <Modal
                show={showSearch}
                onHide={handleCloseSearch}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header style={{ backgroundColor: "white", color: "#2d3436" }}>
                    <Modal.Title style={{ fontSize: "20px" }} >Search Any Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "white", color: "#2d3436" }} >
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center" }} >
                        <input style={{ width: "100%", borderRadius: "10px", padding: "10px" }} onChange={(e) => getMatchedRestaurants(e.target.value)} />
                        <div style={{ display: "flex", marginTop: "5px", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", maxHeight: "300px", overflowY: "scroll" }} >
                            {
                                allMatchedRestaurants?.length > 0 ? (
                                    allMatchedRestaurants?.map((item) => (
                                        <div key={item?._id} className="my_restaurants" onClick={() => { handleCloseSearch(); navigate(`/restaurant/${item?._id}`) }} style={{ display: "flex", marginTop: "5px", flexDirection: "row", justifyContent: "between", alignItems: "center", backgroundColor: "white", minWidth: "100%", paddingLeft: "5px", borderRadius: "10px" }} >
                                            <img alt="restaurant image" style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.logo} />
                                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", objectFit: "cover", minWidth: "75%", }}  >
                                                <h6 style={{ paddingTop: "5px", marginBottom: "-2px" }} >{item?.name}</h6>
                                                <p style={{ fontSize: "12px" }} >{item?.address?.length > 40 ? item?.address.substring(0, 40) + "..." : item?.address}</p>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", objectFit: "cover", }}  >
                                                <h6 style={{ paddingTop: "5px", marginBottom: "-2px" }} >Rating</h6>
                                                <p style={{ fontSize: "12px" }} >{Number(item?.rating).toFixed()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    null
                                )
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "white", color: "#2d3436" }}>
                    <Button style={{ backgroundColor: "#00aeef" }} onClick={handleCloseSearch}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* clear cart modal */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body>
                    <h6>You can't add to Items of different Restaurant to Cart. Do you want to clear Cart to add this Item?</h6>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={clearMyCart} >Yes, Replace</Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Header