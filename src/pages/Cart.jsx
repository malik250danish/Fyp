import React, { useState } from 'react'
import Header from '../components/Header'
import menu5 from '../assets/img/menu5.jpg'
import menu6 from '../assets/img/menu6.jpg'
import menu7 from '../assets/img/menu7.jpg'
import menu3 from '../assets/img/menu3.jpg'
import menu8 from '../assets/img/menu8.jpg'
import menu1 from '../assets/img/menu1.jpg'
import star from '../assets/icons/star.svg'
import heart from '../assets/icons/heart.svg'
import Slider from 'react-slick'
import Footer from '../components/Footer'
import { increaseQtyOfAnyProductInCustomMenu, decreaseQtyOfAnyProductInCustomMenuNew, emptyCustomMenu, addAppMenuToCart, emptyingMyCustomMenu, increaseQtyOfAnyProductIpMenu, decreaseQtyOfAnyProductInAppMenu, removeAppMenuFromCart, getAllOrders, deleteAppMenuFromCart } from "../redux/actions/UserActions"
import { addUserIdToFavoriteMenu, removeUserIdToFavoriteMenu, getHomeTopFiveDeals } from '../redux/actions/HomePageActions'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { placeNewOrder } from "../api/CustomerApi"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { AiOutlineDelete } from "react-icons/ai"
import { MdAddCircleOutline } from "react-icons/md"
import { duplicateAppMenuToCart } from "../redux/actions/UserActions"
import { AiOutlineMinusCircle } from "react-icons/ai"
import { useEffect } from 'react'

