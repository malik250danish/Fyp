import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, Table, Modal, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllOrdersOfAnyPartner, getAnyOrderMyDetails } from "../api/PartnerApi"
import Cookies from 'universal-cookie';
import moment from "moment"


const PartnerViewAllMenus = ({ socket }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    document.title = `Orders Calender`

    const handleOpen = () => {
        setActive(!active)
    }

    const [allOrders, setAllOrders] = useState(null)
    const [singleRecord, setSingleRecord] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                toast.error("Please Sign In to See your Orders")
                navigate("/partner/login")
            } else {
                const { data } = await getAllOrdersOfAnyPartner();
                if (data?.success === true) {
                    setAllOrders(data?.AllOrders)
                } else {
                    toast.error(data?.message)
                }
            }
        }

        getData()
    }, [isPartnerSignInSuccess])

    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // getting order details
    const handleDateClick = async (id) => {
        const { data } = await getAnyOrderMyDetails(id);
        if (data?.success === true) {
            setSingleRecord(data?.Order)
            handleShow()
        }
    };


    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <h1 className='partner-heading mb-4'>Calender</h1>
                        </div>
                        {
                            isFetching === true ? (
                                <h4>Fetching...</h4>
                            ) : (
                                <>
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView='dayGridMonth'
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                                        }}
                                        nowIndicator
                                        weekends={true}
                                        events={
                                            allOrders?.length > 0 ? (
                                                allOrders?.map((item) => {
                                                    return {
                                                        id: item._id,
                                                        title: item?.refNo,
                                                        start: item?.createdAt,
                                                        date: item?.deliveryDate,
                                                    };
                                                })
                                            ) : (
                                                null
                                            )
                                        }
                                        eventClick={(e) => handleDateClick(e.event.id)}
                                    />
                                </>
                            )
                        }

                    </div>
                </div>
            </div>

            {/* View order modal */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                style={{ minWidth: "100%" }}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", padding: "20px" }} >
                        <h5 style={{ marginBottom: "5px", marginRight: "-55px" }} >Order No : </h5> {singleRecord?.refNo}
                        <h5 style={{ marginBottom: "5px", marginRight: "-55px" }} >Order Status : </h5> {singleRecord?.orderStatus}
                        <h5 style={{ marginBottom: "5px", marginRight: "-55px" }} >Due Date : </h5> {moment(singleRecord?.deliveryDate).format("DD-MMM-YY")}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }} >
                        <h5 style={{ marginBottom: "5px", marginRight: "-55px" }} >Amount : </h5> {singleRecord?.total}
                        <h5 style={{ marginBottom: "5px", marginRight: "-55px" }} >Address : </h5> {singleRecord?.address}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", padding: "20px" }} >
                        <div style={{ display: "flex", justifyContent: "flex-start", maxWidth: "48%", flexDirection: "column" }} >
                            <h5>Customer: </h5>
                            <div style={{ display: "flex", justifyContent: "space-between", }}>
                                <img alt="restaurant image" style={{ maxWidth: "70px", maxHeight: "70px", borderRadius: "10px" }} src={"https://fivechefapp.cyclic.app" + "/customerImages/" + singleRecord?.customer?.thumbnail} />
                                <h5 style={{ marginTop: "20px", marginLeft: "5px" }} >{singleRecord?.customer?.username}</h5>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "48%", flexDirection: "column" }} >
                            <h5>Restaurant: </h5>
                            <div style={{ display: "flex", justifyContent: "flex-start", }}>
                                <img alt="restaurant image" style={{ maxWidth: "70px", maxHeight: "70px", borderRadius: "10px" }} src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + singleRecord?.restaurant?.logo} />
                                <h5 style={{ marginTop: "20px", marginLeft: "5px" }}>{singleRecord?.restaurant?.name}</h5>
                            </div>
                        </div>
                    </div>
                    <h4 >Products:</h4>
                    <Row style={{ marginBottom: "20px", padding: "20px" }}>
                        <Col xs={2} sm={2} md={2} lg={2} >
                            Image
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3} >
                            Name
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} >
                            Price
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} >
                            Qty
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3} >
                            Sub Total
                        </Col>
                    </Row>
                    {
                        singleRecord?.products?.map((item) => (
                            <>
                                <Row key={item?._id} style={{ marginBottom: "20px" }} >
                                    <Col xs={2} sm={2} md={2} lg={2} >
                                        <img style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} alt="product image" src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.thumbnail} />
                                    </Col>
                                    <Col xs={3} sm={3} md={3} lg={3} >
                                        {item?.name}
                                    </Col>
                                    <Col xs={2} sm={2} md={2} lg={2} >
                                        {item?.price}
                                    </Col>
                                    <Col xs={2} sm={2} md={2} lg={2} >
                                        {item?.qty}
                                    </Col>
                                    <Col xs={3} sm={3} md={3} lg={3} >
                                        {item?.subTotal}
                                    </Col>
                                </Row>
                                <hr />
                            </>
                        ))
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default PartnerViewAllMenus