import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Row, Col, Button } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { updateSingleForumsRepliesCount } from '../redux/actions/ForumsActions'
import axios from "axios"
import { getSingleForum, getAllCommentsOnAnyForum } from "../api/CommonApi"
import { postACommentOnAnyForum } from "../api/CustomerApi"
import { addNewForumCommentByPartner } from "../api/PartnerApi"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import { useNavigate, Link } from "react-router-dom"
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';


const ViewSingleForum = ({ socket }) => {
    const cookies = new Cookies();
    const { name, id } = useParams()
    document.title = `Forums | ${name}`
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ticketData, setTicketData] = useState(null)
    const [ticketStatus, setTicketStatus] = useState(null)
    const [isShowMore, setIsShowMore] = useState(true)
    const [allComments, setAllComments] = useState([])
    const [allCommentsError, setAllCommentsError] = useState("")
    const [isCommentsGetting, setIsCommentsGetting] = useState(false)
    const { allForums } = useSelector(state => state.forumsReducer)
    const { userDetails, userSignInSuccess } = useSelector(state => state.usersReducer)
    const { isPartnerSignInSuccess, partnerDetails } = useSelector(state => state.partnerReducer)
    const [myComment, setMyComment] = useState("")


    // sending and receiving socket events
    useEffect(() => {
        // checking if any customer is signed in
        if (userSignInSuccess === true) {
            // event for getting order status changed
            socket.on("forumCommentAdded", async (forumId, newComment) => {
                if (id == forumId) {
                    //toast.success("Current Forum Caught")
                    const res = await getAllCommentsOnAnyForum(id);
                    if (res?.data?.success === true) {
                        setAllComments(res?.data?.AllForumsComments)
                        setAllCommentsError("")
                        setIsShowMore(res?.data?.isShowMore)
                    }
                    dispatch(updateSingleForumsRepliesCount(id, dispatch))
                }
            })
        }
    }, [socket])


    // getting ticket data + comments
    useEffect(() => {
        const getData = async () => {
            let isFound = allForums.find(item => item?._id == id);
            if (isFound != null) {
                setTicketData(isFound)
                setTicketStatus(isFound?.status)
            } else {
                const { data } = await getSingleForum(id);
                if (data?.success === true) {
                    setTicketData(data?.Forum)
                    setTicketStatus(data?.Forum?.status)
                }
            }

            // getting all comments on issue ticket
            setIsCommentsGetting(true)
            setAllCommentsError("")
            const res = await getAllCommentsOnAnyForum(id);
            if (res?.data?.success === true) {
                setAllComments(res?.data?.AllForumsComments)
                setAllCommentsError("")
                setIsShowMore(res?.data?.isShowMore)
            } else {
                setAllCommentsError(res?.data?.message)
            }
            setIsCommentsGetting(false)
        }
        getData()
    }, [allForums])

    const [commentData, setCommentData] = useState({
        forumId: id,
        msg: "",
    })

    // sending data
    const sendComment = async () => {
        let partnerToken = cookies.get('fiveChefsPartnersTempToken')
        if (userSignInSuccess === false && !partnerToken) {
            toast.warning("Please Sign In to Continue")
            navigate("/login")
        } else {
            if (isPartnerSignInSuccess === true) {
                const { data } = await addNewForumCommentByPartner(commentData);
                if (data?.success === true) {
                    setCommentData({
                        forumId: id,
                        msg: "",
                    })
                    setMyComment("")
                    dispatch(updateSingleForumsRepliesCount(id, dispatch))
                } else {
                    toast.error(data?.message)
                }
            } else {
                const { data } = await postACommentOnAnyForum(commentData);
                if (data?.success === true) {
                    setCommentData({
                        forumId: id,
                        msg: "",
                    })
                    setMyComment("")
                    dispatch(updateSingleForumsRepliesCount(id, dispatch))
                } else {
                    toast.error(data?.message)
                }
            }
        }
    }

    // getting more comments
    const getMoreComments = () => {
        axios.get(`https://fivechefapp.cyclic.app/api/v1/forumComments/getAllCommentsOnAnyForum/${id}?skip=${allComments.length}`)
            .then(function (response) {
                // handle success
                if (response?.data?.success === true) {
                    let newArr = allComments;
                    let newtempArr = newArr.concat(response?.data?.AllForumsComments)
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

    // sending message on pressing enter
    const callMyOnEnterPressFunc = (e) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            setMyComment("")
            sendComment()
            //toast.info("Enter Key is pressed")
        }
    }

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ padding: "15px", maxWidth: "95%", marginLeft: "10px", marginTop: "45px", padding: "10px" }} >
                    {
                        ticketData === null ? (
                            <h4>Fetching Data ...</h4>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column" }} >
                                    <h3>Forum:</h3>
                                    <Row style={{ marginTop: "15px", marginBottom: "20px" }} >
                                        <Col xs={12} sm={12} md={11} lg={11}  >
                                            <h4 style={{ color: "#0984e3" }} >"{name}"</h4>
                                        </Col>
                                        <Col xs={12} sm={12} md={1} lg={1}  >
                                            {
                                                ticketStatus === false || ticketData.status == false ? (
                                                    <h5 style={{ color: "crimson", marginLeft: "20px" }} >Closed</h5>
                                                ) : (
                                                    <h5 style={{ color: "#55efc4", marginLeft: "20px" }} >Open</h5>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "25px", marginBottom: "25px" }} >
                                        <Col xs={12} sm={12} md={10} lg={10} >

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
                                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
                                                                <img alt="user thumbnail" style={{ maxWidth: "30px", maxHeight: "30px", borderRadius: "50%", marginRight: "10px", marginBottom: "5px" }} src={item?.adminId === null ? item?.userId !== null ? "https://fivechefapp.cyclic.app" + "/customerImages/" + item?.userId?.thumbnail : "https://fivechefapp.cyclic.app" + "/restaurantOwnerImages/" + item?.partnerId?.thumbnail : "https://fivechefapp.cyclic.app" + "/adminImages/" + item?.adminId?.thumbnail} />
                                                                <h6 style={{ marginTop: "5px" }} >
                                                                    {
                                                                        item?.userId !== null ? (
                                                                            item?.userId?.username?.length > 20 ? item?.userId?.username.substring(0, 20) + "..." : item?.userId?.username
                                                                        ) : (
                                                                            item?.adminId !== null ? (
                                                                                item?.adminId?.username?.length > 20 ? item?.adminId?.username.substring(0, 20) + "..." : item?.adminId?.username
                                                                            ) : (
                                                                                item?.partnerId?.username?.length > 20 ? item?.partnerId?.username.substring(0, 20) + "..." : item?.partnerId?.username
                                                                            )
                                                                        )
                                                                    }
                                                                </h6>

                                                            </div>
                                                        </Col>
                                                        <Col xs={11} sm={11} md={11} lg={11} >
                                                            <p style={{ fontSize: "14px" }} >
                                                                {
                                                                    item?.msg
                                                                }
                                                            </p>
                                                            <p style={{ fontSize: "11px", marginTop: "10px" }} ><strong>{moment(item?.createdAt).format("Do MMM, YY, h:mm:ss a")}</strong></p>
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
                                    (ticketStatus == true || ticketData.status == true) ? (
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
                                                            <img alt="user thumbnail" style={{ maxWidth: "30px", maxHeight: "30px", borderRadius: "50%" }} src={isPartnerSignInSuccess == false ? "https://fivechefapp.cyclic.app" + "/customerImages/" + userDetails?.ProfilePic : "https://fivechefapp.cyclic.app" + "/restaurantOwnerImages/" + partnerDetails?.ProfilePic} />
                                                            <p>{isPartnerSignInSuccess == false ? userDetails?.UserName : partnerDetails?.UserName}</p>
                                                        </div>
                                                    </Col>
                                                    <Col xs={11} sm={11} md={11} lg={11} >
                                                        <textArea rows={8} style={{ minWidth: "100%", borderRadius: "10px", padding: "10px", color: "black" }} placeholder="Write something..." onChange={(e) => { setMyComment(e.target.value); setCommentData({ ...commentData, msg: e.target.value }) }} onKeyPress={(e) => callMyOnEnterPressFunc(e)} >
                                                            {myComment}
                                                        </textArea>
                                                    </Col>
                                                </Row>
                                                <div style={{ display: "flex", justifyContent: "center", marginTop: "35px", marginBottom: "25px" }} >
                                                    <Button variant="info" onClick={sendComment} >Post Now</Button>
                                                </div>
                                            </>
                                        )
                                    ) : (
                                        null
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