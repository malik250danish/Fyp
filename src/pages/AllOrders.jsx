import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Row, Col, Button, Table, Modal } from 'react-bootstrap'
import { getSingleComplaint } from '../api/CommonApi'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { getAllOrders, appendMoreOrders, emptyAllGotOrders, addComplaintToAnyOrder, addReviewToAnyOrder, cancelSingleOrder, makeReOrderOfAnyOrder } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import { toast } from 'react-toastify';
import ReactStars from "react-rating-stars-component";
import { postNewIssueTicket } from "../api/CustomerApi"
import AllOrdersSkeleton from "../common/CustomerAllOrdersSkeleton"


const AllUbCategories = ({ socket }) => {
    const navigate = useNavigate()
    document.title = `All Orders`

    // viewing all products of order 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        //setShow(true)
        //navigate(`order-view/${selectedId}`)
    };

    // adding review modal
    const [addReviewModal, setAddReviewModal] = useState(false);
    const handleCloseAddReview = () => setAddReviewModal(false);
    const handleAddReviewModal = () => setAddReviewModal(true);

    // complaint modal
    const [addComplaintModal, setAddComplaintModal] = useState(false);
    const handleCloseAddComplaint = () => {
        setAddComplaintModal(false);
        setOwnerData({ name: "", id: "" })
    }
    const handleAddComplaintModal = () => setAddComplaintModal(true);

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

    // cancel order modal
    const [cancelOrderModal, setCancelOrderModal] = useState(false);
    const handleCloseCancelOrder = () => setCancelOrderModal(false);
    const handleCancelOrderModal = () => setCancelOrderModal(true);

    // re order modal
    const [reOrderModal, setReOrderModal] = useState(false);
    const handleCloseReOrder = () => setReOrderModal(false);
    const handleReOrderModal = () => setReOrderModal(true);

    // re order modal address modal
    const [reOrderData, setOrderData] = useState({
        address: "",
        deliveryDate: ""
    });
    const [reOrderAddressModal, setReOrderAddressModal] = useState(false);
    const handleCloseReOrderAddress = () => { setReOrderAddressModal(false); setReOrderModal(false); setOrderData({ address: "", deliveryDate: "" }) }
    const handleReOrderAddressModal = () => setReOrderAddressModal(true);

    const [allOrders, setAllOrders] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()
    const { userSignInSuccess, orders, isOrdersGettingSuccess, isOrdersErrorMsg, isOrdersFetching, userDetails } = useSelector(state => state.usersReducer)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            if (userSignInSuccess === false) {
                toast.error("Please Sign In to See your Orders")
                navigate("/login")
            } else {
                //if(orders?.length < 1){
                dispatch(getAllOrders(dispatch))
                //}
            }
        }

        getData()
    }, [userSignInSuccess])

    // getting top menus on scroll
    const getTopMyMoreOrders = async () => {
        if (userSignInSuccess === false) {
            toast.error("Please Sign In to Continue")
            navigate("/login")
        } else {
            setIsFetching(true)
            axios.get(`https://fivechefapp.cyclic.app/api/v1/orders/getAllOrdersOfAnyCustomerForWeb?skip=${allOrders.length}`)
                .then(function (response) {
                    // handle success
                    console.log("response got", response?.data?.success);
                    if (response?.data?.success === true) {
                        //let newArr = allOrders;
                        //newArr.push(...response?.data?.AllOrders)
                        //setAllOrders(newArr)
                        dispatch(appendMoreOrders(response?.data?.AllOrders, dispatch))
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

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all recent orders
        dispatch(emptyAllGotOrders(dispatch))
    };

    // emptying all data in redux related to home screen
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    const [sendingComplaint, setSendingComplaint] = useState("")
    const [selectedId, setSelectedId] = useState("")
    const [ownerData, setOwnerData] = useState({
        name: "",
        id: ""
    })

    // sending new complaint
    const addComplaintMyToAnyOrder = async () => {
        dispatch(addComplaintToAnyOrder({ orderId: selectedId, desc: sendingComplaint }, dispatch))
        handleCloseAddComplaint()
        setSendingComplaint("")

        // generating new issue ticket
        const { data } = await postNewIssueTicket({ title: sendingComplaint, desc: sendingComplaint, receiverId: ownerData.id, orderId: selectedId })
        if (data?.success === true) {
            toast.success("new complaint added")
            navigate(`/vew-single-ticket/${ownerData?.name}/${data.NewTicket._id}`)
        } else {
            toast.error(data?.message)
        }
        //navigate(`/customer-chat/${ownerData?.name}/${ownerData?.id}`)
    }

    // rating object
    const [ratingObj, setRatingObj] = useState({
        orderId: selectedId,
        rating: "",
        desc: ""
    })
    // adding rating
    const ratingChanged = (newRating) => {
        setRatingObj({ ...ratingObj, rating: newRating, orderId: selectedId })
    };
    // sending rating and review on order
    const addRatingOnMyToAnyOrder = async () => {
        if (ratingObj?.orderId == "" || ratingObj?.rating == "" || ratingObj?.desc == "") {
            toast.warning("Please fill All Required Fields")
        } else {
            dispatch(addReviewToAnyOrder(ratingObj, dispatch))
            handleCloseAddReview()
        }
    }

    // cancel single order
    const cancelMyPlacedOrder = async () => {
        dispatch(cancelSingleOrder(selectedId, dispatch))
        handleCloseCancelOrder()
    }

    // make Re Order
    const makeReOrder = async () => {
        dispatch(makeReOrderOfAnyOrder(selectedId, reOrderData, dispatch))
        handleCloseReOrderAddress()
        handleCloseReOrder()
    }
    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div className="flex justify-center" style={{ maxWidth: "1280px", margin: "auto" }} >
                    <h2 style={{ marginLeft: "15px", marginTop: "15px" }} >All Orders </h2>
                </div>
                {
                    isOrdersFetching === true ? (
                        <AllOrdersSkeleton />
                    ) : (
                        isOrdersGettingSuccess === false ? (
                            <h4>{isOrdersErrorMsg}</h4>
                        ) : (
                            <>
                                <InfiniteScroll
                                    dataLength={allOrders?.length}
                                    next={getTopMyMoreOrders}
                                    hasMore={true}
                                    loader={isFetching === true && <h4>Loading...</h4>}
                                    endMessage={
                                        <p style={{ textAlign: "center" }}>
                                            <strong>No More Orders.</strong>
                                        </p>
                                    }

                                >
                                    <div style={{ maxWidth: "1240px", margin: "auto", minHeight: "100vh" }} >
                                        <Table responsive variant="dark" style={{ marginTop: "25px", padding: "20px", borderRadius: "10px" }} >
                                            <thead style={{ borderRadius: "10px" }} >
                                                <tr>
                                                    <th>Ref. No.</th>
                                                    <th>Posted On</th>
                                                    <th>Delivery Date</th>
                                                    <th>Restaurant</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>View</th>
                                                    <th>Complaint</th>
                                                    <th>Review</th>
                                                    <th>Cancel</th>
                                                    {/* <th>Re-Order</th> */}
                                                    <th>Chat</th>
                                                    {/* <th>Invoice</th> */}
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {
                                                    orders?.length > 0 ? (
                                                        orders?.map((item) => (
                                                            <>
                                                                <tr>
                                                                    <td>{item?.refNo}</td>
                                                                    <td>{moment(item?.createdAt).format("DD-MMM-YY")}</td>
                                                                    <td>{moment(item?.deliveryDate).format("DD-MMM-YY")}</td>
                                                                    <td>{item?.restaurant?.name}</td>
                                                                    <td  >{item?.total?.toFixed(2)}</td>
                                                                    <td  >
                                                                        {
                                                                            item?.isCancelledByCustomer === true ? (
                                                                                <p style={{ color: "crimson" }} >cancelled By You</p>
                                                                            ) : (
                                                                                item?.orderStatus
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <Button size="sm" variant="info" style={{ fontSize: "10.5px" }} onClick={() => { setAllProducts(item?.products); navigate(`/order-view/${item?._id}`); handleShow() }} >Details</Button>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item?.isAccepted == true ? (
                                                                                item?.isComplaintAdded == true ? (
                                                                                    <Button size="sm" variant="info" style={{ fontSize: "9.5px" }} onClick={() => navigate(`/vew-single-ticket/${item?.owner?.name}/${item?.complaintId?._id}`)} >View Complaint</Button>
                                                                                ) : (
                                                                                    <Button size="sm" variant="danger" style={{ fontSize: "9.5px" }} onClick={() => { handleAddComplaintModal(); setSelectedId(item?._id); setOwnerData({ id: item?.owner?._id, name: item?.owner?.username }) }} >Add Complaint</Button>
                                                                                )
                                                                            ) : (
                                                                                null
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item?.isDelivered === true ? (
                                                                                item?.isReviewAdded === true ? (
                                                                                    item?.rating
                                                                                ) : (
                                                                                    <Button size="sm" style={{ fontSize: "10.5px" }} variant="primary" onClick={() => { handleAddReviewModal(); setSelectedId(item?._id) }} >Post Review</Button>
                                                                                )
                                                                            ) : (
                                                                                <p>N/A</p>
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item?.isCancelledByCustomer === false && item?.isCancelledByPartner === false && item?.isAccepted === true && item?.isDelivered === false ? (
                                                                                <Button size="sm" style={{ fontSize: "10.5px" }} variant="danger" onClick={() => { handleCancelOrderModal(); setSelectedId(item?._id) }} >Cancel Order</Button>
                                                                            ) : (
                                                                                item?.isCancelledByCustomer === true && item?.isCancelledByPartner === true ? (
                                                                                    <p style={{ color: 'crimson', fontWeight: 600, fontSize: "13px" }} >Cancelled</p>
                                                                                ) : (
                                                                                    <p>N/A</p>
                                                                                )
                                                                            )
                                                                        }
                                                                    </td>
                                                                    {/* <td>
                                                                {
                                                                    item?.isDelivered === true || item?.isCancelledByCustomer === true ? (
                                                                        <Button size="sm" variant="success" onClick={() => {handleReOrderModal() ; setSelectedId(item?._id); setOrderData({deliveryDate : moment(item?.deliveryDate).format("YYYY-MM-DD") , address : item?.address})}}  >Order Again</Button>
                                                                    ) : (
                                                                        <p>N/A</p>
                                                                    )
                                                                }
                                                            </td> */}
                                                                    <td>
                                                                        {
                                                                            item?.isAccepted === true ? (
                                                                                <Button variant="primary" style={{ fontSize: "10.5px" }} size="sm" onClick={() => navigate(`/customer-chat/${item?.owner?.username}/${item?.owner?._id}`)} >Chat Now</Button>
                                                                            ) : (
                                                                                <p>N/A</p>
                                                                            )
                                                                        }

                                                                    </td>
                                                                    {/* <td>
                                                                {
                                                                    item?.invoiceUrl !== "" ? (
                                                                        <Button size="sm" variant="primary" target="_blank" href={"https://fivechefapp.cyclic.app" + "/orderInvoices/" + item?.invoiceUrl } >Download </Button>
                                                                    ) : (
                                                                        <p>N/A</p>
                                                                    )
                                                                }
                                                            </td> */}
                                                                </tr>

                                                            </>
                                                        ))
                                                    ) : (
                                                        <h4> No Orders Posted by You Yet </h4>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </InfiniteScroll>
                            </>
                        )
                    )
                }

                {/* view all products of order */}
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                >
                    <Modal.Header closeButton style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Modal.Title>Order Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
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
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* adding review on any order */}
                <Modal
                    show={addReviewModal}
                    onHide={handleCloseAddReview}
                    backdrop="static"
                    keyboard={false}
                    size="md"
                >
                    <Modal.Header closeButton style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Modal.Title>Add Your Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <h4>Rating : </h4>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={100}
                                isHalf={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                                activeColor="#ffd700"
                            />
                            <h4 style={{ marginTop: "10px" }} >Review:</h4>
                            <textArea rows="5" placeholder="Type your Review ...." style={{ padding: "10px", borderRadius: "10px" }} value={ratingObj?.desc} onChange={(e) => setRatingObj({ ...ratingObj, desc: e.target.value })} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="success" onClick={addRatingOnMyToAnyOrder} >
                            Post Now
                        </Button>
                        <Button variant="danger" onClick={handleCloseAddReview}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* adding complaint on any order */}
                <Modal
                    show={addComplaintModal}
                    onHide={handleCloseAddComplaint}
                    backdrop="static"
                    keyboard={false}
                    size="md"
                >
                    <Modal.Header closeButton style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Modal.Title>Add Your Complaint</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <p style={{ fontSize: '11px', color: "#74b9ff" }} >(We are sorry for any problem you faced, We will try to solve your issue.) </p>
                            <h4 style={{ marginTop: "10px" }} >Write Problem You Faced:</h4>
                            <textArea rows="8" placeholder="Type Your Issue  ...." style={{ padding: "10px", borderRadius: "10px" }} value={sendingComplaint} onChange={(e) => setSendingComplaint(e.target.value)} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="success" onClick={addComplaintMyToAnyOrder} >
                            Post Now
                        </Button>
                        <Button variant="danger" onClick={handleCloseAddComplaint}>
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
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }} >
                            <Button variant="info" style={{ color: "white" }} onClick={() => navigate(`/customer-chat/${ownerData?.name}/${ownerData?.id}`)} >View All Chat</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="danger" onClick={handleCloseGetComplaint}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* cancel any order */}
                <Modal
                    show={cancelOrderModal}
                    onHide={handleCloseCancelOrder}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                >
                    <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <h3 style={{ marginTop: "10px", color: "crimson" }} >Are You Sure, You want to Cancel this Order?</h3>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="danger" onClick={cancelMyPlacedOrder} >
                            Yes
                        </Button>
                        <Button variant="info" onClick={handleCloseCancelOrder}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* re order any order */}
                <Modal
                    show={reOrderModal}
                    onHide={handleCloseReOrder}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                >
                    <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <h3 style={{ marginTop: "10px", color: "#74b9ff" }} >Are You Sure, You want to Re Order this Order?</h3>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="success" onClick={handleReOrderAddressModal} >
                            Yes
                        </Button>
                        <Button variant="danger" onClick={handleCloseReOrder}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* re order address asking */}
                <Modal
                    show={reOrderAddressModal}
                    onHide={handleCloseReOrderAddress}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                >
                    <Modal.Body style={{ backgroundColor: "#1F1F1F", color: "white" }} >
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <h5 style={{ marginTop: "10px", color: "#74b9ff" }} >Please Confirm Delivery Address for this Order:</h5>
                            <input value={reOrderData?.address} onChange={(e) => setOrderData({ ...reOrderData, address: e.target.value })} style={{ padding: "10px", borderRadius: "10px" }} />
                            <h5 style={{ marginTop: "10px", color: "#74b9ff" }} >Please Confirm Delivery Date for this Order:</h5>
                            <input type="date" value={reOrderData?.deliveryDate} onChange={(e) => setOrderData({ ...reOrderData, deliveryDate: e.target.value })} style={{ padding: "10px", borderRadius: "10px" }} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                        <Button variant="success" onClick={makeReOrder} >
                            Place Order
                        </Button>
                        <Button variant="danger" onClick={handleCloseReOrderAddress}>
                            Dismiss
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Footer />
            </div>
        </>
    )
}

export default AllUbCategories