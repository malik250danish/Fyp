import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import mc from '../assets/icons/mcdonalds.svg'
import logoBlue from '../assets/icons/logoBlue.svg'
import clock from '../assets/icons/clock.svg'
import star from '../assets/icons/star.svg'
import help from '../assets/icons/help.svg'
import group from '../assets/icons/group.svg'
import delivery from '../assets/img/delivery.svg'
import restaurant from '../assets/img/restaurant.svg'
import menu5 from '../assets/img/menu5.jpg'
import menu6 from '../assets/img/menu6.jpg'
import menu7 from '../assets/img/menu7.jpg'
import map from '../assets/img/map.svg'
import location from '../assets/icons/location.svg'
import clockBlue from '../assets/icons/clockBlue.svg'
import phone from '../assets/icons/phone.svg'
import newPage from '../assets/icons/new.svg'
import down from '../assets/icons/down.svg'
import next from '../assets/icons/next.svg'
import Slider from 'react-slick'
import Footer from '../components/Footer'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { getSingleRestaurantDetails, getSingleRestaurantDistance, getAllMenusOfAnyRestaurant, getAllReviewsOnAnyRestaurant, getAllProductsOfOwnerCommon, getDistanceOfRestaurantFromUser } from '../api/CommonApi'
import axios from 'axios'
import { addAppMenuToCart, addCustomMenuToCart, removeCustomMenuFromCart, removeAppMenuFromCart, deleteAppMenuFromCart, removeNewAppMenuFromCart } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import Accordion from 'react-bootstrap/Accordion';
import MyLightBox from '../utils/LightBox'
import Badge from 'react-bootstrap/Badge';