const Cart = ({ socket }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isTopDealsFetching, isTopDealsError, allTopDeals } = useSelector(state => state.homePageReducer)
    const { appMenus, customMenu, userSignInSuccess, userDetails, isAppMenusFetching } = useSelector(state => state.usersReducer)

    // getting all menus
    useEffect(() => {
        //getting all menus
        const getMenus = async () => {
            //if(allTopDeals?.length < 1){
            dispatch(getHomeTopFiveDeals(dispatch))
            //}
        }
        getMenus()
    }, [])

    console.log("allTopDeals ===> : ", allTopDeals)

    const [item1, setItem1] = useState(false)
    const [item2, setItem2] = useState(false)
    const [item3, setItem3] = useState(false)
    const [item4, setItem4] = useState(false)
    const [item5, setItem5] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (menuType, refNo) => {
        // /setShow(true)
        if (refNo !== undefined) {
            navigate(`/place-order/${menuType}?refNo=${refNo}`)
        } else {
            navigate(`/place-order/${menuType}`)
        }
        // if(userSignInSuccess === false){
        //     toast.warning("Looks like you are not Logged in, Please sign in before placing an order")
        // }
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

    const [orderData, setOrderData] = useState({
        products: [],
        address: "",
        deliveryDate: "",
        note: "",
        total: "",
        restaurant: "",
        menu: null,
        isCustomMenu: null
    })

    const [msg, setMsg] = useState("")

    // sending new order
    const placeMyNewOrder = async () => {
        setMsg("")
        if (userSignInSuccess === false) {
            toast.warning("Please sign in to Continue")
            navigate("/login")
        } else {
            const { data } = await placeNewOrder(orderData);
            setMsg(data?.message)
            if (data?.success === true) {
                setOrderData({
                    products: [],
                    address: "",
                    deliveryDate: "",
                    note: "",
                    total: "",
                    restaurant: "",
                    menu: null,
                    note: "",
                    isCustomMenu: null
                })
                if (orderData?.isCustomMenu === false) {
                    dispatch(removeAppMenuFromCart(orderData?.refNo, dispatch))
                } else {
                    dispatch(emptyingMyCustomMenu(dispatch))
                }
                toast.success(data?.message)
                handleClose()
            } else {
                toast.error(data?.message)
            }
        }
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

    // duplicating app menu to cart
    const increaseMyAppMenu = (data) => {
        dispatch(duplicateAppMenuToCart(data, dispatch))
    }

    // adding menu to cart
    const addMyItemToCart = (data) => {
        dispatch(addAppMenuToCart(data, dispatch))
    }

    // removing menu from cart
    const removeMyItemFromCart = (id) => {
        //dispatch(removeAppMenuFromCart(id,dispatch))
        dispatch(deleteAppMenuFromCart(id, dispatch))
    }



    return (
        <div className='cart-page'>

            <Header socket={socket} />

            <div className="container">
                <h1 className='section-title cart-title'>Cart <span className='fs-3'> 5chef</span></h1>
                {
                    customMenu?.products?.length > 0 ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "between", width: "100%", maxWidth: "620px", }} >
                                <h3 style={{ marginBottom: "20px" }}>You Custom Created Menu</h3>
                                <AiOutlineDelete style={{ fontSize: "25px", marginLeft: "auto", color: "crimson", fontWeight: 600 }} onClick={() => dispatch(emptyingMyCustomMenu(dispatch))} />
                            </div>
                        </>
                    ) : (
                        null
                    )
                }
                {
                    customMenu?.products?.length > 0 ? (
                        <div className="row">
                            <div className="col-lg-8 mb-3">
                                <div className="cart-items">
                                    {/* Headings of table */}
                                    <div className="cart-item d-flex align-items-center justify-content-between">
                                        <div className="cart-item-left d-flex align-items-between">
                                            <h3>
                                                <span>Product</span>
                                            </h3>
                                        </div>
                                        <div className="cart-item-middle text-color-primary">
                                            $Price
                                        </div>
                                        <div className="cart-item-middle text-color-primary">
                                            Sub Total
                                        </div>
                                        <div className="cart-item-right d-flex align-items-center">
                                            <span>Quantity</span>
                                        </div>
                                    </div>
                                    {
                                        Object.keys(customMenu).length !== 0 ? (
                                            customMenu?.products?.map((item) => (
                                                <div className="cart-item d-flex align-items-center justify-content-between" key={item?._id}>
                                                    <div className="cart-item-left d-flex align-items-center flex-column" >
                                                        <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.thumbnail} style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} alt="" />
                                                        <h3>
                                                            <span>{item?.name}</span>
                                                        </h3>
                                                    </div>
                                                    <div className="cart-item-middle text-color-primary" style={{ textAlign: "left" }} >
                                                        ${item?.price}
                                                    </div>
                                                    <div className="cart-item-middle text-color-primary">
                                                        ${item?.subTotal}
                                                    </div>
                                                    <div className="cart-item-right d-flex align-items-center">
                                                        <span className='cart-mince' onClick={() => item?.qty > 1 && (dispatch(decreaseQtyOfAnyProductInCustomMenuNew(item._id, dispatch)))}>-</span>
                                                        <span className="cart-qty">{item?.qty}</span>
                                                        <span className='cart-plus' onClick={() => dispatch(increaseQtyOfAnyProductInCustomMenu(item?._id, dispatch))}>+</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <h4>Cart is Empty.</h4>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="cart-details">
                                    <div className="cart-details-item">
                                        GST (16%)
                                        <span>${customMenu?.Gst?.toFixed(2)}</span>
                                    </div>
                                    <div className="cart-details-item">
                                        Delivery
                                        <span>${customMenu?.Delivery?.toFixed(2)}</span>
                                    </div>
                                    <div className="cart-details-item">
                                        Quantity
                                        <span>{customMenu?.products?.length}</span>
                                    </div>
                                    {/* <div className="cart-details-item">
                                    Sub Total
                                    <span className='text-color-primary fs-3'>$17.50</span>
                                </div> */}
                                    <div className="cart-details-item border-bottom">
                                        Total
                                        <span>${customMenu?.total?.toFixed(2)}</span>
                                    </div>
                                    {/* <div className="cart-details-item border-bottom">
                                    Discount:50%
                                    <span>$17.50</span>
                                </div> */}

                                </div>
                                <button className='checkout-btn hover-blue' onClick={() => { handleShow(true); setOrderData({ products: customMenu?.products, restaurant: customMenu?.restaurant, total: customMenu?.total?.toFixed(2), menu: customMenu?.Menu, isCustomMenu: true }) }} >Checkout</button>
                            </div>
                        </div>
                    ) : (
                        null
                    )
                }


                {/* Displaying App Menus */}
                <h3 style={{ marginBottom: "20px", marginTop: "20px" }} >App Menus</h3>
                {
                    appMenus?.length > 0 ? (
                        appMenus?.map((item, index) => (
                            <>
                                <div style={{ display: "flex", justifyContent: "between", maxWidth: "720px" }} key={item?.refNo}>
                                    <h4 style={{ marginTop: "25px" }} >{index + 1}- {item?.MenuName}</h4>
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginLeft: "auto" }} >
                                        {/* <AiOutlineMinusCircle style={{ fontSize : "25px", marginLeft : "30px",  marginTop : "25px", color  : "crimson", fontWeight : 600}} onClick={() => item?.qty > 1 && dispatch(removeAppMenuFromCart(item, dispatch))} />
                                    <MdAddCircleOutline style={{ fontSize : "25px", marginLeft : "30px",  marginTop : "25px", color  : "crimson", fontWeight : 600}} onClick={() => addMyItemToCart(item)}  /> */}

                                        <div className="cart-item-right d-flex align-items-center">
                                            <span className='cart-mince' onClick={() => item?.qty > 1 && dispatch(removeAppMenuFromCart(item, dispatch))} >-</span>
                                            <span className="cart-qty">{item?.qty}</span>
                                            <span className='cart-plus' onClick={() => increaseMyAppMenu(item)} >+</span>
                                        </div>

                                        <AiOutlineDelete style={{ fontSize: "25px", marginLeft: "30px", marginTop: "20px", color: "crimson", fontWeight: 600, }} onClick={() => dispatch(deleteAppMenuFromCart(item?.Menu, dispatch))} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-8 mb-3">
                                        <div className="cart-items">
                                            {/* Headings of table */}
                                            <div className="cart-item d-flex align-items-center justify-content-between">
                                                <div className="cart-item-left d-flex align-items-center">
                                                    <h3>
                                                        <span>Product</span>
                                                        {/* Spicy chicken, beef */}
                                                    </h3>
                                                </div>
                                                <div className="cart-item-middle text-color-primary">
                                                    $Price
                                                </div>
                                                <div className="cart-item-middle text-color-primary">
                                                    Sub Total
                                                </div>
                                                <div className="cart-item-right d-flex align-items-center">
                                                    <span>Quantity</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-8 mb-3">
                                        <div className="cart-items" >
                                            {
                                                item?.products?.map((itemOne, index) => (
                                                    <div className="cart-item d-flex align-items-center justify-content-between" key={itemOne?.refNo}>
                                                        <div className="cart-item-left d-flex align-items-center flex-column" >
                                                            <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + itemOne?.thumbnail} style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} alt="" />
                                                            <h3>
                                                                <span>{itemOne?.name}</span>
                                                            </h3>
                                                        </div>
                                                        <div className="cart-item-middle text-color-primary" style={{ textAlign: "left" }} >
                                                            ${itemOne?.price}
                                                        </div>
                                                        <div className="cart-item-middle text-color-primary">
                                                            ${itemOne?.subTotal}
                                                        </div>
                                                        {/* <div className="cart-item-right d-flex align-items-center">
                                                    <span className='cart-mince' onClick={() => itemOne?.qty > 1 &&  (dispatch(decreaseQtyOfAnyProductInAppMenu(item?.refNo , itemOne?._id , dispatch)))}>-</span>
                                                    <span className="cart-qty">{itemOne?.qty}</span>
                                                    <span className='cart-plus' onClick={() => dispatch(increaseQtyOfAnyProductInAppMenu(item?.refNo , itemOne?._id , dispatch))}>+</span>
                                                </div> */}
                                                        <div className="cart-item-right d-flex align-items-center">
                                                            {/* <span className='cart-mince' >-</span> */}
                                                            <span className="cart-qty">{itemOne?.qty}</span>
                                                            {/* <span className='cart-plus' >+</span> */}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="cart-details">
                                            <div className="cart-details-item">
                                                GST (16%)
                                                <span>${item?.Gst?.toFixed(2)}</span>
                                            </div>
                                            <div className="cart-details-item">
                                                Delivery
                                                <span>${item?.Delivery?.toFixed(2)}</span>
                                            </div>
                                            <div className="cart-details-item">
                                                Quantity
                                                <span>{item?.qty}</span>
                                            </div>
                                            <div className="cart-details-item border-bottom">
                                                Total
                                                <span>${item?.total?.toFixed(2)}</span>
                                            </div>
                                            {/* // <div className="cart-details-item border-bottom">
                                        //     Discount:50%
                                        //     <span>$17.50</span>
                                        // </div>
                                        // <div className="cart-details-item">
                                        //     Sub Total
                                        //     <span className='text-color-primary fs-3'>$17.50</span>
                                        // </div> */}
                                        </div>
                                        <button className='checkout-btn hover-blue' onClick={() => { handleShow(false, item?.refNo); setOrderData({ products: item?.products, restaurant: item?.restaurant, total: item?.total?.toFixed(2), menu: item?.Menu, isCustomMenu: false }) }} >Checkout</button>
                                    </div>
                                </div>
                            </>
                        ))
                    ) : (
                        <div style={{ display: "flex", justifyContent: "center" }} >
                            <h4>No App Menu Added Yet </h4>
                        </div>
                    )
                }


            </div>


            <div className="container mt-4 py-5">

                <h1 className="section-title mb-4">Most Ordered Items</h1>

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

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <Modal.Title>Place New Order</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#1F1F1F", color: "white" }}  >
                        <p style={{ color: "#2980b9", fontWeight: 600, marginBottom: "20px" }} >{msg}</p>
                        <h6>Address:</h6>
                        <input placeholder="Enter Delivery Address..." autoFocus={true} type="text" style={{ borderRadius: "5px", backgroundColor: "#1F1F1F", color: "white", border: "1px solid #dfe6e9", padding: "10px", mibHeight: "25px" }} value={orderData?.address} onChange={(e) => setOrderData({ ...orderData, address: e.target.value })} />
                        <h6 style={{ marginTop: "15px" }}  >Delivery Date:</h6>
                        <input type="date" style={{ borderRadius: "5px", border: "1px solid #dfe6e9", padding: "10px", mibHeight: "25px", backgroundColor: "#1F1F1F", color: "white" }} value={orderData?.deliveryDate} onChange={(e) => setOrderData({ ...orderData, deliveryDate: e.target.value })} />
                        <h6 style={{ marginTop: "15px" }} >Note (optional):</h6>
                        <textArea placeholder="Enter any special note (If Any)..." rows={5} style={{ borderRadius: "5px", border: "1px solid #dfe6e9", backgroundColor: "#1F1F1F", color: "white", padding: "10px", mibHeight: "25px" }} onChange={(e) => setOrderData({ ...orderData, note: e.target.value })}> {orderData?.note} </textArea>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <Button variant="danger" onClick={handleClose}>
                        Dismiss
                    </Button>
                    <Button variant="success" onClick={placeMyNewOrder} >Post Now</Button>
                </Modal.Footer>
            </Modal>

            <Footer />

        </div>
    )
}

export default Cart