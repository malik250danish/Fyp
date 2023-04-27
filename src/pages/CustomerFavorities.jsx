import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { getAllMyFavouriteRestaurants, getAllMyFavouriteMenus } from '../api/CustomerApi'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { addCustomMenuToCart, removeCustomMenuFromCart } from "../redux/actions/UserActions"
import { addUserIdToFavoriteMenu, removeUserIdToFavoriteMenu, addUserIdToFavoriteRestaurant, removeUserIdToFavoriteRestaurant } from '../redux/actions/HomePageActions'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import Dropdown from 'react-bootstrap/Dropdown';
import heart from '../assets/icons/heart.svg'
import motorcycle from '../assets/icons/motorcycle.svg'
import stopwatch from '../assets/icons/stopwatch.svg'
import check from '../assets/icons/check.svg'
import star from '../assets/icons/star.svg'
import starStroke from '../assets/icons/star-stroke.svg'
import discount from '../assets/icons/discount.svg'
import RestaurantSkeleton from "../common/RestaurantSkeleton"
import MenuSkeleton from "../common/MenuSkeleton"


const CustomerFavorities = ({ socket }) => {
    const location = useLocation()
    const navigate = useNavigate()
    document.title = `Your Favourities`

    const [allRestaurants, setRestaurants] = useState([])
    const [type, setType] = useState("Restaurants")
    const [isFetching, setIsFetching] = useState(false)

    const dispatch = useDispatch()
    const { userSignInSuccess, customMenu, appMenus, isAppMenusFetching, isCustomMenuFetching, isCustomMenuErrorMsg, isCustomMenuAddingSuccess, allNearRestaurants, userDetails } = useSelector(state => state.usersReducer)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            setIsFetching(true)
            if (type == "Restaurants") {
                const { data } = await getAllMyFavouriteRestaurants()
                if (data?.success === true) {
                    setRestaurants(data?.AllRestaurants)
                } else {
                    //toast.error(data?.message)
                    setRestaurants([])
                }
            } else {
                const { data } = await getAllMyFavouriteMenus()
                console.log("all menus : ", data)
                if (data?.success === true) {
                    setRestaurants(data?.AllMenus)
                } else {
                    //toast.error(data?.message)
                    setRestaurants([])
                }
            }
            setIsFetching(false)
        }

        getData()
    }, [type])



    // adding menu to cart
    const addMyItemToCart = (data) => {
        dispatch(addCustomMenuToCart(data, dispatch))
    }

    // removing menu from cart
    const removeMyItemFromCart = (id) => {
        dispatch(removeCustomMenuFromCart(id, dispatch))
    }

    // adding menu to favourite
    const addToFavorite = (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(addUserIdToFavoriteMenu({ menuId: id, userId: userDetails?.Id }, dispatch))
            let newArr = allRestaurants
            let isFound = newArr.find(item => JSON.stringify(item.Menu._id) == JSON.stringify(id));
            if (isFound) {
                isFound.Menu.favoritesUsers.push(userDetails?.Id);

                let myNewArr = newArr.filter(item => JSON.stringify(item.Menu._id) == JSON.stringify(id));
                setRestaurants(myNewArr)
            }
        }
    }

    // removing user from favorite
    const removeToFavorite = (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(removeUserIdToFavoriteMenu({ menuId: id, userId: userDetails?.Id }, dispatch))
            let newArr = allRestaurants
            let isFound = newArr.find(item => JSON.stringify(item.Menu._id) == JSON.stringify(id));
            if (isFound) {
                let isItemFound = isFound.Menu.favoritesUsers.filter(itemOne => itemOne !== userDetails?.Id);
                isFound.Menu.favoritesUsers = isItemFound;

                let myNewArr = newArr.filter(item => JSON.stringify(item.Menu._id) == JSON.stringify(id) ? isFound : item);
                setRestaurants(myNewArr)
            }
        }
    }

    // adding restaurant  to favourite
    const addRestaurantToFavorite = async (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(addUserIdToFavoriteRestaurant({ menuId: id, userId: userDetails?.Id }, dispatch))
            let newArr = allRestaurants
            let isFound = newArr.find(item => item._id == id);
            if (isFound) {
                isFound.favoritesUsers.push(userDetails?.Id);

                let myNewArr = newArr.filter(item => item._id == id ? isFound : item);
                setRestaurants(myNewArr)
            }
        }
    }

    // removing restaurant  to favourite
    const removeRestaurantToFavorite = async (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(removeUserIdToFavoriteRestaurant({ menuId: id, userId: userDetails?.Id }, dispatch))
            let newArr = allRestaurants
            let isFound = newArr.find(item => item._id == id);
            if (isFound) {
                let isItemFound = isFound.favoritesUsers.filter(itemOne => itemOne !== userDetails?.Id);
                isFound.favoritesUsers = isItemFound;

                let myNewArr = newArr.filter(item => item._id == id ? isFound : item);
                setRestaurants(myNewArr)
            }
        }
    }

    // limit for skeleton
    const limit = [1, 2, 3]

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div className="flex justify-center " style={{ maxWidth: "1240px", margin: "auto" }} >
                    <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "1240px", margin: "auto", minWidth: "100%" }} >
                        <h4 style={{ marginLeft: "15px", marginTop: "15px" }} >Your Favourites </h4>
                        <Dropdown style={{ backgroundColor: "transparent", color: "white", border: "none", marginTop: "10px", textDecoration: "none", padding: 0 }} >
                            <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ backgroundColor: "transparent", textDecoration: "none", color: "white", border: "none" }}>
                                {type}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ backgroundColor: "black" }}>
                                <Dropdown.Item href="" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }} onClick={() => setType("Menus")} >Menus</Dropdown.Item>
                                <Dropdown.Item href="" style={{ backgroundColor: "black", color: "white", border: "none", height: "35px" }} onClick={() => setType("Restaurants")} >Restaurant</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <Row style={{ padding: "15px", maxWidth: "1240px", margin: "auto" }}  >
                    {
                        isFetching === true ? (
                            type == "Restaurants" ? (
                                limit?.map((item) => (
                                    <div key={item} style={{ maxWidth: "300px" }} >
                                        <RestaurantSkeleton />
                                    </div>
                                ))
                            ) : (
                                limit?.map((item) => (
                                    <div key={item} style={{ maxWidth: "300px" }} >
                                        <RestaurantSkeleton />
                                    </div>
                                ))
                            )
                        ) : (
                            type == "Restaurants" ? (
                                allRestaurants?.length > 0 ? (
                                    allRestaurants?.map((item) => (
                                        <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px", }} >
                                            <div key={item?._id} >
                                                <div className="restaurants-slide" >
                                                    <div className="restaurants-img" style={{ margin: '5px' }}>
                                                        <Link to={`/restaurant/${item?._id}`}>
                                                            <img src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.image} alt="" />
                                                        </Link>
                                                        {
                                                            item?.favoritesUsers?.includes(userDetails?.Id) == true ? (
                                                                <div className={'restaurants-heart'} onClick={() => removeRestaurantToFavorite(item?._id)}>
                                                                    <img src={heart} alt="" />
                                                                </div>
                                                            ) : (
                                                                <div className={'restaurants-heart'} onClick={() => addRestaurantToFavorite(item?._id)} style={{ backgroundColor: "gray" }}  >
                                                                    <img src={heart} alt="" />
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="restaurants-desc" style={{ margin: '5px' }}>
                                                        <h3 className='restaurants-name'>
                                                            <Link to={`/restaurant/${item?._id}`} className='text-light'>{item?.name}</Link>
                                                            {
                                                                item?.isVerified === true && (<img src={check} alt="" />)
                                                            }
                                                        </h3>
                                                        <div className="restaurants-features"  >
                                                            {
                                                                item?.isFreeDelivery === true && (
                                                                    <div className="restaurants-feat">
                                                                        <img src={motorcycle} alt="" /> Free Delivery
                                                                    </div>
                                                                )
                                                            }
                                                            <div className="restaurants-feat">
                                                                <img src={stopwatch} alt="" />
                                                                {item?.deliveryTime}
                                                            </div>
                                                        </div>
                                                        <div className="restaurants-tags" style={{ minHeight: '50px' }}>
                                                            {
                                                                item?.tags?.map((tag) => (
                                                                    <div className="restaurants-tag">{tag}</div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <h5>No Restaurant Found</h5>
                                )
                            ) : (
                                allRestaurants?.length > 0 ? (
                                    allRestaurants?.map((item) => (
                                        <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px" }}  >
                                            <div key={item?.Menu?._id}   >
                                                <div className="deals-slide" style={{ marginRight: '30px', cursor: "pointer" }} >
                                                    <div className="deals-img" style={{ padding: '5px' }} >
                                                        <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" onClick={() => navigate(`/menu-details/${item?.Menu?.name}/${item?.Menu?._id}`)} style={{ borderBottomLeftRadius: "15px" }} />
                                                        <div className="deals-price">
                                                            <span className='text-color-primary'>$</span>
                                                            {item?.total}
                                                        </div>
                                                        {
                                                            item?.Menu?.favoritesUsers?.includes(userDetails?.Id) == true ? (
                                                                <div className={'deals-heart bg-color-primary'} onClick={() => removeToFavorite(item?.Menu?._id)}>
                                                                    <img src={heart} alt="" />
                                                                </div>
                                                            ) : (
                                                                <div className={'deals-heart'} onClick={() => addToFavorite(item?.Menu?._id)} >
                                                                    <img src={heart} alt="" />
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="deals-desc" style={{ minHeight: '150px', padding: '5px' }} onClick={() => navigate(`/menu-details/${item?.Menu?.name}/${item?.Menu?._id}`)}>
                                                        <div className="deals-rating">
                                                            {item?.Menu?.rating}
                                                            <img src={star} alt="" />
                                                            <span>(0)</span>
                                                        </div>
                                                        <div className="deals-name">
                                                            <h3>
                                                                {item?.Menu?.name?.length > 40 ? item?.Menu?.name.substring(0, 40) + '....' : item?.Menu?.name}
                                                                <span>{item?.Menu?.owner?.username}</span>
                                                            </h3>
                                                            {
                                                                item?.Menu?.isOffer === true && (
                                                                    <img src={discount} alt="" />
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        isAppMenusFetching === true ? (
                                                            <p>please wait...</p>
                                                        ) : (
                                                            appMenus?.length < 1 ? (
                                                                <button className='deals-atc' onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                            ) : (
                                                                Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                    (
                                                                        <button className='deals-atc' onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                        </>
                                                                    )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <h5>No Menus Found</h5>
                                )
                            )
                        )
                    }
                </Row>
                <Footer />
            </div>
        </>
    )
}

export default CustomerFavorities