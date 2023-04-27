import React, { useState, useEffect, useMemo, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { useNavigate, Link, useParams } from 'react-router-dom'
import { getAllMyChats, getAllMyChatsWithOutRefreshing, emptyAllChatsOfPartnerData, updateLastMessageOfChat, markAllUnReadMessagesAsRead, updateUnReadCountOfChat } from "../redux/actions/PartnerChatActions"
import { addAllPartnerMessages, emptyAllMessagesOfPartnerData, sendNewMessage, appendNewMessageToList } from "../redux/actions/PartnerMessagesActions"
import { getMsgsBetPartnerAndAnyCus } from "../api/PartnerApi"
import moment from "moment"
import { AiOutlineSend } from "react-icons/ai"
import { CiNoWaitingSign } from "react-icons/ci"
import Badge from 'react-bootstrap/Badge';


const Cart = ({ socket }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { name, id } = useParams()
    const [currentChat, setCurrentChat] = useState({
        messages: [],
        isShowMore: false,
        userId: ""
    })
    const [selectedChat, setSelectedChat] = useState({
        currentUserName: "",
        currentUserId: "",
        thumbnail: ""
    })
    const [messageBody, setMessageBody] = useState({
        msg: "",
        receiverId: selectedChat?.currentUserId,
    })

    const { isAllPartnerChatsFetching, isGetAllPartnerChatsErrorMsg, isGetAllPartnerChatsSuccess, AllPartnerChats } = useSelector(state => state.partnerChatsReducer)
    const { isPartnerMsgsFetching, isNewMsgSent, AllPartnerMessages } = useSelector(state => state.partnerMessagesReducer)
    const { partnerDetails, isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    // getting all conversation of customer
    useEffect(() => {
        // getting all chats on reload or getting on page first time
        const getLatestChats = () => {
            dispatch(getAllMyChats(dispatch))
        }

        // getting all chats on getting back to page
        const getLatestChatsOnComeBack = () => {
            dispatch(getAllMyChatsWithOutRefreshing(dispatch))
        }

        if (AllPartnerChats?.length < 1) {
            getLatestChats();
        } else {
            getLatestChatsOnComeBack()
        }
    }, [])

    // selecting chat
    useEffect(() => {
        if (AllPartnerChats?.length < 1) {
            if (id != undefined) {
                const isUser = AllPartnerChats.find(item => item?.user?._id == id)

                setSelectedChat({ currentUserName: name, currentUserId: id, thumbnail: isUser?.thumbnail })
            } else {
                if (AllPartnerChats?.length > 0) {
                    setSelectedChat({ currentUserName: AllPartnerChats[0]?.user?.username, currentUserId: AllPartnerChats[0]?.user?._id, thumbnail: AllPartnerChats[0]?.user?.thumbnail })
                } else {
                    setSelectedChat({ currentUserName: "", currentUserId: "", thumbnail: "" })
                }
            }
        } else {
            // selecting chat  by default
            if (id != undefined) {
                const isUser = AllPartnerChats.find(item => item?.user?._id == id)
                console.log("isUser: ", AllPartnerChats)
                setSelectedChat({ currentUserName: name, currentUserId: id, thumbnail: isUser?.thumbnail })
            } else {
                if (AllPartnerChats?.length > 0) {
                    setSelectedChat({ currentUserName: AllPartnerChats[0]?.user?.username, currentUserId: AllPartnerChats[0]?.user?._id, thumbnail: AllPartnerChats[0]?.user?.thumbnail })
                } else {
                    setSelectedChat({ currentUserName: "", currentUserId: "", thumbnail: "" })
                }
            }
        }
    }, [])

    // getting all messages of current all friends of customer
    useEffect(() => {
        const getChatData = async () => {
            //getting messages of all conversations
            let newArr = []
            for (let p = 0; p !== AllPartnerChats?.length; p++) {
                let response = await getMsgsBetPartnerAndAnyCus(AllPartnerChats[p].user._id);
                if (response?.data?.success === true) {
                    // let unReadCount = response?.data?.AllMessages?.map(item => !item.isReadBy.includes(partnerDetails.Id))
                    // console.log("unReadCount: ",unReadCount?.length)
                    newArr.push({
                        messages: response?.data?.AllMessages,
                        isShowMore: response?.data?.isShowMore,
                        userId: AllPartnerChats[p]?.user?._id,
                        //unReadMsgs : unReadCount
                    })
                }
            }
            // storing all messages in redux
            dispatch(addAllPartnerMessages(newArr, dispatch))
        }

        getChatData();
    }, [AllPartnerChats])

    // getting all messages between current user and selected chat
    useMemo(async () => {
        const getChatData = async () => {
            const clonedObj = JSON.parse(JSON.stringify(AllPartnerMessages))
            let newArr = clonedObj.map(item => item);
            let isFound = newArr.find(item => item.userId == selectedChat.currentUserId);
            if (isFound) {
                isFound?.messages.sort(function (a, b) {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                })
                setCurrentChat({ messages: isFound?.messages, isShowMore: isFound?.isShowMore, userId: isFound?.userId })

                // marking all unread count as 0
                dispatch(markAllUnReadMessagesAsRead(selectedChat.currentUserId, dispatch))
            } else {
                let { data } = await getMsgsBetPartnerAndAnyCus(selectedChat.currentUserId);
                if (data?.success === true) {
                    setCurrentChat({ messages: data?.AllMessages?.reverse(), isShowMore: data?.isShowMore, userId: selectedChat?.currentUserId })
                } else {
                    setCurrentChat({ messages: [], isShowMore: false, userId: "" })
                }
                // marking all unread count as 0
                dispatch(markAllUnReadMessagesAsRead(selectedChat.currentUserId, dispatch))
            }
        }
        if (selectedChat?.currentUserId != "") {
            getChatData();
        }
    }, [selectedChat])

    // emptying all arrays fetched on reload.
    const removeAllChatsFromRedux = (e) => {
        // emptying all chats
        dispatch(emptyAllChatsOfPartnerData(dispatch))

        // emptying all messages on reload
        dispatch(emptyAllMessagesOfPartnerData(dispatch))
    };

    // emptying all data in redux related to home screen
    useEffect(() => {
        window.addEventListener("beforeunload", removeAllChatsFromRedux);
        return () => {
            window.removeEventListener("beforeunload", removeAllChatsFromRedux);
        };
    }, []);

    // sending message
    const sendMessage = () => {
        dispatch(sendNewMessage(messageBody, dispatch))
    }

    // updating current chat
    useMemo(() => {
        if (isNewMsgSent === true) {
            const clonedObj = JSON.parse(JSON.stringify(AllPartnerMessages))
            let newArr = clonedObj.map(item => item);
            let isFound = newArr.find(item => item.userId == messageBody.receiverId);
            if (isFound) {
                isFound?.messages.sort(function (a, b) {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                })
                setCurrentChat({ messages: isFound?.messages, isShowMore: isFound?.isShowMore, userId: isFound?.userId })

                // updating last message of chat
                const myMsg = messageBody;
                const newObj = {
                    _id: isFound?._id,
                    senderId: partnerDetails?.Id,
                    receiverId: myMsg?.receiverId,
                    msg: myMsg?.msg,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                //sending dispatch for updating last message of chat
                dispatch(updateLastMessageOfChat(myMsg.receiverId, newObj, dispatch))

                setMessageBody({ ...messageBody, msg: "" })
            }

        }
    }, [isNewMsgSent])

    //console.log("currentChat: ",currentChat)

    const messageEl = useRef(null);
    // for smooth scrolling and moving container to button on new message
    useEffect(() => {
        if (messageEl) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])

    const [newMsg, setNewMsg] = useState(null)

    // sending and receiving socket events
    useEffect(() => {
        // checking if any new partner is signed in
        if (isPartnerSignInSuccess === true && socket !== null) {
            // getting new message event
            socket.on('newMsgReceived', function (newlyMsg) {
                // searching chat
                let newObj = {
                    _id: newlyMsg._id,
                    text: newlyMsg.msg,
                    createdAt: newlyMsg.createdAt,
                    user: {
                        _id: newlyMsg.senderId,
                    },
                }
                setNewMsg(newlyMsg)

                // appending new message
                dispatch(appendNewMessageToList(newObj, dispatch))
            })
        }
    }, [socket])

    // receiving new message function
    useMemo(() => {
        if (newMsg !== null) {
            const clonedObj = JSON.parse(JSON.stringify(AllPartnerMessages))
            let newArr = clonedObj.map(item => item);
            let isFound = newArr.find(item => item.userId == newMsg?.senderId);
            if (isFound) {
                isFound?.messages.sort(function (a, b) {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                })
                if (newMsg?.senderId == selectedChat?.currentUserId) {
                    console.log("=====================  matching =========")
                    setCurrentChat({ messages: isFound?.messages, isShowMore: isFound?.isShowMore, userId: isFound?.userId })
                }
                const myObj = {
                    _id: newMsg?._id,
                    senderId: newMsg?.senderId,
                    receiverId: newMsg?.receiverId,
                    msg: newMsg?.msg,
                    createdAt: newMsg?.createdAt,
                    updatedAt: newMsg?.updatedAt
                }
                dispatch(updateLastMessageOfChat(myObj?.senderId, myObj, dispatch))

                // incrementing un read messages if current chat id is not same from which it is received
                if (newMsg?.senderId != selectedChat?.currentUserId) {
                    toast.success("New Message Received")
                    dispatch(updateUnReadCountOfChat(newMsg?.senderId))
                }

                setNewMsg(null)
            } else {
                toast.success("New Message Received By New Restaurant Owner")
                dispatch(getAllMyChatsWithOutRefreshing(dispatch))
            }
        }
    }, [newMsg])

    return (
        <div className='cart-page'>

            <Header socket={socket} />

            <div style={{ padding: "15px", backgroundColor: "#1F1F1F", color: "white", borderTop: "1px solid #74b9ff" }} >
                <div className="row messages" style={{ backgroundColor: "#1F1F1F", color: "white" }}>
                    <div className="col-lg-4 messages-list">
                        <h5 className="messages-heading" style={{ backgroundColor: "#1F1F1F", color: "white" }}>Conversation List</h5>
                        <div className="messages-input">
                            <img src="https://www.clipartmax.com/png/middle/202-2029196_shivaprakash-b-dummy-user.png" alt="" />
                            <input type="text" placeholder="Search" style={{ backgroundColor: "white", color: "#1F1F1F" }} />
                        </div>
                        <div className="users-list">
                            {
                                isAllPartnerChatsFetching === true ? (
                                    <h4>fetching ...</h4>
                                ) : (
                                    isGetAllPartnerChatsSuccess === false ? (
                                        <h4>{isGetAllPartnerChatsErrorMsg}</h4>
                                    ) : (
                                        AllPartnerChats?.length > 0 ? (
                                            AllPartnerChats?.map((item) => (
                                                <Link to={""} className="chat-user" key={item?._id} style={{ cursor: "pointer" }} onClick={() => setSelectedChat({ currentUserId: item?.user?._id, currentUserName: item?.user?.username, thumbnail: item?.user?.thumbnail })}>
                                                    <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + item?.user?.thumbnail} alt="" />
                                                    <div className="chat-user-text">
                                                        <h5 style={{ color: "white" }}>{item?.user?.username}</h5>
                                                        <p style={{ color: "white" }}>{item?.lastMsg?.senderId == partnerDetails?.Id ? "You : " : null} {item?.lastMessage?.msg?.length > 100 ? item?.lastMessage?.msg.substring(0, 100) + '....' : item?.lastMessage?.msg}</p>
                                                    </div>
                                                    <span className="chat-time">{moment(item?.updatedAt).format("Do MMM YY, h:mm a")}</span>
                                                    {
                                                        item?.unReadCount > 0 ? (
                                                            <Badge bg="info" size="small" style={{ marginTop: "18px" }} >{item?.unReadCount}</Badge>
                                                        ) : (
                                                            null
                                                        )
                                                    }
                                                </Link>
                                            ))
                                        ) : (
                                            <h4>No Chats initiated Yet</h4>
                                        )
                                    )
                                )
                            }
                        </div>
                    </div>

                    <div className="col-lg-8 chat-container">
                        {/* receiver  */}
                        <div className="chat-top">
                            <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + selectedChat?.thumbnail} alt="" />
                            <div className="chat-top-text">
                                <h5 style={{ color: "white" }}>{selectedChat?.currentUserName}</h5>
                            </div>
                        </div>

                        {/* all chat messages */}
                        <h5 className="chat-heading"></h5>
                        <div className="chat" ref={messageEl} >
                            {
                                currentChat?.messages?.length > 0 ? (
                                    currentChat?.messages?.map((item) => (
                                        item?.user?._id == partnerDetails?.Id ? (
                                            <div className="chat-message user1">
                                                <span>{moment(item?.createdAt).format("Do MMM YY, h:mm a")} </span>
                                                <p >
                                                    {item?.text}
                                                </p>
                                                <img src={"https://fivechefapp.cyclic.app" + "/restaurantOwnerImages/" + partnerDetails?.ThumbnailPic} alt="" />
                                            </div>
                                        ) : (
                                            <div className="chat-message user2">
                                                <img src={"https://fivechefapp.cyclic.app" + "/customerImages/" + selectedChat?.thumbnail} alt="" />
                                                <p >
                                                    {item?.text}
                                                </p>
                                                <span>{moment(item?.createdAt).format("Do MMM YY, h:mm a")}</span>
                                            </div>
                                        )
                                    ))
                                ) : (
                                    <h4>No Messages Found </h4>
                                )
                            }
                        </div>

                        {/* sending messages */}
                        <div className="chat-field">
                            <img src={"https://fivechefapp.cyclic.app" + "/restaurantOwnerImages/" + partnerDetails?.ThumbnailPic} style={{ borderRadius: "50%" }} alt="" />
                            <input type="text" placeholder="Enter your message ...." value={messageBody?.msg} onChange={(e) => setMessageBody({ receiverId: selectedChat?.currentUserId, msg: e.target.value })} onKeyPress={(e) => { e.key === 'Enter' && sendMessage() }} />
                            {
                                isPartnerMsgsFetching === true ? (
                                    <CiNoWaitingSign style={{ fontSize: "25px", marginRight: "15px" }} />
                                ) : (
                                    <AiOutlineSend style={{ fontSize: "25px", marginRight: "15px" }} onClick={sendMessage} />
                                )
                            }
                        </div>

                    </div>
                </div>
            </div>

            <Footer />

        </div>
    )
}

export default Cart