import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import discount from '../assets/icons/discount.svg'
import star from '../assets/icons/star.svg'
import heart from '../assets/icons/heart.svg'
import Slider from 'react-slick'
import { getSingleMenuDetails, getAllMenusForMainPage } from '../api/CommonApi'
import { useParams } from 'react-router-dom'
import { addAppMenuToCart, removeAppMenuFromCart, addCustomMenuToCart, removeCustomMenuFromCart, addAppMenuToCartForMenuDetails, deleteAppMenuFromCart } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'




const MenuDetails = ({ socket }) => {
    const navigate = useNavigate()
    const { name, id } = useParams()
    document.title = `Menu Details | ${name}`
    const [menuDetails, setMenuDetails] = useState(null)
    const [allProducts, setAllProducts] = useState([])
    const [topMenus, setTopMenus] = useState([])
    const dispatch = useDispatch()
    const { isTopDealsFetching, isTopDealsError, allTopDeals } = useSelector(state => state.homePageReducer)
    const { appMenus, isAppMenusFetching, isAppMenusErrorMsg, isAppAddingMenusSuccess, isAppMenusRemovingSuccess, customMenu, isCustomMenuFetching, isCustomMenuErrorMsg, isCustomMenuAddingSuccess } = useSelector(state => state.usersReducer)

    // getting details
    useEffect(() => {
        // getting menu details
        const getData = async () => {
            const { data } = await getSingleMenuDetails(id);
            setAllProducts(data?.Menu?.products)
            setMenuDetails(data?.Menu)
        }

        getData()

        // getting all top menus
        const getTopMenus = async () => {
            const { data } = await getAllMenusForMainPage(id);
            setTopMenus(data?.AllMenus)
        }
        getTopMenus()
    }, [id])

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
    const [item1, setItem1] = useState(false)

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
        dispatch(addAppMenuToCartForMenuDetails(data, dispatch))
    }

    // removing menu from cart
    const removeMyItemFromCart = (id) => {
        dispatch(deleteAppMenuFromCart(id, dispatch))
    }

    // adding menu to cart
    const addMyNewlyItemToCart = (data) => {
        dispatch(addAppMenuToCart(data, dispatch))
    }

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ display: "flex", flexDirection: "column", maxWidth: "1240px", margin: "auto" }} >
                    <img src={menuDetails?.image && "https://fivechefapp.cyclic.app" + "/menuImages/" + menuDetails?.image} alt="menu logo" style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "10px", objectFit: "cover" }} />
                </div>
                <Row style={{ maxWidth: "1240px", margin: "auto" }} >
                    <Col sm={12} md={6} lg={4} >
                        <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column" }} >
                            <h5 style={{ marginLeft: "15px", marginTop: "15px", textAlign: 'center', color: '#3498db' }} >Menu </h5>
                            <h4 style={{ marginLeft: "15px", marginTop: "15px" }} >{name}</h4>
                        </div>
                    </Col>
                    <Col sm={12} md={6} lg={4} >
                        <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column", alignItems: "center", marginTop: '10px' }} >
                            <h5 style={{ marginLeft: "15px", marginTop: "15px", textAlign: 'center', color: '#3498db' }} >Restaurant </h5>
                            <h4 style={{ marginLeft: "15px", marginTop: "15px" }} > {menuDetails?.restaurant?.name}</h4>
                        </div>
                    </Col>
                    <Col sm={12} md={6} lg={4} >
                        <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column", alignItems: "center", marginTop: '20px' }} >
                            {
                                isAppMenusFetching === true ? (
                                    <p>please wait...</p>
                                ) : (
                                    appMenus?.length < 1 ? (
                                        <button className='deals-atc' onClick={() => addMyItemToCart(menuDetails)}>+ Add to cart</button>
                                    ) : (
                                        Object.values(appMenus).find(itemOne => itemOne.Menu == menuDetails?._id) ?
                                            (
                                                <button className='deals-atc' onClick={() => removeMyItemFromCart(menuDetails?._id)} >- Remove</button>
                                            ) : (
                                                <>
                                                    <button className='deals-atc' onClick={() => addMyItemToCart(menuDetails)}>+ Add to cart</button>
                                                </>
                                            )
                                    )
                                )
                            }
                        </div>
                    </Col>
                </Row>

                <div style={{ maxWidth: "1240px", margin: "auto", marginTop: "55px" }} >
                    <h4 style={{ marginLeft: "15px", marginTop: "15px" }} >Products Offered:</h4>
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="cart-items">
                                {
                                    allProducts?.length > 0 ? (
                                        allProducts?.map((itemOne) => (
                                            <div className="cart-item d-flex align-items-center justify-content-between">
                                                <div className="cart-item-left d-flex align-items-center">
                                                    <Link to={`/product-details/${itemOne?.name}/${itemOne?._id}`}>
                                                        <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + itemOne?.thumbnail} alt="" />
                                                    </Link>
                                                    <h3>
                                                        <span>{itemOne?.name}</span>
                                                        {
                                                            itemOne?.tags?.map((tag) => (
                                                                <span style={{ fontSize: "13px" }} >{tag},</span>
                                                            ))
                                                        }

                                                    </h3>
                                                </div>
                                                <div className="cart-item-middle text-color-primary">
                                                    ${itemOne?.price}
                                                </div>
                                                <div className="cart-item-right d-flex align-items-center">
                                                    {
                                                        isCustomMenuFetching === true ? (
                                                            <p>please wait...</p>
                                                        ) : (
                                                            customMenu?.length < 1 ? (
                                                                <button className='deals-atc' style={{ marginTop: "15px" }} onClick={() => addMyItemCustomToCart(itemOne)}>+ Add to cart</button>
                                                            ) : (
                                                                customMenu?.products?.find(itemTwo => itemTwo?._id == itemOne?._id) ?
                                                                    (
                                                                        <button className='deals-atc' style={{ marginTop: "15px" }} onClick={() => removeMyCustomItemFromCart(itemOne)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' style={{ marginTop: "15px" }} onClick={() => addMyItemCustomToCart(itemOne)}>+ Add to cart</button>
                                                                        </>
                                                                    )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h4>No Products Found  in this Menu</h4>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: "1240px", margin: "auto", marginTop: "55px" }} >
                    <h1 className="section-title mb-4">Most Ordered Menus</h1>

                    <Slider {...settings3} style={{ display: "flex", flexDirection: "row" }}>
                        {
                            isTopDealsFetching === true ? (
                                <h4>Fetching</h4>
                            ) : (
                                isTopDealsError === true ? (
                                    <h4>Could Not get Top Menus</h4>
                                ) : (
                                    allTopDeals?.length > 0 ? (
                                        allTopDeals?.map((item) => (
                                            <div key={item?.Menu?._id}   >
                                                <div className="deals-slide" style={{ marginRight: '30px', cursor: "pointer", maxHeight: "390px" }} >
                                                    <div className="deals-img" onClick={() => navigate(`/menu-details/${item?.Menu?.name}/${item?.Menu?._id}`)} style={{ borderRadius: "15px", padding: '5px' }} >
                                                        <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" style={{ objectFit: "cover" }} />
                                                        <div className="deals-price">
                                                            <span className='text-color-primary'>$</span>
                                                            {item?.total}
                                                        </div>
                                                        <div className={`deals-heart ${item1 ? 'bg-color-primary' : ''}`} onClick={() => setItem1(!item1)}>
                                                            <img src={heart} alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="deals-desc" style={{ minHeight: '150px', padding: '5px' }} onClick={() => navigate(`/menu-details/${item?.Menu?.name}/${item?.Menu?._id}`)}>
                                                        {/* <div className="deals-rating">
                                                    {item?.Menu?.rating}
                                                    <img src={star} alt="" />
                                                    <span>(0)</span>
                                                </div> */}
                                                        <div className="deals-name" style={{ marginTop: "35px", maxHeight: "100px" }}>
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
                                                                <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => addMyNewlyItemToCart(item)}>+ Add to cart</button>
                                                            ) : (
                                                                Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                    (
                                                                        <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                    ) : (
                                                                        <>
                                                                            <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => addMyNewlyItemToCart(item)}>+ Add to cart</button>
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

                <Footer />
            </div>
        </>
    )
}

export default MenuDetails