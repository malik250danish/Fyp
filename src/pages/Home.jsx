import React, { useEffect, useMemo } from 'react'
import Header from '../components/Header'
import banner from '../assets/img/banner.png'
import menu1 from '../assets/img/menu1.jpg'
import menu2 from '../assets/img/menu2.jpg'
import menu3 from '../assets/img/menu3.jpg'
import menu4 from '../assets/img/menu4.jpg'
import menu5 from '../assets/img/menu5.jpg'
import menu6 from '../assets/img/menu6.jpg'
import menu7 from '../assets/img/menu7.jpg'
import menu8 from '../assets/img/menu8.jpg'
import about from '../assets/img/about.png'
import aboutAvatar from '../assets/img/about-avatar.svg'
import heart from '../assets/icons/heart.svg'
import star from '../assets/icons/star.svg'
import starStroke from '../assets/icons/star-stroke.svg'
import discount from '../assets/icons/discount.svg'
import check from '../assets/icons/check.svg'
import motorcycle from '../assets/icons/motorcycle.svg'
import stopwatch from '../assets/icons/stopwatch.svg'
import faster from '../assets/icons/faster.svg'
import tick from '../assets/icons/tick.png'
import right from '../assets/icons/right.png'
import banner1 from '../assets/icons/banner1.svg'
import banner2 from '../assets/icons/banner2.svg'
import banner3 from '../assets/icons/banner3.svg'
import banner4 from '../assets/icons/banner4.svg'
import banner5 from '../assets/icons/banner5.svg'
import tab1 from '../assets/icons/tab1.svg'
import tab2 from '../assets/icons/tab2.svg'
import tab3 from '../assets/icons/tab3.svg'
import tab4 from '../assets/icons/tab4.svg'
import tab5 from '../assets/icons/tab5.svg'
import prev from '../assets/icons/prev.svg'
import next from '../assets/icons/next.svg'
import download from '../assets/img/download.png'
import appStore from '../assets/img/appStore.svg'
import googlePlay from '../assets/img/googlePlay.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Slider from "react-slick";
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'
import { getTopProducts } from '../api/CommonApi'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import axios from 'axios';
import { getHomeMainCategories, getHomeSubCategory, getHomeTopFiveDeals, getEmptyTopFiveDeals, getHomeMainCategoriesEmpty, getHomeSubCategoryEmpty, getHomeFeaturedRestaurants, getHomeFeaturedRestaurantsEmpty, getHomeNearRestaurants, getHomeNearRestaurantsEmpty, getMyAllTopMenusMain, addUserIdToFavoriteMenu, removeUserIdToFavoriteMenu, addUserIdToFavoriteRestaurant, removeUserIdToFavoriteRestaurant } from '../redux/actions/HomePageActions'
import { addAppMenuToCart, removeAppMenuFromCart, deleteAppMenuFromCart } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { CiLocationOn } from "react-icons/ci"
import RestaurantSkeleton from "../common/RestaurantSkeleton"
import MenuSkeleton from "../common/MenuSkeleton"
import CategoriesSkeleton from "../common/CategoriesSkeleton"
import SubCategoriesSkeleton from "../common/SubCategoriesSkeleton"



