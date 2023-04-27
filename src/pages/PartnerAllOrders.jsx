import React, { useState, useEffect } from 'react'
import Notification from '../components/Notification'
import Sidebar from '../components/Sidebar'
import avatar1 from '../assets/img/avatar1.svg'
import avatar2 from '../assets/img/avatar2.svg'
import { Link, useNavigate } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component";
import { getSingleComplaint } from '../api/CommonApi'
import axios from "axios"
import { appendMoreOrdersOfPartner, getAllOrdersOfPartner, getAllOrdersOfPartnerEmpty, changeStatusOfAnyOrderFromAllOrderPage } from "../redux/actions/PartnerActions"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import { updateSingleOrderStatus, getSingleReviewDetails, updateSingleReviewStatus } from "../api/PartnerApi"
import { Row, Col, Table, Button, Dropdown, Modal } from "react-bootstrap"
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

const PartnerOrders = ({ socket }) => {
    const cookies = new Cookies();
    const [active, setActive] = useState(false)
    const navigate = useNavigate()

    const handleOpen = () => {
        setActive(!active)
    }

    const [allOrders, setAllOrders] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()
    const { isPartnerSignInSuccess, isPartnerOrdersFetching, isPartnerOrdersErrorMsg, partnerOrders } = useSelector(state => state.partnerReducer)


    // getting all related products
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                navigate("/partner/login")
            } else {
                //if(partnerOrders?.length < 1){
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
                        dispatch(appendMoreOrdersOfPartner(response?.data?.AllOrders, dispatch))
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

    // viewing all products of order 
    const [selectedId, setSelectedId] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [allProducts, setAllProducts] = useState([])

    // adding review modal
    const [addReviewModal, setAddReviewModal] = useState(false);
    const handleCloseAddReview = () => setAddReviewModal(false);
    const handleAddReviewModal = () => setAddReviewModal(true);

    // view Review modal
    const [isReviewFetching, setIsReviewFetching] = useState(false);
    const [reviewData, setReviewData] = useState(null);
    const [viewReviewModal, setViewReviewModal] = useState(false);
    const handleCloseViewReview = () => setViewReviewModal(false);
    const handleViewReviewModal = async (id) => {
        setViewReviewModal(true);
        setIsReviewFetching(true)
        const { data } = await getSingleReviewDetails(id);
        if (data?.success === true) {
            setReviewData(data?.Review)
        }
        setIsReviewFetching(false)
    }

    // get complaint on any order modal
    const [complaintData, setComplaintData] = useState("")
    const [getComplaintModal, setGetComplaintModal] = useState(false);
    const handleCloseGetComplaint = () => setGetComplaintModal(false);
    const handleGetComplaintModal = async (id) => {
        setGetComplaintModal(true)
        const { data } = await getSingleComplaint(id);

        if (data?.success === true) {
            setComplaintData(data?.Complaint?.desc)
        } else {
            toast.error(data?.message)
        }
    }

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all recent orders
        dispatch(getAllOrdersOfPartnerEmpty(dispatch))
    };

    // emptying all data in redux related to home screen
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    // changing status
    const updateMyOrderStatus = async (id, status) => {
        dispatch(changeStatusOfAnyOrderFromAllOrderPage({ id, status }, dispatch))
    }

    // changing review of single review
    const updateMySingleReviewStatus = async () => {
        const { data } = await updateSingleReviewStatus(reviewData?._id);
        if (data?.success === true) {
            toast.success("Operation SuccessFull")
            handleCloseViewReview()
        } else {
            toast.error(data?.message)
        }
    }


    return (
        <>
            <div className='partner-route'>

                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">

                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <h1 className='partner-heading mb-4'>All Orders</h1>
                        {
                            isPartnerOrdersFetching === true ? (
                                <h4>Fetching...</h4>
                            ) : (
                                isPartnerOrdersErrorMsg !== "" ? (
                                    <h4>{isPartnerOrdersErrorMsg}</h4>
                                ) : (
                                    <InfiniteScroll
                                        dataLength={allOrders?.length}
                                        next={getTopMyMoreOrders}
                                        hasMore={true}
                                        loader={isFetching === true && <h4>Loading...</h4>}
                                        style={{ overflowX: "hidden", maxWidth: "1280px", margin: "auto", minHeight: "100vh" }}
                                    >
                                        <Table responsive striped bordered hover style={{ marginTop: "25px" }} >
                                            <thead  >
                                                <tr>
                                                    <th>Ref. No.</th>
                                                    <th>Customer</th>
                                                    <th>Posted</th>
                                                    <th>Delivery</th>
                                                    <th>Total</th>
                                                    {/* <th>Status</th> */}
                                                    {/* <th>Products</th> */}
                                                    <th>Complaint</th>
                                                    <th>Review</th>
                                                    <th>Chat</th>
                                                    <th>Action</th>
                                                    <th>Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {
                                                    partnerOrders?.length > 0 ? (
                                                        partnerOrders?.map((item) => (
                                                            <tr key={item?._id} style={{ cursor: "pointer" }}>
                                                                <td style={{ color: "#0984e3", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}  >
                                                                    <Link to={`/partner/orders/view/${item?._id}`} className='order-num' style={{ fontSize: "13px" }} >
                                                                        #{item?.refNo}
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <div className="order-left">
                                                                        <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + item?.customer?.thumbnail} style={{ maxWidth: "30px", maxHeight: "30px", borderRadius: "50%" }} alt="" />
                                                                        <div className='order-details'>
                                                                            <h6>{item?.customer?.username}</h6>
                                                                            <p className='order-address'>
                                                                                {item?.address}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {moment(item?.createdAt).format("DD-MMM-YY")}
                                                                </td>
                                                                <td>
                                                                    {moment(item?.deliveryDate).startOf('day').fromNow()}
                                                                </td>
                                                                <td>
                                                                    {item?.total}
                                                                </td>
                                                                {/* <td>
                                                                {item?.orderStatus}
                                                            </td> */}
                                                                {/* <td>
                                                                <Button variant="info" onClick={() => {setAllProducts(item?.products); handleShow()}} >Details</Button>
                                                            </td> */}
                                                                <td>
                                                                    {
                                                                        item?.isComplaintAdded === true ? (

                                                                            <Button variant="danger" size="sm" onClick={() => navigate(`/vew-single-ticket/${item?.owner?.name}/${item?.complaintId?._id}`)} >View</Button>

                                                                        ) : (
                                                                            <p>N/A</p>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item?.isReviewAdded === true ? (
                                                                            <div style={{ display: "flex", flexDirection: 'column' }} >
                                                                                {item?.rating}
                                                                                <Button size="sm" variant="info" onClick={() => { handleViewReviewModal(item?._id) }} >View</Button>
                                                                            </div>
                                                                        ) : (
                                                                            <p>N/A</p>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <Button variant="primary" size="sm" onClick={() => navigate(`/partner-chat/${item?.customer?.username}/${item?.customer?._id}`)} >Chat Now</Button>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item?.isCancelledByCustomer === false ? (
                                                                            <Dropdown size="sm">
                                                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                                                    {item?.orderStatus}
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu>
                                                                                    <Dropdown.Item onClick={() => updateMyOrderStatus(item?._id, "Pending")} >Pending</Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => updateMyOrderStatus(item?._id, "Accepted")} >Accepted</Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => updateMyOrderStatus(item?._id, "Declined")} >Declined</Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => updateMyOrderStatus(item?._id, "Traveling")} >Traveling</Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => updateMyOrderStatus(item?._id, "Delivered")} >Delivered</Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        ) : (
                                                                            <p>N/A</p>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item?.invoiceUrl !== "" ? (
                                                                            <Button size="sm" variant="primary" target="_blank" href={"https://fivechefapp.cyclic.app" + "/orderInvoices/" + item?.invoiceUrl} >Download </Button>
                                                                        ) : (
                                                                            <p>N/A</p>
                                                                        )
                                                                    }
                                                                </td>
                                                            </tr>

                                                        ))
                                                    ) : (
                                                        <h4> No Orders Found </h4>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </InfiniteScroll>
                                )
                            )
                        }

                    </div>

                </div>

            </div>

            {/* view all products of order */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton >
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body  >
                    <Row>
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
                        allProducts?.map((item) => (
                            <>
                                <Row key={item?._id} style={{ marginBottom: "20px" }} >
                                    <Col xs={2} sm={2} md={2} lg={2} >
                                        <img style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} alt="product image" src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.image} />
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
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* view complaint on any order */}
            <Modal
                show={getComplaintModal}
                onHide={handleCloseGetComplaint}
                backdrop="static"
                keyboard={false}
                size="md"
            >
                <Modal.Header closeButton style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <Modal.Title>View Your Complaint</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                        <textArea rows="8" placeholder="Type Your Issue  ...." style={{ padding: "10px", borderRadius: "10px" }}  >{complaintData} </textArea>
                    </div>
                    {/* <div style={{display : "flex" , justifyContent  : "center" , marginTop : "20px" }} >
                    <Button variant="info" style={{color : "white"}} onClick={() => navigate(`/vew-single-ticket/${item?.owner?.name}/${item?.complaintId?._id}`)} >View Messages</Button>
                </div> */}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <Button variant="danger" onClick={handleCloseGetComplaint}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* view Review on any order */}
            <Modal
                show={viewReviewModal}
                onHide={handleCloseViewReview}
                backdrop="static"
                keyboard={false}
                size="md"
            >
                <Modal.Header closeButton style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <Modal.Title>View Review </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                    {
                        isReviewFetching === true ? (
                            <h6>Fetching....</h6>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "center", justifyContent: "flex-start" }} >
                                    <h6>Rating :</h6>
                                    <h4 style={{ marginLeft: "20px" }} >{reviewData?.rating}</h4>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                                    <h6>Description :</h6>
                                    <textArea rows="8" placeholder="Type Your Issue  ...." style={{ padding: "10px", borderRadius: "10px" }}  >
                                        {reviewData?.desc}
                                    </textArea>
                                </div>
                                {/* <div style={{display : "flex" , marginTop : "25px"  , minWidth : "100%" , justifyContent: "center" ,  flexDirection : "column"}} >
                                {
                                    reviewData?.status === true ? (
                                        <Button variant="danger" style={{maxWidth : "100px"}} onClick={updateMySingleReviewStatus} >Hide </Button>
                                    ) : (
                                        <Button variant="primary" style={{maxWidth : "100px"}} onClick={updateMySingleReviewStatus} >Un Hide </Button>
                                    )
                                }
                            </div> */}
                            </>
                        )
                    }
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <Button variant="danger" onClick={handleCloseViewReview}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default PartnerOrders