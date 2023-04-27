import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector } from "react-redux"
import { getAnyOrderMyDetails } from "../api/CustomerApi"
import { toast } from 'react-toastify';
import moment from "moment"
import { Button } from 'react-bootstrap'


const CustomerOrderView = ({ socket }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    document.title = `Order Detail`

    const [singleOrder, setSingleOrder] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    // getting data of order
    const { userSignInSuccess } = useSelector(state => state.usersReducer)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            if (userSignInSuccess === false) {
                toast.error("Please Sign In to See your Orders")
                navigate("/login")
            } else {
                setIsFetching(true)
                const { data } = await getAnyOrderMyDetails(id);
                if (data?.success === true) {
                    setSingleOrder(data?.Order)
                } else {
                    toast.error(data?.message)
                }
                setIsFetching(false)
            }
        }

        getData()
    }, [userSignInSuccess])

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />

                <div className="flex justify-center" style={{ maxWidth: "1280px", margin: "auto", borderRadius: "10px" }} >
                    <h2 style={{ marginLeft: "15px", marginTop: "15px" }} >Order Details </h2>
                    <div style={{ backgroundColor: "black", color: 'white' }} >
                        <div className="orders-item" style={{ backgroundColor: "black", color: 'white', borderRadius: "10px" }}>
                            <div className="order-left">
                                <div style={{ display: "flex", flexDirection: "column" }} >
                                    <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + singleOrder?.customer?.thumbnail} alt="" style={{ minHeight: "100px", objectFit: "cover" }} />

                                </div>
                                <div className='order-details'>
                                    <h5>{singleOrder?.customer?.username}</h5>
                                    <Link to={`/partner/orders/view/${singleOrder?._id}`} className='order-num text-[10px]'>#{singleOrder?.refNo}</Link>
                                    <p className='order-address'>
                                        {singleOrder?.address}
                                    </p>
                                    <p className='order-address'>
                                        <span className="text-[white]">Delivery Date :</span> {moment(singleOrder?.deliveryDate).format("DD-MMM-YY")}
                                    </p>
                                </div>
                            </div>
                            <div className="order-action">
                                <div className=" flex flex-col " style={{ maxWidth: "150px", marginLeft: "25px", display: "flex", justifyContent: "flex-end", flexDirection: 'column' }} >
                                    <Button size="sm" style={{ marginTop: "-10px", marginBottom: "5px" }} variant="primary" target="_blank" href={"https://fivechefapp.cyclic.app" + "/orderInvoices/" + singleOrder?.invoiceUrl} >Download Invoice </Button>
                                </div>
                                <p className='order-address'>
                                    <span className="text-[white]">Ordered Date :</span> {moment(singleOrder?.createdAt).format("DD-MMM-YY")}
                                </p>
                                <div className="order-status">
                                    • {singleOrder?.orderStatus}
                                </div>
                                {/* <div className="order-btns">
                                    {
                                        singleOrder?.orderStatus === "Order Placed" && (
                                            <>
                                                <button className="order-cancel" onClick={() => changeStatusOfOrder(singleOrder?._id , false) } >Cancel</button>
                                                <button className="order-accept" onClick={() => changeStatusOfOrder(singleOrder?._id , true) } >Accept</button>
                                            </>
                                        )
                                    }
                                </div> */}
                            </div>

                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d180651.1555998931!2d-93.40156407137106!3d44.97061137424916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b333909377bbbd%3A0x939fc9842f7aee07!2sMinneapolis%2C%20MN%2C%20USA!5e0!3m2!1sen!2sma!4v1664965908642!5m2!1sen!2sma" className='w-100' style={{ height: '200px', borderRadius: '10px' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                            <h4 className='fw-bold my-3 text-[white]'  >Order Items</h4>
                            {
                                singleOrder?.products?.map((item) => (
                                    <div className="order-item">
                                        <div className="order-item-left mb-2">
                                            <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.thumbnail} alt="" />
                                            <h6 className='fw-bold mb-0'>{item?.name}</h6>
                                        </div>
                                        <div className="text-[white] fw-bold mb-2">{singleOrder?.restaurant?.name}</div>
                                        <div className="text-color-primary fw-bold mb-2 order-item-price">R {item?.subTotal}</div>
                                        <div className="text-color-primary fw-bold mb-2">Qty :{item?.qty}</div>
                                    </div>
                                ))
                            }

                            <p className='' style={{ marginLeft: "auto" }} >
                                Amount: <b>${singleOrder?.total}</b>
                            </p>

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default CustomerOrderView