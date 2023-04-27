import React, { useState, useEffect } from 'react'
import Notification from '../components/Notification'
import Sidebar from '../components/Sidebar'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { appendMoreRecentOrdersOfPartner, changeStatusOfAnyOrderByPartner, getAllRecentOrdersOfPartner, getAllRecentOrdersOfPartnerEmpty, getAllOrdersOfPartner } from "../redux/actions/PartnerActions"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import { updateSingleOrderStatusOfAnyPartner } from "../api/PartnerApi"
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

const PartnerOrders = ({ socket }) => {
    const cookies = new Cookies();
    const [active, setActive] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { isPartnerSignInSuccess, isRecentOrdersFetching, isRecentOrdersErrorMsg, recentOrders } = useSelector(state => state.partnerReducer)

    const handleOpen = () => {
        setActive(!active)
    }
    // getting all related products
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (isPartnerSignInSuccess === false) {
                toast.error("Please Sign In to Continue")
                //navigate("/partner/login")
            } else {
                // event which trigers when user connection becomes connected

            }

        }
        getData()
    }, [isPartnerSignInSuccess])

    const [allOrders, setAllOrders] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    // getting all related products
    useEffect(() => {
        const getData = async () => {
            if (isPartnerSignInSuccess === false) {
                navigate("/login")
            } else {
                //if(recentOrders?.length < 1){
                // getting recent orders
                dispatch(getAllRecentOrdersOfPartner(dispatch))

                // getting all orders
                dispatch(getAllOrdersOfPartner(dispatch))
                //}
            }
        }

        getData()
    }, [])

    // getting top menus on scroll
    const getTopMyMoreOrders = async () => {
        if (isPartnerSignInSuccess === false) {
            navigate("/login")
        } else {
            setIsFetching(true)
            axios.get(`https://fivechefapp.cyclic.app/api/v1/orders/getAllOrdersOfAnyPartnerForWeb?skip=${allOrders.length}`)
                .then(function (response) {
                    // handle success
                    console.log("response got", response?.data?.success);
                    if (response?.data?.success === true) {
                        // let newArr = allOrders;
                        // newArr.push(...response?.data?.AllOrders)
                        // setAllOrders(newArr)
                        dispatch(appendMoreRecentOrdersOfPartner(response?.data?.AllOrders, dispatch))
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                    setIsFetching(false)
                });
        }
    }

    // changing status
    const changeStatusOfOrder = async (id, status) => {
        const { data } = await updateSingleOrderStatusOfAnyPartner(id, status);
        if (data?.success === true) {
            dispatch(changeStatusOfAnyOrderByPartner(id, status, dispatch))
        }
    }

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all recent orders
        dispatch(getAllRecentOrdersOfPartnerEmpty(dispatch))
    };

    // emptying all data in redux related to home screen
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    return (
        <div className='partner-route'>

            <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

            <div className="partner-content">

                <Notification click={handleOpen} active={active} socket={socket} />

                <div className="p-5 partner-route-content">
                    <h1 className='partner-heading mb-4'>Recent Orders</h1>
                    <div className="orders-list">
                        {
                            isRecentOrdersFetching === true ? (
                                <h4>Fetching...</h4>
                            ) : (
                                isRecentOrdersErrorMsg !== "" ? (
                                    <h4>{isRecentOrdersErrorMsg}</h4>
                                ) : (
                                    <InfiniteScroll
                                        dataLength={allOrders?.length}
                                        next={getTopMyMoreOrders}
                                        hasMore={true}
                                        loader={isFetching === true && <h4>Loading...</h4>}
                                        style={{ overflowX: "hidden", maxWidth: "1280px", margin: "auto", minHeight: "100vh" }}
                                    >
                                        {
                                            recentOrders?.length > 0 ? (
                                                recentOrders?.map((item) => (
                                                    <div className="orders-item" key={item?._id}  >
                                                        <div className="order-left">
                                                            <div style={{ display: "flex", flexDirection: "column" }} >
                                                                <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + item?.customer?.thumbnail} style={{ borderRadius: "5px" }} alt="" />
                                                            </div>
                                                            <div className='order-details'>
                                                                <h6 style={{ color: "#3498db", fontWeight: 550, marginBottom: 0 }} >{item?.customer?.username}</h6>
                                                                <Link to={`/partner/orders/view/${item?._id}`} style={{ fontSize: "14px" }} className='order-num'>#{item?.refNo}</Link>
                                                                <p className='order-address'>
                                                                    {item?.address}
                                                                </p>
                                                                <div className="order-time" style={{ display: "flex", justifyContent: "flex-start" }} >
                                                                    <h6 style={{ color: 'black', fontSize: "14px", fontWeight: 600, color: "gray", marginRight: "5px" }} >Received Date:</h6>
                                                                    {moment(item?.createdAt).format("Do MMM YY")}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="order-time">
                                                        <h6 style={{color : 'black'}} >Delivery Date:</h6>
                                                        {moment(item?.deliveryDate).format("Do MMM YY, h:mm:ss a")}
                                                    </div> */}

                                                        <div className="order-action">
                                                            <div className="order-time" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 0 }} >
                                                                <h6 style={{ color: 'black', fontSize: "14px", fontWeight: 600, color: "gray", marginRight: "5px" }} >Delivery Date:</h6>
                                                                {moment(item?.deliveryDate).format("Do MMM YY")}
                                                            </div>
                                                            <div className="order-time" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 0 }} >
                                                                <h6 style={{ color: 'black', fontSize: "14px", fontWeight: 600, color: "gray", marginRight: "5px" }} >Amount:</h6>
                                                                <span style={{ color: "black", fontSize: "16px" }} ></span>{item?.total}
                                                            </div>
                                                            {/* <div className="order-status">
                                                            • {item?.orderStatus}
                                                        </div> */}
                                                            <div className="order-btns">
                                                                {
                                                                    item?.orderStatus == "Order Placed" && (
                                                                        <>
                                                                            <button className="order-cancel" size="sm" onClick={() => changeStatusOfOrder(item?._id, false)} >Cancel</button>
                                                                            <button className="order-accept" size="sm" onClick={() => changeStatusOfOrder(item?._id, true)} >Accept</button>
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <h4> No Recent Orders Found </h4>
                                            )
                                        }
                                    </InfiniteScroll>
                                )
                            )
                        }
                    </div>

                </div>

            </div>

        </div>
    )
}

export default PartnerOrders