const Home = ({ socket }) => {
    const [item1, setItem1] = useState(false)
    const [tab, setTab] = useState(1)
    const navigate = useNavigate()

    const prevRef = React.useRef(null)
    const nextRef = React.useRef(null)

    const feedPrevRef = React.useRef(null)
    const feedNextRef = React.useRef(null)

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <div
                className={className}
                style={{ display: "none", background: "red" }}
                onClick={onClick}
                ref={nextRef}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <div
                className={className}
                style={{ display: "none", background: "green" }}
                onClick={onClick}
                ref={prevRef}
            />
        );
    }

    function FeedNextArrow(props) {
        const { className, onClick } = props;
        return (
            <div
                className={className}
                style={{ display: "none", background: "red" }}
                onClick={onClick}
                ref={feedNextRef}
            />
        );
    }

    function FeedPrevArrow(props) {
        const { className, onClick } = props;
        return (
            <div
                className={className}
                style={{ display: "none", background: "green" }}
                onClick={onClick}
                ref={feedPrevRef}
            />
        );
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
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

    const settings2 = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
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
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const settings3 = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    const settings4 = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <FeedNextArrow />,
        prevArrow: <FeedPrevArrow />,
    };


    const [allProducts, setAllProducts] = useState([])
    const [selectedPareCate, setSelectedPareCate] = useState("")
    const [selectedParent, setSelectedParent] = useState("")

    const dispatch = useDispatch()
    const { isMainCateFetching, isMainCateError, allMainCategories, isSubCateFetching, isSubCateError, allSubCategories, isTopDealsFetching, isTopDealsError, allTopDeals, isFeaturedRestaurantsFetching, isFeaturedRestaurantsError, allFeaturedRestaurants, isNearRestaurantsFetching, isNearRestaurantsError, allNearRestaurants } = useSelector(state => state.homePageReducer)
    const { userSignInSuccess, appMenus, isAppMenusFetching, isAppMenusErrorMsg, isAppAddingMenusSuccess, isAppMenusRemovingSuccess, userDetails } = useSelector(state => state.usersReducer)

    // getting all data
    useEffect(() => {
        // getting all parent categories
        const getParCategories = async () => {
            if (allMainCategories?.length < 1) {
                dispatch(getHomeMainCategories(dispatch))
            }
            setSelectedParent(allMainCategories[0].name)
            setSelectedPareCate(allMainCategories[0]._id)
        }
        getParCategories()

        // // getting all menus
        const getMenus = async () => {
            if (allTopDeals?.length < 1) {
                dispatch(getHomeTopFiveDeals(dispatch))
            }
        }
        getMenus()

        // getting all restaurants
        const getRestaurants = async () => {
            if (allFeaturedRestaurants?.length < 1) {
                dispatch(getHomeFeaturedRestaurants(dispatch))
            }
        }
        getRestaurants()

        // getting user's location from its IP address
        const getLocation = async () => {
            //const {data} = await getUserLocation();
            axios.get('https://geolocation-db.com/json/50ad4a90-fd5e-11ec-b463-1717be8c9ff1')
                .then(function (response) {
                    // handle success
                    //console.log( 'response ; ', response);

                    // getting all restaurants
                    // const getRestaurants = async () => {
                    //     const {data} = await getAllNearRestaurants();
                    //     if(data?.success === true){
                    //         setAllNearRestaurants(data?.AllRestaurants)
                    //     }
                    // }
                    //getRestaurants()
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
            console.log("location data : ".data)
        }
        getLocation()

        // getting top products
        const getMyTopProducts = async () => {
            const { data } = await getTopProducts();
            if (data?.success === true) {
                setAllProducts(data?.AllProducts)
            }
        }
        getMyTopProducts()

        // getting all suggested restaurants
        const getMySuggestedRestaurants = async () => {
            if (allNearRestaurants?.length < 1) {
                dispatch(getHomeNearRestaurants(dispatch))
            }
        }
        getMySuggestedRestaurants()
    }, [])

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all top deals
        dispatch(getEmptyTopFiveDeals(dispatch))

        // emptying all top deals
        dispatch(getHomeMainCategoriesEmpty(dispatch))

        // emptying all top deals
        dispatch(getHomeSubCategoryEmpty(dispatch))

        // emptying all featured restaurants
        dispatch(getHomeFeaturedRestaurantsEmpty(dispatch))

        // emptying all near restaurants
        dispatch(getHomeNearRestaurantsEmpty(dispatch))
    };

    // emptying all data in redux related to home screen
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    // getting all sub categories of first main category
    useEffect(() => {
        if (allMainCategories?.length > 0) {
            // getting sub categories of first main category
            dispatch(getHomeSubCategory(allMainCategories[0]._id, dispatch))
        }
    }, [allMainCategories])


    // for getting sub categories of any category
    useMemo(async () => {
        if (selectedPareCate !== "") {
            dispatch(getHomeSubCategory(selectedPareCate, dispatch))
        }
    }, [selectedPareCate])

    // adding menu to cart
    const addMyItemToCart = (data) => {
        dispatch(addAppMenuToCart(data, dispatch))
    }

    // removing menu from cart
    const removeMyItemFromCart = (id) => {
        //dispatch(removeAppMenuFromCart(id,dispatch))
        dispatch(deleteAppMenuFromCart(id, dispatch))
    }

    // adding menu to favourite
    const addToFavorite = (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(addUserIdToFavoriteMenu({ menuId: id, userId: userDetails?.Id }, dispatch))
        }
    }

    // removing user from favorite
    const removeToFavorite = (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(removeUserIdToFavoriteMenu({ menuId: id, userId: userDetails?.Id }, dispatch))
        }
    }

    // adding restaurant  to favourite
    const addRestaurantToFavorite = (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(addUserIdToFavoriteRestaurant({ menuId: id, userId: userDetails?.Id }, dispatch))
        }
    }

    // removing restaurant  to favourite
    const removeRestaurantToFavorite = (id) => {
        if (userSignInSuccess === false) {
            toast.warning("Please Sign In to Continue")
        } else {
            dispatch(removeUserIdToFavoriteRestaurant({ menuId: id, userId: userDetails?.Id }, dispatch))
        }
    }

    // limit for skeleton
    const limit = [1, 2, 3]

    return (
        <div className='homepage'>
            <Header socket={socket} />

            <div className="container banner py-4">
                <div className="banner-text">
                    <p className='faster d-flex align-items-center justify-content-center text-color-primary'>
                        More than Faster
                        <img src={faster} className='ms-2' alt="" />
                    </p>
                    <h1 className='mt-4'>
                        Be The Fastest In Delivering Your <span className='text-color-primary'>Food</span>
                    </h1>
                    <div className="address-input mt-4">
                        <img className='address-location' src={tick} alt="" />
                        <input type="text" placeholder='Enter delivery address' />
                        <div className="address-submit">
                            <img src={right} alt="" />
                        </div>
                    </div>
                    <Link to={'/'} className='bg-color-primary mt-2 hover-blue'>
                        Get Started
                    </Link>
                </div>
                <div className="banner-right d-flex align-items-center">
                    <img src={banner} className='banner-img' alt="" />
                </div>
            </div>

            <div className="container menu-section mt-5">
                <h1 className='section-title'>Menu That Always <br /> Makes You Fall In Love</h1>

                <div className="tabs mt-5">
                    {
                        isMainCateFetching === true ? (
                            limit?.map((item) => (
                                <div key={item} >
                                    <CategoriesSkeleton />
                                </div>
                            ))
                        ) : (
                            isMainCateError === true ? (
                                <h4>Could not get Main Categories</h4>
                            ) : (
                                allMainCategories?.length > 0 ? (
                                    allMainCategories?.map((item, index) => (
                                        <div key={item?._id} className={`tab ${tab === 1 ? 'active' : ''}`} onClick={() => { setSelectedPareCate(item?._id); setSelectedParent(item?.name) }}>
                                            <div className="tab-img">
                                                <img src={"https://fivechefapp.cyclic.app" + "/categoriesImages/" + item?.image} alt="" />
                                            </div>
                                            {item?.name}
                                        </div>
                                    ))
                                ) : (
                                    <p>No Parent Categories found </p>
                                )
                            )

                        )
                    }
                </div>

                {
                    tab === 1 && (
                        <Slider {...settings} style={{ display: "flex", flexDirection: "row" }} >
                            {
                                isSubCateFetching === true ? (
                                    limit?.map((item) => (
                                        <div key={item} >
                                            <SubCategoriesSkeleton />
                                        </div>
                                    ))
                                ) : (
                                    isSubCateError === true ? (
                                        <h4>Could not fetch Sub categories</h4>
                                    ) : (
                                        allSubCategories?.length > 0 ? (
                                            allSubCategories?.map((item, ind) => (
                                                <div>
                                                    <div className="menu-slide" style={{ paddingRight: "5px", cursor: "pointer", maxHeight: "200px" }} onClick={() => navigate(`/related-products/${selectedParent}/${item?.name}/${selectedPareCate}/${item?._id}`)} >
                                                        <img src={"https://fivechefapp.cyclic.app" + "/categoriesImages/" + item?.image} alt="" />
                                                        <div className='menu-slide-text'>
                                                            <h2 className='menu-name'>{item?.name}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <h5 style={{ color: 'white' }} >No Sub Categories found</h5>
                                        )
                                    )
                                )

                            }
                        </Slider>
                    )
                }

                {
                    allSubCategories?.length > 0 ? (
                        <div className="menu-arrows mt-4 d-flex align-items-center justify-content-end">
                            <button className='me-3' onClick={() => prevRef.current.click()}>
                                <img src={prev} alt="" />
                            </button>
                            <button onClick={() => nextRef.current.click()}>
                                <img src={next} alt="" />
                            </button>
                        </div>
                    ) : (
                        null
                    )
                }

            </div>

            <div className="container deals-section py-5">
                <div className="flex-row justify-between min-w-[100%]  " style={{ display: "flex", justifyContent: "space-between" }} >
                    <h1 className='section-title '>Top 5 Hottest Deals</h1>
                    <Link to="/top-menus" className="bg-transparent hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center" style={{ border: "none" }}>View All</Link>
                </div>
                <Slider {...settings3} style={{ display: "flex", flexDirection: "row" }}>
                    {
                        isTopDealsFetching === true ? (
                            limit?.map((item) => (
                                <div key={item} >
                                    <MenuSkeleton />
                                </div>
                            ))
                        ) : (
                            isTopDealsError === true ? (
                                <h4>Could Not get Top Menus</h4>
                            ) : (
                                allTopDeals?.length > 0 ? (
                                    allTopDeals?.map((item) => (
                                        <div key={item?.Menu?._id} style={{ marginRight: "15px", backgroundColor: "red" }}  >
                                            <div className="deals-slide" style={{ margin: 'auto', cursor: "pointer" }} >
                                                <div className="deals-img" style={{ padding: '5px' }} >
                                                    <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" onClick={() => navigate(`/menu-details/${item?.Menu?.name}/${item?.Menu?._id}`)} style={{ borderRadius: "15px" }} />
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
                                                    {/* <div className="deals-rating">
                                                    {item?.Menu?.rating}
                                                    <img src={star} alt="" />
                                                    <span>(0)</span>
                                                </div> */}
                                                    <div className="deals-name" style={{ marginTop: "35px", maxHeight: "100px" }} >
                                                        <h3>
                                                            {item?.Menu?.name?.length > 40 ? item?.Menu?.name.substring(0, 40) + '....' : item?.Menu?.name}
                                                            <span>{item?.Menu?.restaurant?.name}</span>
                                                        </h3>
                                                        {/* {
                                                        item?.Menu?.isOffer === true && (
                                                            <img src={discount} alt="" />
                                                        )
                                                    } */}
                                                    </div>
                                                </div>
                                                {
                                                    isAppMenusFetching === true ? (
                                                        <p>please wait...</p>
                                                    ) : (
                                                        appMenus?.length < 1 ? (
                                                            <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                        ) : (
                                                            Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                (
                                                                    <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                ) : (
                                                                    <>
                                                                        <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                    </>
                                                                )
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <h5 style={{ color: 'white' }} >No Menus found</h5>
                                )
                            )
                        )

                    }
                </Slider>

            </div>

            <div className="container restaurants-section py-5">
                <div className="flex-row justify-between min-w-[100%]  " style={{ display: "flex", justifyContent: "space-between" }} >
                    <h1 className='section-title '>Featured Restaurants</h1>
                    <Link to="/featured-restaurants" className="bg-transparent hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center" style={{ border: "none" }}>View All</Link>
                </div>
                <Slider {...settings2} style={{ display: "flex", flexDirection: "row" }}>
                    {
                        isFeaturedRestaurantsFetching === true ? (
                            limit?.map((item) => (
                                <div key={item} >
                                    <RestaurantSkeleton />
                                </div>
                            ))
                        ) : (
                            isFeaturedRestaurantsError === true ? (
                                <h4>Could Not get Featured Restaurants....</h4>
                            ) : (
                                allFeaturedRestaurants?.length > 0 ? (
                                    allFeaturedRestaurants?.map((item) => (
                                        <div key={item?._id} >
                                            <div className="restaurants-slide" >
                                                <div className="restaurants-img" >
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

                                                        <div className="restaurants-feat">
                                                            {/* <img src={stopwatch} alt="" /> */}
                                                            <CiLocationOn size="17px" />
                                                            {item?.address?.length > 35 ? item?.address.substring(0, 35) + "..." : item?.address}
                                                        </div>
                                                        {/* {
                                                            item?.isFreeDelivery === true && (
                                                                <div className="restaurants-feat">
                                                                    <img src={motorcycle} alt="" /> Free Delivery
                                                                </div>
                                                            )
                                                        } */}
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
                                    ))
                                ) : (
                                    <h5 style={{ color: 'white' }} >No Featured Restaurants found</h5>
                                )
                            )
                        )
                    }
                </Slider>

            </div>

            <div className="container restaurants-section py-5">
                <div className="flex-row justify-between min-w-[100%]  " style={{ display: "flex", justifyContent: "space-between" }} >
                    <h1 className='section-title mb-5'>Restaurants Near You</h1>
                    <Link to="/nearest-restaurants" className="bg-transparent hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center" style={{ border: "none" }}>View All</Link>
                </div>
                <Slider {...settings2}>
                    {
                        isNearRestaurantsFetching === true ? (
                            limit?.map((item) => (
                                <div key={item} >
                                    <RestaurantSkeleton />
                                </div>
                            ))
                        ) : (
                            isNearRestaurantsError === true ? (
                                <h4>Could Not Fetch Near Restaurants</h4>
                            ) : (
                                allNearRestaurants?.length > 0 ? (
                                    allNearRestaurants?.map((item) => (
                                        <div key={item?._id} >
                                            <div className="restaurants-slide" >
                                                <div className="restaurants-img" >
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
                                                        {/* {
                                                        item?.isFreeDelivery === true && (
                                                            <div className="restaurants-feat">
                                                                <img src={motorcycle} alt="" /> Free Delivery
                                                            </div>
                                                        )
                                                    } */}
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
                                    ))
                                ) : (
                                    <h5 style={{ color: 'white' }} >No Near Restaurants found</h5>
                                )
                            )
                        )
                    }
                </Slider>

            </div>

            <div className="container restaurants-section py-5">
                <div className="flex-row justify-between min-w-[100%]  " style={{ display: "flex", justifyContent: "space-between" }} >
                    <h1 className='section-title mb-5'>Suggested For You</h1>
                    <Link to="/suggested-restaurants" className="bg-transparent hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center" style={{ border: "none" }}>View All</Link>
                </div>
                <Slider {...settings2}>
                    {
                        isNearRestaurantsFetching === true ? (
                            limit?.map((item) => (
                                <div key={item} >
                                    <RestaurantSkeleton />
                                </div>
                            ))
                        ) : (
                            isNearRestaurantsError === true ? (
                                <h4>Could Not Fetch Near Restaurants</h4>
                            ) : (
                                allNearRestaurants?.length > 0 ? (
                                    allNearRestaurants?.map((item) => (
                                        <div key={item?._id} >
                                            <div className="restaurants-slide" >
                                                <div className="restaurants-img" >
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
                                                        {/* {
                                                        item?.isFreeDelivery === true && (
                                                            <div className="restaurants-feat">
                                                                <img src={motorcycle} alt="" /> Free Delivery
                                                            </div>
                                                        )
                                                    } */}
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
                                    ))
                                ) : (
                                    <h5 style={{ color: 'white' }} >No Near Restaurants found</h5>
                                )
                            )
                        )
                    }
                </Slider>
            </div>


            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-6 about-img mb-4">
                        <img src={about} alt="" />
                    </div>
                    <div className="col-lg-6 about-text">
                        <h1>
                            What Our Customers Say About Us
                        </h1>
                        <div className="feedback-arrows">
                            <div className="feed-arrow me-4" onClick={() => feedPrevRef.current.click()}><img src={prev} alt="" /></div>
                            <div className="feed-arrow" onClick={() => feedNextRef.current.click()}><img src={next} alt="" /></div>
                        </div>
                        <Slider {...settings4}>
                            <div className="feedback-slide-container pe-4">
                                <div className="feedback-slide rounded p-2">
                                    <p>
                                        “Fudo is the best. Besides the many and delicious meals, the service is also very good, especially in the very  fast delivey. I highly recommend Fudo  to you”.
                                    </p>
                                    <div className="about-avatar">
                                        <img src={aboutAvatar} alt="" />
                                        <h4>
                                            Theresa Jordan
                                            <span>Food Enthusiast</span>
                                        </h4>
                                    </div>
                                    <div className="about-rating">
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={starStroke} alt="" />
                                        <span>4,8</span>
                                    </div>
                                </div>
                            </div>
                            <div className="feedback-slide-container pe-4">
                                <div className="feedback-slide rounded p-2">
                                    <p>
                                        “Fudo is the best. Besides the many and delicious meals, the service is also very good, especially in the very  fast delivey. I highly recommend Fudo  to you”.
                                    </p>
                                    <div className="about-avatar">
                                        <img src={aboutAvatar} alt="" />
                                        <h4>
                                            Theresa Jordan
                                            <span>Food Enthusiast</span>
                                        </h4>
                                    </div>
                                    <div className="about-rating">
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={starStroke} alt="" />
                                        <span>4,8</span>
                                    </div>
                                </div>
                            </div>
                            <div className="feedback-slide-container pe-4">
                                <div className="feedback-slide rounded p-2">
                                    <p>
                                        “Fudo is the best. Besides the many and delicious meals, the service is also very good, especially in the very  fast delivey. I highly recommend Fudo  to you”.
                                    </p>
                                    <div className="about-avatar">
                                        <img src={aboutAvatar} alt="" />
                                        <h4>
                                            Theresa Jordan
                                            <span>Food Enthusiast</span>
                                        </h4>
                                    </div>
                                    <div className="about-rating">
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={star} alt="" />
                                        <img src={starStroke} alt="" />
                                        <span>4,8</span>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row download-section p-5 pb-0">
                    <div className="col-lg-6 download-left">
                        <h1>Get Started With 5chef Today!</h1>
                        <p>Discover food wherever and whenever and get your food delivered quickly.</p>
                        <div className="download-images">
                            <img src={appStore} className='me-3' alt="" />
                            <img src={googlePlay} alt="" />
                        </div>
                    </div>
                    <div className="col-lg-6 download-right">
                        <img src={download} alt="" />
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    )
}

export default Home