import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Row, Col, Button } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { updateSingleTicketStatus } from '../redux/actions/TicketsActions'
import axios from "axios"
import { getSingleTicketIssue, getAllCommentsOnAIssueTicket } from "../api/CommonApi"
import { postACommentOnTicket, updateStatusOfAnyTicketIssue } from "../api/CustomerApi"
import { postACommentOnTicketByPartner } from "../api/PartnerApi"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import { useNavigate, Link } from "react-router-dom"
import { toast } from 'react-toastify';

const ViewSingleForum = ({ socket }) => {
    const { name, id } = useParams()
    document.title = `5 Chefs  | Tickets | ${name}`
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ticketData, setTicketData] = useState(null)
    const [ticketStatus, setTicketStatus] = useState(null)
    const [isShowMore, setIsShowMore] = useState(true)
    const [allComments, setAllComments] = useState([])
    const [allCommentsError, setAllCommentsError] = useState("")
    const [isCommentsGetting, setIsCommentsGetting] = useState(false)
    const { allTickets } = useSelector(state => state.ticketsReducer)
    const { userDetails, userSignInSuccess } = useSelector(state => state.usersReducer)
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)


    // getting ticket data + comments
    useEffect(() => {
        const getData = async () => {
            let isFound = allTickets.find(item => item?._id == id);
            // if(isFound != null){
            setTicketData(isFound)
            setTicketStatus(isFound?.status)
            //}else{
            const { data } = await getSingleTicketIssue(id);
            console.log("data of single ticket : ", data)
            if (data?.success === true) {
                setTicketData(data?.issue)
                setTicketStatus(data?.issue?.status)
            }
            //}

            // getting all comments on issue ticket
            setIsCommentsGetting(true)
            setAllCommentsError("")
            const res = await getAllCommentsOnAIssueTicket(id);
            if (res?.data?.success === true) {
                setAllComments(res?.data?.AllIssueTicketsComments)
                setAllCommentsError("")
                setIsShowMore(res?.data?.isShowMore)
            } else {
                setAllCommentsError(res?.data?.message)
            }
            setIsCommentsGetting(false)
        }
        getData()
    }, [])

    const [commentData, setCommentData] = useState({
        ticketId: id,
        msg: "",
    })

    // sending data
    const sendComment = async () => {
        if (userSignInSuccess === false && isPartnerSignInSuccess === false) {
            toast.error("Please Sign In to Continue")
            navigate("/login")
        } else {
            if (userSignInSuccess === true) {
                const { data } = await postACommentOnTicket(commentData);
                if (data?.success === true) {
                    setCommentData({
                        ticketId: id,
                        msg: "",
                    })
                    let newArr = allComments;
                    console.log("response : ", data?.NewTicketComment)
                    newArr.unshift(data?.NewTicketComment);
                    setAllComments(newArr)
                } else {

                }
            } else {
                const { data } = await postACommentOnTicketByPartner(commentData);
                if (data?.success === true) {
                    setCommentData({
                        ticketId: id,
                        msg: "",
                    })
                    let newArr = allComments;
                    console.log("response : ", data?.NewTicketComment)
                    newArr.unshift(data?.NewTicketComment);
                    setAllComments(newArr)
                } else {

                }
            }
        }
    }

    // getting more comments
    const getMoreComments = () => {
        axios.get(`https://fivechefapp.cyclic.app/api/v1/ticketComments/getAllIssueTicketsComments/${id}?skip=${allComments.length}`)
            .then(function (response) {
                // handle success
                if (response?.data?.success === true) {
                    let newArr = allComments;
                    let newtempArr = newArr.concat(response?.data?.AllIssueTicketsComments)
                    setAllComments(newtempArr)
                    setIsShowMore(response?.data?.isShowMore)
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

    // updating Status of any ticket
    const updateStatusOfTicket = async () => {
        const { data } = await updateStatusOfAnyTicketIssue(id);
        if (data?.success === true) {
            setTicketStatus(!ticketStatus)
            dispatch(updateSingleTicketStatus(id, dispatch))
        }
    }


    // sending and receiving socket events
    useEffect(() => {
        socket.on('newTicketCommentAdded', async (ticketId, comment) => {
            if (ticketId == id) {
                //console.log("=====>>>> : ", ticketId , comment)
                //toast.success("new Message")
                setAllCommentsError("")
                const res = await getAllCommentsOnAIssueTicket(id);
                if (res?.data?.success === true) {
                    setAllComments(res?.data?.AllIssueTicketsComments)
                    setAllCommentsError("")
                    setIsShowMore(res?.data?.isShowMore)
                } else {
                    setAllCommentsError(res?.data?.message)
                }
            }
        });
    }, [socket])


    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ maxWidth: "1240px", margin: "auto", marginTop: "45px", padding: "10px" }} >
                    {
                        ticketData === null ? (
                            <h4>Fetching Data ...</h4>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column" }} >
                                    <h3>Issue Ticket:</h3>
                                    <Row style={{ marginTop: "15px", marginBottom: "20px" }} >
                                        <Col xs={12} sm={12} md={10} lg={10}  >
                                            <h4 style={{ color: "#0984e3" }} >Order Id : "{ticketData?.orderId?.refNo}"</h4>
                                        </Col>
                                        <Col xs={12} sm={12} md={2} lg={2}  >
                                            <div style={{ display: 'flex', marginBottom: "15px" }} >
                                                {
                                                    ticketData?.creatorId?._id == userDetails?.Id && (
                                                        ticketStatus == true ? (
                                                            <Button variant="danger" onClick={updateStatusOfTicket} >Mark as Un-Resolved</Button>
                                                        ) : (
                                                            <Button variant="success" onClick={updateStatusOfTicket} >Mark as Resolved</Button>
                                                        )
                                                    )
                                                }
                                            </div>
                                            {
                                                ticketStatus == true ? (
                                                    <h5 style={{ color: "#55efc4", marginLeft: "20px" }} >Resolved</h5>
                                                ) : (
                                                    <h5 style={{ color: "crimson", marginLeft: "20px" }} >Un-Resolved</h5>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "25px", marginBottom: "25px" }} >
                                        <Col xs={12} sm={12} md={5} lg={5} >
                                            <div style={{ display: 'flex', flexDirection: 'column' }} >
                                                <h5 style={{ color: '#74b9ff' }} >Creator:</h5>
                                                <div style={{ display: "flex", flexDirection: "row", }} >
                                                    <img alt="user thumbnail" style={{ maxWidth: "30px", maxHeight: "30px", marginLeft: "25px", borderRadius: "50%" }} src={"https://fivechefapp.cyclic.app" + "/customerImages/" + ticketData?.creatorId?.profilePic} />
                                                    <h6 style={{ marginTop: "5px", marginLeft: "5px" }} >{ticketData?.creatorId?.username}</h6>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={5} lg={5} >
                                            {/* <div style={{display : 'flex' }} >
                                                {
                                                    ticketData?.creatorId?._id == userDetails?.Id && (
                                                        ticketStatus == true ? (
                                                            <Button variant="danger" onClick={updateStatusOfTicket} >Mark as Un-Resolved</Button>
                                                        ) : (
                                                            <Button variant="success"  onClick={updateStatusOfTicket} >Mark as Resolved</Button>
                                                        )
                                                    )
                                                }
                                            </div> */}
                                        </Col>
                                        <Col xs={12} sm={12} md={2} lg={2} >
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }} >
                                                <h6 style={{ color: '#74b9ff' }} >Updated At:</h6>
                                                <h5>{moment(ticketData?.updatedAt).format("DD-MMM-YY")}</h5>
                                            </div>
                                        </Col>
                                    </Row>
                                    <h5 style={{ marginTop: "20px", marginBottom: "20px" }} >Description:</h5>
                                    <p style={{ fontSize: "15px" }} >
                                        {ticketData?.desc}
                                    </p>
                                </div>

                                <div style={{ display: "flex", marginTop: "35px", marginBottom: "25px" }} >
                                    <h3 style={{ color: "#0984e3" }}>Comments ({allComments?.length})</h3>
                                </div>

                                {
                                    isCommentsGetting === true ? (
                                        <h4>Getting Comments</h4>
                                    ) : (
                                        allCommentsError !== "" ? (
                                            <h4>{allCommentsError}</h4>
                                        ) : (
                                            allComments?.length > 0 ? (
                                                allComments?.map((item, index) => (
                                                    <Row style={{ padding: "10px", borderBottom: "1px solid #636e72", marginBottom: "15px" }} key={item?._id} >
                                                        <Col xs={1} sm={1} md={1} lg={1} >
                                                            <div style={{ display: "flex", flexDirection: "column" }} >
                                                                <div style={{ display: "flex" }} >
                                                                    <img alt="user thumbnail" style={{ maxWidth: "30px", maxHeight: "30px", borderRadius: "50%", marginRight: "5px" }} src={item?.userId === null ? "https://fivechefapp.cyclic.app" + "/customerImages/" + item?.userId?.profilePic : "https://fivechefapp.cyclic.app" + "/restaurantOwnerImages/" + item?.adminId?.profilePic} />
                                                                    <h6>
                                                                        {
                                                                            item?.userId !== null ? (
                                                                                item?.userId?.username
                                                                            ) : (
                                                                                item?.ownerId?.username
                                                                            )
                                                                        }
                                                                    </h6>
                                                                </div>
                                                                <p style={{ fontSize: "12px", marginTop: "10px" }} ><strong>{moment(item?.createdAt).format("Do-MMM-YY, h:mm:ss a")}</strong></p>
                                                            </div>
                                                        </Col>
                                                        <Col xs={11} sm={11} md={11} lg={11} >
                                                            <p style={{ fontSize: "14px" }} >
                                                                {
                                                                    item?.msg
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                ))
                                            ) : (
                                                <h4>No Comments posted yet</h4>
                                            )
                                        )
                                    )
                                }

                                <div style={{ display: "flex", marginTop: "10px", justifyContent: "center" }} >
                                    {
                                        isShowMore == true && (
                                            <Button variant="info" onClick={getMoreComments} >show more</Button>
                                        )
                                    }
                                </div>

                                {/* Post a Comment */}
                                {
                                    ticketStatus == false && (
                                        userSignInSuccess === false && isPartnerSignInSuccess === false ? (
                                            <div style={{ display: "flex", justifyContent: "center", margin: "auto", maxWidth: "1240px" }} >
                                                <Link className='login-btn text-light bg-color-primary hover-blue' to="/login" style={{ maxWidth: "150px" }} >Login to Join</Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: "flex", marginTop: "100px", justifyContent: "center" }} >
                                                    <h5 style={{ color: "#0984e3" }}>Share Your Thoughts</h5>
                                                </div>
                                                <Row style={{ padding: "10px", borderBottom: "1px solid #636e72", marginBottom: "15px" }}>
                                                    <Col xs={1} sm={1} md={1} lg={1} >
                                                        <div style={{ display: "flex", flexDirection: "column" }} >
                                                            <img alt="user thumbnail" style={{ maxWidth: "30px", maxHeight: "30px", borderRadius: "50%" }} src={"https://fivechefapp.cyclic.app" + "/customerImages/" + userDetails.ProfilePic} />
                                                            <p>{userDetails?.UserName}</p>
                                                        </div>
                                                    </Col>
                                                    <Col xs={11} sm={11} md={11} lg={11} >
                                                        <textArea rows={8} style={{ minWidth: "100%", borderRadius: "10px", padding: "10px", color: "black" }} placeholder="Write somthing..." onChange={(e) => setCommentData({ ...commentData, msg: e.target.value })} value={commentData?.msg} onKeyPress={(e) => { e.key === 'Enter' && sendComment() }} />
                                                    </Col>
                                                </Row>
                                                <div style={{ display: "flex", justifyContent: "center", marginTop: "35px", marginBottom: "25px" }} >
                                                    <Button variant="info" onClick={sendComment} >Post Now</Button>
                                                </div>
                                            </>
                                        )
                                    )
                                }
                            </>
                        )
                    }
                </div>

                <Footer />
            </div>
        </>
    )
}

export default ViewSingleForum