const Restaurant = ({ socket }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const [restaurantDetails, setDetails] = useState(null)
    const [allMenus, setAllMenus] = useState([])
    const [restaurantAddressNew, setRestaurantAddressNew] = useState({
        distance: "",
        time: ""
    })
    const [allReviews, setAllReviews] = useState([])
    const [allProds, setAllProds] = useState([])

    const dispatch = useDispatch()
    const { customMenu, isCustomMenuFetching, appMenus, isAppMenusFetching, isAppMenusErrorMsg, isAppAddingMenusSuccess, isAppMenusRemovingSuccess } = useSelector(state => state.usersReducer)


    const [tab, setTab] = useState(1)

    const prevRef = React.useRef(null)
    const nextRef = React.useRef(null)
    // fs light box toggling var
    const [toggler, setToggler] = useState(false);
    const [bgImages, setBgImages] = useState([]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        // nextArrow: <SampleNextArrow />,
        // prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // getting restaurant data
    useEffect(() => {
        // getting details
        const getDetails = async () => {
            const { data } = await getSingleRestaurantDetails(id);
            if (data?.success === true) {
                setDetails(data?.Restaurant)

                // making array for fs lightBox
                let newArr = []
                for (let p = 0; p !== data?.Restaurant?.backgroundImages?.length; p++) {
                    newArr.push("https://fivechefapp.cyclic.app" + "/restaurantsImages/" + data?.Restaurant?.backgroundImages[p])
                }
                setBgImages(newArr)
            }

            // getting all reviews
            const res = await getAllReviewsOnAnyRestaurant(id);
            if (res?.data?.success === true) {
                setAllReviews(res?.data?.AllReviews)
            }
        }
        getDetails()

        // getting details
        const getAllMyMenusOfRestaurant = async () => {
            const { data } = await getAllMenusOfAnyRestaurant(id);
            setAllMenus(data?.AllMenus)
        }
        getAllMyMenusOfRestaurant()

        // getting details
        const getAllProductsOfARestaurant = async () => {
            const { data } = await getAllProductsOfOwnerCommon(id);
            if (data?.success === true) {
                setAllProds(data?.AllProducts)
            }
        }
        getAllProductsOfARestaurant()

    }, [id])

    // getting user location on basis of its IP
    useEffect(() => {
        // getting user's location from its IP address
        const getLocation = async () => {
            axios.get('https://geolocation-db.com/json/50ad4a90-fd5e-11ec-b463-1717be8c9ff1')
                .then(function (response) {
                    let sendData = {
                        lat: response?.data?.latitude,
                        long: response?.data?.longitude,
                    }

                    // getting all restaurants
                    const getRestaurantDistance = async () => {
                        const { data } = await getDistanceOfRestaurantFromUser(id, sendData);
                        if (data?.success === true) {
                            setRestaurantAddressNew({ distance: data?.Distance?.rows[0]?.elements[0]?.distance?.value + " meters", time: data?.Distance?.rows[0]?.elements[0]?.duration?.text })
                        }
                        // else{
                        //     setRestaurantAddressNew({distance : "Not Reachable by You"})
                        // }
                    }
                    getRestaurantDistance()
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }
        getLocation()
    }, [id])

    // adding menu to cart
    const addMyItemCustomToCart = (data) => {
        dispatch(addCustomMenuToCart(data, dispatch))
    }

    // removing menu from cart
    const removeMyCustomItemFromCart = (id) => {
        dispatch(removeCustomMenuFromCart(id, dispatch))
    }

    // adding menu to cart
    const addMyItemToCart = (data) => {
        dispatch(addAppMenuToCart(data, dispatch))
    }

    // removing menu from cart
    const removeMyItemFromCart = (id) => {
        //dispatch(removeNewAppMenuFromCart(id,dispatch))
        dispatch(deleteAppMenuFromCart(id, dispatch))
    }

    return (
        <div className='restaurant-page'>

            <Header socket={socket} />

            <div className="container" style={{ maxWidth: "1240px", margin: "auto" }}>
                <div className="row">
                    <div className="col-lg-6 p-4">
                        <div className="res-logo">
                            <img src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + restaurantDetails?.logo} style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: '50%', objectFit: "cover" }} alt="" />
                            <h2 className='mb-0 ms-2'>{restaurantDetails?.name}</h2>
                        </div>
                        <ul className='res-feats'>
                            <li>
                                <div className="feats-img">
                                    <img src={logoBlue} alt="" />
                                </div>
                                5 Chef • {restaurantDetails?.name}
                            </li>
                            {/* <li>
                                <div className="feats-img">
                                    <img src={star} alt="" />
                                </div>
                               {restaurantDetails?.rating} ({allReviews?.length}) • 500 meters
                                <img className='ms-3' src={help} alt="" />
                            </li> */}
                            {
                                restaurantDetails?.is24HoursOpen === true && (
                                    <li>
                                        <div className="feats-img">
                                            <img src={clock} alt="" />
                                        </div>
                                        Open 24/7
                                    </li>
                                )
                            }
                        </ul>
                        <div className="res-action mb-4">
                            <div className="res-details">
                                <div className="res-detail">
                                    <h6 style={{ color: "#3498db" }} >{restaurantDetails?.deliveryTime}</h6>
                                    <p>Delivery Time</p>
                                </div>
                                <div className="details-divider"></div>
                                <div className="res-detail">
                                    <p>Service Type</p>
                                    {
                                        (restaurantDetails?.isDelivery === true && restaurantDetails?.isPickUp === true) ? (
                                            <h6 style={{ color: "#3498db" }}> Delivery &  Pick Up</h6>
                                        ) : (
                                            <>
                                                {
                                                    restaurantDetails?.isDelivery === true && (
                                                        <h6 style={{ color: "#3498db" }}>Delivery</h6>
                                                    )
                                                }
                                                {
                                                    restaurantDetails?.isPickUp === true && (
                                                        <h6 style={{ color: "#3498db" }}>Pick Up</h6>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            {/* <button className='group-btn hover-blue'>
                                <img className='me-2' src={group} alt="" />
                                Group Order
                            </button> */}
                        </div>
                        {
                            restaurantDetails?.isOffer === true && (
                                <img src={delivery} className='w-100 my-3' alt="" />
                            )
                        }

                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d180651.1555998931!2d-93.40156407137106!3d44.97061137424916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b333909377bbbd%3A0x939fc9842f7aee07!2sMinneapolis%2C%20MN%2C%20USA!5e0!3m2!1sen!2sma!4v1664965908642!5m2!1sen!2sma" className='w-100' style={{ height: '200px', borderRadius: '10px' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                        <div className="d-flex align-items-center justify-content-between border-bottom py-3">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={location} alt="" />
                                <h6 className='info-text m-0 fw-bold'>{restaurantDetails?.address} <span className='d-block fw-light'></span></h6>
                            </div>
                            <img className='info-action' src={newPage} alt="" />
                        </div>
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={clockBlue} alt="" />
                                {
                                    restaurantDetails?.is24HoursOpen == true ? (
                                        <h6 className='info-text m-0 fw-bold'>Open<span className='d-block fw-light'>Accepting Orders 24/7</span></h6>
                                    ) : (
                                        <h6 className='info-text m-0 fw-bold'>Open <span className='d-block fw-light'>Accepting Orders Until 3:30 pm</span></h6>
                                    )
                                }
                            </div>
                            <img className='info-action' src={down} alt="" />
                        </div>
                        <div className="d-flex align-items-center justify-content-between py-3 pb-0">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={phone} alt="" />
                                <h6 className='info-text m-0 fw-bold'>+ {restaurantDetails?.phoneNo}</h6>
                            </div>
                            <img className='info-action' src={newPage} alt="" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <MyLightBox sources={bgImages} toggler={toggler} />
                        <img style={{ objectFit: 'cover', cursor: "pointer", maxHeight: "500px" }} onClick={() => setToggler(!toggler)} src={restaurantDetails?.backgroundImages[0] ? "https://fivechefapp.cyclic.app" + "/restaurantsImages/" + restaurantDetails?.backgroundImages[0] : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAC+CAMAAADJJ/kMAAAAKlBMVEX5+fnPz8/t7e2ysrLd3d3w8PC7u7vFxcXV1dXq6urm5ubh4eHKysq3t7fTxJD+AAAD4ElEQVR4nO2cjZKCIBRGQVD8qfd/3QUCU7PdVLL2ft+ZaQ3jIqcLhM1OqkJGVQoX2uNCe1xojwvtcaE9LrTHhfa40B4X2uNCe1xojwvtcaE9LrTHhfa40B6X99jrd/CGftK+PLSnPe1pT3va0572MPZf09IatC8P7WlP+xl1sZaKcKp9td1Ajv3QtoVaKsWJ9lbroUxLxTjP3svrrkhL5TjNvguFzYueFPudAjLsO2j7vQKS7FHn/a0AuubXt4I93lJRzs096k43lTZv9mTYD3rfzJdhX+fyxsvJsI/b/Eh/tKWCnGY/Jl/bLVcUYp/2umn4v3xRKfaqn5x9efyLsVd1nvv29ZVfjr2nC6zH9P0wPG4HRNk/70ceFosbIQh7ew+Y5x/BfroeztMPYK8X7G9pI99gv5SfBom3t0v3aZR0+35pPgsTbl8vvedxwu2fyOcvwWTbD0vrkW5jS3v4sP2zcR+oN7W0iw/br633s1DJ9t1SeIbd0NI+Pmv/q3z8DlCw/fpH/SxYhn3t794frvSXvL/fE2Fvx6E84c/U+wAB9ncH+6TWK7yhn2fYz3J8v3l/IfUC7BfbuWqlklz7hxSnbzV//6wXYr8yvh928HLt1wj61R915NqHuf/rDl+2vd4x8AXZ6+f39Qj2O3hDP2lfHtrTnva0pz3taU972tNepv1/gfa40B4X2uNCe1xojwvtcaE9LrT/OqxZ/4EOo38r7qCEvTU2/l2effU3RqwJfTDt5MS/sjfdEfs21jT3/+X7Z/aNS/b+jcgWQcGPCmNc50zjdbR/Wt0Ood/hWKeaKffWtLFOtM9NrYfl4jHK2A++I8G+9f21Sf9m7zp7vVZVeP2ihvSyjdWrqrl1f8x9axpV+XcyhOamxrBhGpaLBylj71PRBXvX+GIYCCrbd6oPEzp11D+NVXyxufgENqnmmPs6vBfxOG3qMSwXD1LIXjVN/Bv6MzrV0asPY8F3tL7EoRyrBA0TiDUnuc/296bWw3LxIKXse9OYlCs3ta9He9dUIYm5385N4sM/8OXc22s85qZy2GUWlosHKWUfliGVJvV03t/try5N3E65eBzX+Mq4kPLKP7yU03nBjI8Upsew+MGYiwcpZq9C7n3/F2v+3d6v4ZeLf+58jaAQqt5Gier9ucaGEP/EqTz/Y1MprPav6KDbNjEsF4/xkb1ebdZ/cKt9eYtQiI/Ya7N+Ufvk/Ns43b43t1G+Bkbuvwba40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhdvj8wPWn0j9vHc6+cAAAAASUVORK5CYII="} className='w-100' alt="" />
                        <div className='d-flex res-images mt-3'>
                            <img style={{ objectFit: 'cover' }} onClick={() => setToggler(!toggler)} src={restaurantDetails?.backgroundImages[1] ? "https://fivechefapp.cyclic.app" + "/restaurantsImages/" + restaurantDetails?.backgroundImages[1] : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAC+CAMAAADJJ/kMAAAAKlBMVEX5+fnPz8/t7e2ysrLd3d3w8PC7u7vFxcXV1dXq6urm5ubh4eHKysq3t7fTxJD+AAAD4ElEQVR4nO2cjZKCIBRGQVD8qfd/3QUCU7PdVLL2ft+ZaQ3jIqcLhM1OqkJGVQoX2uNCe1xojwvtcaE9LrTHhfa40B4X2uNCe1xojwvtcaE9LrTHhfa40B6X99jrd/CGftK+PLSnPe1pT3va0572MPZf09IatC8P7WlP+xl1sZaKcKp9td1Ajv3QtoVaKsWJ9lbroUxLxTjP3svrrkhL5TjNvguFzYueFPudAjLsO2j7vQKS7FHn/a0AuubXt4I93lJRzs096k43lTZv9mTYD3rfzJdhX+fyxsvJsI/b/Eh/tKWCnGY/Jl/bLVcUYp/2umn4v3xRKfaqn5x9efyLsVd1nvv29ZVfjr2nC6zH9P0wPG4HRNk/70ceFosbIQh7ew+Y5x/BfroeztMPYK8X7G9pI99gv5SfBom3t0v3aZR0+35pPgsTbl8vvedxwu2fyOcvwWTbD0vrkW5jS3v4sP2zcR+oN7W0iw/br633s1DJ9t1SeIbd0NI+Pmv/q3z8DlCw/fpH/SxYhn3t794frvSXvL/fE2Fvx6E84c/U+wAB9ncH+6TWK7yhn2fYz3J8v3l/IfUC7BfbuWqlklz7hxSnbzV//6wXYr8yvh928HLt1wj61R915NqHuf/rDl+2vd4x8AXZ6+f39Qj2O3hDP2lfHtrTnva0pz3taU972tNepv1/gfa40B4X2uNCe1xojwvtcaE9LrT/OqxZ/4EOo38r7qCEvTU2/l2effU3RqwJfTDt5MS/sjfdEfs21jT3/+X7Z/aNS/b+jcgWQcGPCmNc50zjdbR/Wt0Ood/hWKeaKffWtLFOtM9NrYfl4jHK2A++I8G+9f21Sf9m7zp7vVZVeP2ihvSyjdWrqrl1f8x9axpV+XcyhOamxrBhGpaLBylj71PRBXvX+GIYCCrbd6oPEzp11D+NVXyxufgENqnmmPs6vBfxOG3qMSwXD1LIXjVN/Bv6MzrV0asPY8F3tL7EoRyrBA0TiDUnuc/296bWw3LxIKXse9OYlCs3ta9He9dUIYm5385N4sM/8OXc22s85qZy2GUWlosHKWUfliGVJvV03t/try5N3E65eBzX+Mq4kPLKP7yU03nBjI8Upsew+MGYiwcpZq9C7n3/F2v+3d6v4ZeLf+58jaAQqt5Gier9ucaGEP/EqTz/Y1MprPav6KDbNjEsF4/xkb1ebdZ/cKt9eYtQiI/Ya7N+Ufvk/Ns43b43t1G+Bkbuvwba40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhdvj8wPWn0j9vHc6+cAAAAASUVORK5CYII="} alt="" />
                            <img style={{ objectFit: 'cover' }} onClick={() => setToggler(!toggler)} src={restaurantDetails?.backgroundImages[2] ? "https://fivechefapp.cyclic.app" + "/restaurantsImages/" + restaurantDetails?.backgroundImages[2] : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAC+CAMAAADJJ/kMAAAAKlBMVEX5+fnPz8/t7e2ysrLd3d3w8PC7u7vFxcXV1dXq6urm5ubh4eHKysq3t7fTxJD+AAAD4ElEQVR4nO2cjZKCIBRGQVD8qfd/3QUCU7PdVLL2ft+ZaQ3jIqcLhM1OqkJGVQoX2uNCe1xojwvtcaE9LrTHhfa40B4X2uNCe1xojwvtcaE9LrTHhfa40B6X99jrd/CGftK+PLSnPe1pT3va0572MPZf09IatC8P7WlP+xl1sZaKcKp9td1Ajv3QtoVaKsWJ9lbroUxLxTjP3svrrkhL5TjNvguFzYueFPudAjLsO2j7vQKS7FHn/a0AuubXt4I93lJRzs096k43lTZv9mTYD3rfzJdhX+fyxsvJsI/b/Eh/tKWCnGY/Jl/bLVcUYp/2umn4v3xRKfaqn5x9efyLsVd1nvv29ZVfjr2nC6zH9P0wPG4HRNk/70ceFosbIQh7ew+Y5x/BfroeztMPYK8X7G9pI99gv5SfBom3t0v3aZR0+35pPgsTbl8vvedxwu2fyOcvwWTbD0vrkW5jS3v4sP2zcR+oN7W0iw/br633s1DJ9t1SeIbd0NI+Pmv/q3z8DlCw/fpH/SxYhn3t794frvSXvL/fE2Fvx6E84c/U+wAB9ncH+6TWK7yhn2fYz3J8v3l/IfUC7BfbuWqlklz7hxSnbzV//6wXYr8yvh928HLt1wj61R915NqHuf/rDl+2vd4x8AXZ6+f39Qj2O3hDP2lfHtrTnva0pz3taU972tNepv1/gfa40B4X2uNCe1xojwvtcaE9LrT/OqxZ/4EOo38r7qCEvTU2/l2effU3RqwJfTDt5MS/sjfdEfs21jT3/+X7Z/aNS/b+jcgWQcGPCmNc50zjdbR/Wt0Ood/hWKeaKffWtLFOtM9NrYfl4jHK2A++I8G+9f21Sf9m7zp7vVZVeP2ihvSyjdWrqrl1f8x9axpV+XcyhOamxrBhGpaLBylj71PRBXvX+GIYCCrbd6oPEzp11D+NVXyxufgENqnmmPs6vBfxOG3qMSwXD1LIXjVN/Bv6MzrV0asPY8F3tL7EoRyrBA0TiDUnuc/296bWw3LxIKXse9OYlCs3ta9He9dUIYm5385N4sM/8OXc22s85qZy2GUWlosHKWUfliGVJvV03t/try5N3E65eBzX+Mq4kPLKP7yU03nBjI8Upsew+MGYiwcpZq9C7n3/F2v+3d6v4ZeLf+58jaAQqt5Gier9ucaGEP/EqTz/Y1MprPav6KDbNjEsF4/xkb1ebdZ/cKt9eYtQiI/Ya7N+Ufvk/Ns43b43t1G+Bkbuvwba40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhdvj8wPWn0j9vHc6+cAAAAASUVORK5CYII="} alt="" />
                            <img style={{ objectFit: 'cover' }} onClick={() => setToggler(!toggler)} src={restaurantDetails?.backgroundImages[3] ? "https://fivechefapp.cyclic.app" + "/restaurantsImages/" + restaurantDetails?.backgroundImages[3] : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP0AAAC+CAMAAADJJ/kMAAAAKlBMVEX5+fnPz8/t7e2ysrLd3d3w8PC7u7vFxcXV1dXq6urm5ubh4eHKysq3t7fTxJD+AAAD4ElEQVR4nO2cjZKCIBRGQVD8qfd/3QUCU7PdVLL2ft+ZaQ3jIqcLhM1OqkJGVQoX2uNCe1xojwvtcaE9LrTHhfa40B4X2uNCe1xojwvtcaE9LrTHhfa40B6X99jrd/CGftK+PLSnPe1pT3va0572MPZf09IatC8P7WlP+xl1sZaKcKp9td1Ajv3QtoVaKsWJ9lbroUxLxTjP3svrrkhL5TjNvguFzYueFPudAjLsO2j7vQKS7FHn/a0AuubXt4I93lJRzs096k43lTZv9mTYD3rfzJdhX+fyxsvJsI/b/Eh/tKWCnGY/Jl/bLVcUYp/2umn4v3xRKfaqn5x9efyLsVd1nvv29ZVfjr2nC6zH9P0wPG4HRNk/70ceFosbIQh7ew+Y5x/BfroeztMPYK8X7G9pI99gv5SfBom3t0v3aZR0+35pPgsTbl8vvedxwu2fyOcvwWTbD0vrkW5jS3v4sP2zcR+oN7W0iw/br633s1DJ9t1SeIbd0NI+Pmv/q3z8DlCw/fpH/SxYhn3t794frvSXvL/fE2Fvx6E84c/U+wAB9ncH+6TWK7yhn2fYz3J8v3l/IfUC7BfbuWqlklz7hxSnbzV//6wXYr8yvh928HLt1wj61R915NqHuf/rDl+2vd4x8AXZ6+f39Qj2O3hDP2lfHtrTnva0pz3taU972tNepv1/gfa40B4X2uNCe1xojwvtcaE9LrT/OqxZ/4EOo38r7qCEvTU2/l2effU3RqwJfTDt5MS/sjfdEfs21jT3/+X7Z/aNS/b+jcgWQcGPCmNc50zjdbR/Wt0Ood/hWKeaKffWtLFOtM9NrYfl4jHK2A++I8G+9f21Sf9m7zp7vVZVeP2ihvSyjdWrqrl1f8x9axpV+XcyhOamxrBhGpaLBylj71PRBXvX+GIYCCrbd6oPEzp11D+NVXyxufgENqnmmPs6vBfxOG3qMSwXD1LIXjVN/Bv6MzrV0asPY8F3tL7EoRyrBA0TiDUnuc/296bWw3LxIKXse9OYlCs3ta9He9dUIYm5385N4sM/8OXc22s85qZy2GUWlosHKWUfliGVJvV03t/try5N3E65eBzX+Mq4kPLKP7yU03nBjI8Upsew+MGYiwcpZq9C7n3/F2v+3d6v4ZeLf+58jaAQqt5Gier9ucaGEP/EqTz/Y1MprPav6KDbNjEsF4/xkb1ebdZ/cKt9eYtQiI/Ya7N+Ufvk/Ns43b43t1G+Bkbuvwba40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhfa40J7XGiPC+1xoT0utMeF9rjQHhdvj8wPWn0j9vHc6+cAAAAASUVORK5CYII="} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">

                <div>
                    <h1 className='section-title mb-0'>What People are Saying</h1>
                    <p className='d-flex align-items-center mb-2'>
                        <img src={star} alt="" className='me-2' />
                        {restaurantDetails?.rating}
                        <span className='text-secondary mx-2'>({restaurantDetails?.ratingCount}) • </span>
                        {restaurantAddressNew?.distance} ({restaurantAddressNew?.time})
                    </p>
                </div>

                {
                    allReviews?.length > 0 ? (
                        <div className="menu-arrows d-flex justify-content-end mb-4 pe-4">
                            <button style={{ backgroundColor: '#00aeef' }} onClick={() => nextRef.current.click()}>
                                <img src={next} alt="" />
                            </button>
                        </div>
                    ) : (
                        null
                    )
                }

                <Slider {...settings} style={{ display: "flex", flexDirection: "row" }} >
                    <div  >

                    </div>
                    {
                        allReviews?.length > 0 ? (
                            allReviews?.map((item) => (
                                <div key={item?._id}>
                                    <div className="res-slide-container" >
                                        <div className="res-slide">
                                            <h5>{item?.userId?.username}</h5>
                                            <p className='d-flex align-items-center'>
                                                <img src={star} alt="" className='me-2' />
                                                {item?.rating}
                                                <span className='text-secondary ms-2'> • {moment(item?.createdAt).format("DD/MM/YY")}</span>
                                            </p>
                                            <p className='m-0'>
                                                {item?.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h4>No Reviews Added Yet </h4>
                        )
                    }
                </Slider>

                <div className="container mt-5 pb-5">
                    <div className="res-tabs">
                        <span className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}  >Menus</span>
                        <span className={tab === 2 ? 'active' : ''} onClick={() => setTab(2)}  >Most Popular Menus</span>
                        <span className={tab === 3 ? 'active' : ''} onClick={() => setTab(3)}  >Featured Menus</span>
                        <span className={tab === 4 ? 'active' : ''} onClick={() => setTab(4)}  >Food Items</span>
                    </div>


                    {
                        tab === 1 && (
                            <div className="res-list">
                                {
                                    allMenus?.length > 0 ? (
                                        allMenus?.map((item) => (
                                            <div className="res-item d-flex align-items-center justify-content-between py-3 pb-0">
                                                <div className="res-left d-flex align-items-center mb-3">
                                                    <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" />
                                                    <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} >
                                                        <h4>{item?.Menu?.name}</h4>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                                                            {
                                                                item?.Menu?.products?.map((itemOne) => (
                                                                    <Badge bg="info" style={{ marginRight: "5px", backgroundColor: "red !important", color: "white" }} onClick={() => navigate(`/product-details/${itemOne?.name}/${itemOne?._id}`)} >{itemOne?.name}</Badge>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="res-right d-flex align-items-center mb-3">
                                                    <div className="res-price me-3">
                                                        <span className='text-color-primary'>$</span> {item?.total}
                                                    </div>
                                                    {
                                                        isAppMenusFetching === true ? (
                                                            <p>please wait...</p>
                                                        ) : (
                                                            appMenus?.length < 1 ? (
                                                                <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                            ) : (
                                                                Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                    (
                                                                        <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                        </>
                                                                    )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h4>No Menus Found</h4>
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        tab === 2 && (
                            <div className="res-list">
                                {
                                    allMenus?.length > 0 ? (
                                        allMenus?.map((item) => (
                                            <div className="res-item d-flex align-items-center justify-content-between py-3 pb-0">
                                                <div className="res-left d-flex align-items-center mb-3">
                                                    <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" />
                                                    <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} >
                                                        <h4>{item?.Menu?.name}</h4>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                                                            {
                                                                item?.Menu?.products?.map((itemOne) => (
                                                                    <Badge bg="info" style={{ marginRight: "5px", backgroundColor: "#00aeef", color: "white" }} onClick={() => navigate(`/product-details/${itemOne?.name}/${itemOne?._id}`)} >{itemOne?.name}</Badge>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="res-right d-flex align-items-center mb-3">
                                                    <div className="res-price me-3">
                                                        <span className='text-color-primary'>$</span> {item?.total}
                                                    </div>
                                                    {
                                                        isAppMenusFetching === true ? (
                                                            <p>please wait...</p>
                                                        ) : (
                                                            appMenus?.length < 1 ? (
                                                                <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                            ) : (
                                                                Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                    (
                                                                        <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                        </>
                                                                    )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h4>No Menus Found</h4>
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        tab === 3 && (
                            <div className="res-list">
                                {
                                    allMenus?.length > 0 ? (
                                        allMenus?.map((item) => (
                                            <div className="res-item d-flex align-items-center justify-content-between py-3 pb-0">
                                                <div className="res-left d-flex align-items-center mb-3">
                                                    <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" />
                                                    <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} >
                                                        <h4>{item?.Menu?.name}</h4>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                                                            {
                                                                item?.Menu?.products?.map((itemOne) => (
                                                                    <Badge bg="info" style={{ marginRight: "5px", backgroundColor: "#00aeef", color: "white" }} onClick={() => navigate(`/product-details/${itemOne?.name}/${itemOne?._id}`)} >{itemOne?.name}</Badge>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="res-right d-flex align-items-center mb-3">
                                                    <div className="res-price me-3">
                                                        <span className='text-color-primary'>$</span> {item?.total}
                                                    </div>
                                                    {
                                                        isAppMenusFetching === true ? (
                                                            <p>please wait...</p>
                                                        ) : (
                                                            appMenus?.length < 1 ? (
                                                                <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                            ) : (
                                                                Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                    (
                                                                        <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' style={{ marginTop: "12px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                        </>
                                                                    )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h4>No Menus Found</h4>
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        tab === 4 && (
                            <div className="res-list">
                                {
                                    allProds?.length > 0 ? (
                                        allProds?.map((item) => (
                                            <div className="res-item d-flex align-items-center justify-content-between py-3 pb-0" key={item?._id}>
                                                <div className="res-left d-flex align-items-center mb-3">
                                                    <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.productImage} alt="" />
                                                    {/* <div style={{display : "flex", flexDirection : 'column', alignItems: "flex-start"}} > 
                                                        <h4 style={{marginTop : "10px"}}  >{item?.name}</h4>
                                                        <Accordion style={{backgroundColor : "transparent", color : "white"}}>
                                                            <Accordion.Item eventKey="0" style={{backgroundColor : "transparent", color : "white",maxHeight : "25px"}}>
                                                                <Accordion.Header style={{backgroundColor : "transparent", color : "white", maxHeight : "25px"}} >View Details</Accordion.Header>
                                                                <Accordion.Body style={{backgroundColor : "black", marginTop : "10px",borderRadius : "10px", color : "white", minWidth : "300px"}} >
                                                                    <div style={{display : "flex" , justifyContent : "space-between"}} >
                                                                        {
                                                                            item?.allergens?.map((itemOne) => (
                                                                                <Badge style={{backgroundColor:"#00aeef", color : "white"}}>{itemOne}</Badge>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </div> */}
                                                    <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} >
                                                        <h4>{item?.name}</h4>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                                                            {
                                                                item?.allergens?.map((itemOne) => (
                                                                    <Badge bg="info" style={{ backgroundColor: "#00aeef", color: "white", marginRight: "5px" }}>{itemOne}</Badge>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="res-right d-flex align-items-center mb-3" styles={{ alignItems: "center" }} >
                                                    <div className="res-price me-3">
                                                        <span className='text-color-primary'>$</span> {item?.price}
                                                    </div>
                                                    {
                                                        isCustomMenuFetching === true ? (
                                                            <p>please wait...</p>
                                                        ) : (
                                                            customMenu?.length < 1 ? (
                                                                <button className='deals-atc' style={{ marginTop: "15px" }} onClick={() => addMyItemCustomToCart(item)}>+ Add to cart</button>
                                                            ) : (
                                                                customMenu?.products?.find(itemOne => itemOne?._id == item?._id) ?
                                                                    (
                                                                        <button className='deals-atc' style={{ marginTop: "15px" }} onClick={() => removeMyCustomItemFromCart(item)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' style={{ marginTop: "15px" }} onClick={() => addMyItemCustomToCart(item)}>+ Add to cart</button>
                                                                        </>
                                                                    )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h4>No Menus Found</h4>
                                    )
                                }
                            </div>
                        )
                    }
                </div>

            </div>

            <Footer />

        </div>
    )
}

export default Restaurant