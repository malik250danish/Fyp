import React, { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Row, Col, Dropdown, DropdownButton, ButtonGroup, Button, Modal, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { getAllTicketsForCustomers, appendMoreTicketsData, emptyTicketsData, addNewIssueToTicketsData, getAllTicketsWithFilters, getAllUnFilteredTickets } from '../redux/actions/TicketsActions'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { postNewIssueTicket } from "../api/CustomerApi"
import { toast } from 'react-toastify';
import { getAllTicketsOfACustomer } from "../api/CustomerApi"


const ForumsListing = ({ socket }) => {
    const navigate = useNavigate()
    document.title = " All Issue Tickets"

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [allMyTickets, setAllMyTickets] = useState([])

    const dispatch = useDispatch()
    const { isAllTicketsFetching, isGetAllTicketsErrorMsg, isGetAllTicketsSuccess, allTickets } = useSelector(state => state.ticketsReducer)
    const { userSignInSuccess } = useSelector(state => state.usersReducer)
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    // getting all tickets
    useEffect(() => {
        const getAllData = async () => {
            // if(userSignInSuccess === false){
            //     toast.warning("Please Sign In to Continue")
            //     navigate("/partner/login")
            // }else{
            if (allTickets?.length < 1) {
                dispatch(getAllTicketsForCustomers(dispatch))
            }
            // }
            // if(userSignInSuccess === true){
            //     const {data} = await getAllTicketsOfACustomer()
            //     console.log("data oif all tickets : ", data)
            //     setAllMyTickets(data?.AllIssueTickets)
            // }else{
            //     setAllMyTickets()
            // }

        }

        getAllData()
    }, [])

    // getting top menus on scroll
    const getTopMyAllTicketsMore = async () => {
        axios.get(`https://fivechefapp.cyclic.app/api/v1/tickets/getAllIssueTickets?skip=${allTickets.length}&category=${category}`, { withCredentials: true, })
            .then(function (response) {
                // handle success
                console.log("response got", response?.data?.success);
                if (response?.data?.success === true) {
                    // appending new data
                    dispatch(appendMoreTicketsData(response?.data?.AllIssueTickets, dispatch))
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    // emptying all arrays fetched on reload.
    const emptyAllData = (e) => {
        // emptying all tickets data
        dispatch(emptyTicketsData(dispatch))
    };

    useEffect(() => {
        window.addEventListener("beforeunload", emptyAllData);
        return () => {
            window.removeEventListener("beforeunload", emptyAllData);
        };
    }, []);

    const [category, setCategory] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState("");
    const [userData, setData] = useState({
        title: "",
        desc: "",
        category: ""
    })

    // posting new ticket issue
    const sendData = async () => {
        setIsSending(true)
        const { data } = await postNewIssueTicket(userData);
        if (data?.success === true) {
            dispatch(addNewIssueToTicketsData(data?.NewTicket, dispatch))
            setIsError("")
            handleClose()
        } else {
            setIsError(data?.message)
        }
        setIsSending(false)
    }

    // getting data on changing category
    useMemo(async () => {
        if (category?.length < 1) {
            dispatch(getAllUnFilteredTickets(dispatch))
        } else {
            axios.get(`https://fivechefapp.cyclic.app/api/v1/tickets/getAllIssueTickets?skip=${0}&category=${category}`, { withCredentials: true, })
                .then(function (response) {
                    // handle success
                    if (response?.data?.success === true) {
                        // getting new data
                        dispatch(getAllTicketsWithFilters(response?.data?.AllIssueTickets, dispatch))
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }
    }, [category])

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ maxWidth: "1240px", marginTop: "35px", margin: "auto" }} >

                    {/* Tickets Main Heading */}
                    <Row style={{ display: "flex", marginTop: "35px", padding: "10px" }} >
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <h2 style={{ display: "flex", justifyContent: "center" }} >All Ticket Issues</h2>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            {
                                isPartnerSignInSuccess === true || userSignInSuccess === true && (
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }} >
                                        <Button variant="danger" size="sm" onClick={handleShow} >Post New</Button>
                                    </div>
                                )
                            }
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                <DropdownButton
                                    as={ButtonGroup}
                                    variant="info"
                                    title="Select Category"
                                    style={{ color: "white", backgroundColor: "black" }}
                                >
                                    <Dropdown.Item eventKey="1" style={{ color: "white", backgroundColor: "black" }} active onClick={() => setCategory("Service Request")} >Service Request</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" style={{ color: "white", backgroundColor: "black" }} onClick={() => setCategory("Incident Ticket")} >Incident Ticket</Dropdown.Item>
                                    <Dropdown.Item eventKey="3" style={{ color: "white", backgroundColor: "black" }} onClick={() => setCategory("Problem Ticket")} >Problem Ticket</Dropdown.Item>
                                    <Dropdown.Item eventKey="4" style={{ color: "white", backgroundColor: "black" }} onClick={() => setCategory("Change Request")} >Change Request</Dropdown.Item>
                                </DropdownButton>
                                {
                                    category !== "" && (
                                        <Button variant="danger" style={{ marginTop: "8px" }} onClick={() => setCategory("")} >Clear Filters</Button>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>

                    {/* Tickets Heading */}
                    <Row style={{ marginTop: "30px", }} >
                        <Col xs={4} sm={8} md={8} lg={8} >
                            <p style={{ paddingLeft: "15px", color: "#0984e3" }}>Title</p>
                        </Col>
                        <Col xs={8} sm={6} md={4} lg={4} >
                            <Row>
                                <Col xs={4} sm={4} >
                                    <p style={{ color: "#0984e3" }} >Creator</p>
                                </Col>
                                <Col xs={4} sm={4} >
                                    <p style={{ color: "#0984e3" }}>Category</p>
                                </Col>
                                <Col xs={4} sm={4} >
                                    <p style={{ color: "#0984e3" }}>Status</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* All Tickets */}
                    <InfiniteScroll
                        dataLength={allTickets.length}
                        next={getTopMyAllTicketsMore}
                        hasMore={true}
                        loader={isAllTicketsFetching === true && <h4>Loading...</h4>}
                        style={{ overflowX: "hidden", minHeight: "100vh" }}
                    >
                        {
                            isAllTicketsFetching === true ? (
                                <h4>Fetching ...</h4>
                            ) : (
                                isGetAllTicketsSuccess === false ? (
                                    <h4>
                                        {
                                            isGetAllTicketsErrorMsg?.length > 0 ? isGetAllTicketsErrorMsg : "Could not get Data, please reload to try again"
                                        }
                                    </h4>
                                ) : (
                                    allTickets?.length > 0 ? (
                                        allTickets?.map((item, index) => (
                                            <Row style={{ marginTop: "30px" }} key={item?._id} >
                                                <Col xs={6} sm={8} >
                                                    <p style={{ textOverflow: "ellipsis", overflow: "hidden", cursor: "pointer", paddingLeft: "5px" }} onClick={() => navigate(`/vew-single-ticket/${item?.title}/${item?._id}`)} >{item?.title}</p>
                                                </Col>
                                                <Col xs={6} sm={4} >
                                                    <Row>
                                                        <Col xs={4} sm={4} >
                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "-50px" }} >
                                                                <img alt="user thumbnail" style={{ maxWidth: "30px", maxHeight: "30px", borderRadius: "50%" }} src={"https://fivechefapp.cyclic.app" + "/customerImages/" + item?.creatorId?.profilePic} />
                                                                <h6>{item?.creatorId?.username}</h6>
                                                            </div>
                                                        </Col>
                                                        <Col xs={4} sm={4} >
                                                            <h6 style={{ textOverflow: "ellipsis", overflow: "hidden", }} >{item?.category}</h6>
                                                        </Col>
                                                        <Col xs={4} sm={4} >
                                                            {
                                                                item?.status === true ? (
                                                                    <h6 style={{ color: "#55efc4", textOverflow: "ellipsis", overflow: "hidden", }} >
                                                                        Resolved
                                                                    </h6>
                                                                ) : (
                                                                    <h6 style={{ color: "crimson", textOverflow: "ellipsis", overflow: "hidden", }} >
                                                                        Un-Resolved
                                                                    </h6>
                                                                )

                                                            }
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ))
                                    ) : (
                                        <h4>No Tickets Found</h4>
                                    )
                                )
                            )
                        }
                    </InfiniteScroll>
                </div>
                <Footer />

                {/* Add new Ticket modal */}
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Post New Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: "flex", flexDirection: "column" }} >
                            {
                                isError !== "" && (
                                    <h5>{isError}</h5>
                                )
                            }
                            <h6>Select Issue Type</h6>
                            <Form.Select size="sm" onChange={(e) => setData({ ...userData, category: e.target.value })} >
                                <option>Service Request</option>
                                <option>Incident Ticket</option>
                                <option>Problem Ticket</option>
                                <option>Change Request</option>
                            </Form.Select>
                            <h6 style={{ marginTop: "20px" }} >Add any Title:</h6>
                            <input type="text" placeholder="Add Title Please ..." style={{ borderRadius: "3px", minHeight: "35px", minWidth: "100%" }} value={userData?.title} onChange={(e) => setData({ ...userData, title: e.target.value })} />
                            <h6 style={{ marginTop: "20px" }} >Add Description:</h6>
                            <textArea placeholder="Add Description Please ..." rows="5" style={{ borderRadius: "10px", minWidth: "100%", padding: "10px" }} onChange={(e) => setData({ ...userData, desc: e.target.value })} >
                                {userData?.desc}
                            </textArea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {
                            isSending === true ? (
                                <h4>Sending Data</h4>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={sendData} >Post Now</Button>
                                </>
                            )
                        }
                    </Modal.Footer>
                </Modal>


            </div>
        </>
    )
}

export default ForumsListing