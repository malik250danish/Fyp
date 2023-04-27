import React, { useState, useEffect } from 'react'
import Notification from '../components/Notification'
import Sidebar from '../components/Sidebar'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { updateSingleOrderStatusOfAnyPartner } from "../api/PartnerApi"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import { getAnyOrderMyDetails } from "../api/PartnerApi"
import { changeStatusOfAnyOrderByPartner } from "../redux/actions/PartnerActions"
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { Button } from "react-bootstrap"

const PartnerOrdersView = ({ socket }) => {
    const cookies = new Cookies();
    const [active, setActive] = useState(false)

    const handleOpen = () => {
        setActive(!active)
    }

    const { id } = useParams();
    const navigate = useNavigate()

    const [singleOrder, setSingleOrder] = useState(null)
    const dispatch = useDispatch()
    const { isPartnerSignInSuccess, partnerOrders } = useSelector(state => state.partnerReducer)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                navigate("/partner/login")
            } else {
                //const isFound = partnerOrders.find(item => item._id == id);
                const { data } = await getAnyOrderMyDetails(id)
                if (data?.success === true) {
                    setSingleOrder(data?.Order)
                } else {
                    toast.error(data?.message)
                }
            }
        }
        getData()

        // clean up function
        return () => {
            setSingleOrder(null)
        }
    }, [id])

    // changing status
    const changeStatusOfOrder = async (id, status) => {
        const { data } = await updateSingleOrderStatusOfAnyPartner(id, status);
        if (data?.success === true) {
            dispatch(changeStatusOfAnyOrderByPartner(id, status, dispatch))
            let newObj = singleOrder;
            if (status == true) {
                newObj.orderStatus = "Accepted"
            } else {
                newObj.orderStatus = "Declined"
            }
            setSingleOrder(newObj)
        }
    }

    return (
        <div className='partner-route'>

            <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

            <div className="partner-content">

                <Notification click={handleOpen} active={active} socket={socket} />

                <div className="p-5 partner-route-content">

                    <h1 className='partner-heading mb-4'>Orders</h1>

                    <div className="orders-list">

                        <div className="orders-item">
                            <div className="order-left">
                                <div style={{ display: "flex", flexDirection: "column" }} >
                                    <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + singleOrder?.customer?.thumbnail} alt="" />

                                </div>
                                <div className='order-details'>
                                    <h5>{singleOrder?.customer?.username}</h5>
                                    <Link to={`/partner/orders/view/${singleOrder?._id}`} className='order-num text-[10px]'>#{singleOrder?.refNo}</Link>
                                    <p className='order-address'>
                                        {singleOrder?.address}
                                    </p>
                                    <p className='order-address'>
                                        Delivery Date : {moment(singleOrder?.deliveryDate).format("DD-MMM-YY h:mm:ss a")}
                                    </p>

                                </div>
                            </div>
                            {/* <div className="order-time">
                            {moment(singleOrder?.createdAt).format("DD-MMM-YY h:mm:ss a")}
                        </div> */}

                            {/* <div className="order-price">
                        </div> */}
                            <div className="order-action">
                                <p className='order-address'>
                                    Ordered Date : {moment(singleOrder?.createdAt).format("DD-MMM-YY h:mm:ss a")}
                                </p>
                                <p className='order-address'>
                                    Amount: <b style={{ fontSize: "16px", color: "black" }} >${singleOrder?.total.toFixed(2)}</b>
                                </p>
                                <div className="order-status">
                                    • {singleOrder?.orderStatus}
                                </div>

                                <div className="order-btns">
                                    {
                                        singleOrder?.orderStatus === "Order Placed" && (
                                            <>
                                                <button className="order-cancel" onClick={() => changeStatusOfOrder(singleOrder?._id, false)} >Cancel</button>
                                                <button className="order-accept" onClick={() => changeStatusOfOrder(singleOrder?._id, true)} >Accept</button>
                                            </>
                                        )
                                    }
                                </div>

                            </div>

                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d180651.1555998931!2d-93.40156407137106!3d44.97061137424916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b333909377bbbd%3A0x939fc9842f7aee07!2sMinneapolis%2C%20MN%2C%20USA!5e0!3m2!1sen!2sma!4v1664965908642!5m2!1sen!2sma" className='w-100' style={{ height: '200px', borderRadius: '10px' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                            {/* <div className="order-action"> */}
                            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: "20px", marginBottom: "20px" }} >
                                <Button size="sm" variant="primary" target="_blank" href={"https://fivechefapp.cyclic.app" + "/orderInvoices/" + singleOrder?.invoiceUrl} >Download Invoice </Button>
                            </div>
                            {/* </div> */}
                        </div>
                        <div className="orders-item" style={{ marginTop: 0 }}>
                            <h4 className='fw-bold my-3 order-items-heading' style={{ marginTop: "30px" }} >Order Items</h4>
                            {
                                singleOrder?.products?.map((item) => (
                                    <div className="order-item">
                                        <div className="order-item-left mb-2">
                                            <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.thumbnail} alt="" />
                                            <h6 className='fw-bold mb-0'>{item?.name}</h6>
                                        </div>
                                        <div className="text-secondary fw-bold mb-2">{singleOrder?.restaurant?.name}</div>
                                        <div className="text-color-primary fw-bold mb-2 order-item-price">R {item?.subTotal}</div>
                                        <div className="text-color-primary fw-bold mb-2">Qty :{item?.qty}</div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default PartnerOrdersView