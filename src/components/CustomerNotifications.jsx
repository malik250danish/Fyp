import {useState , useEffect , useMemo } from "react"
import bell from '../assets/icons/bell.svg'
import {Link} from "react-router-dom"
import {Button} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {useSelector} from 'react-redux'
import {getAllNotifications , markAllNotificationsAsSeen , markAnyNotificationsAsRead} from "../api/CustomerApi"
import moment from "moment"
import { toast } from 'react-toastify';


const Notification = ({ click, active , socket }) => {
    const { userDetails ,userSignInSuccess } = useSelector(state => state.usersReducer)
    const navigate = useNavigate()
    const [ allNotifications , setNotifications ] = useState([])
    const [ unReadCount , setUnReadCount] = useState(0)
    const [ markUnSeen , setMarkUnSeen ] = useState(false)

    // getting all notifications
    useEffect(() => {
        const getData = async () => {
            const {data} = await getAllNotifications();
            console.log("all data : ", data)
            if(data?.success === true){
                setNotifications(data?.AllNotifications)
                setUnReadCount(data?.UnReadCount)
            }else{
                setNotifications([])
                setUnReadCount(0)
            }
            setMarkUnSeen(false)
        }

        getData()
    },[])

    // socket implementation
    useEffect(() => {
        //if(userDetails === true){
            socket.on('refreshNotifications', async function  () {
                toast.success("New Notification Received")
                const {data} = await getAllNotifications();
                if(data?.success === true){
                    setNotifications(data?.AllNotifications)
                    setUnReadCount(data?.UnReadCount)
                }else{
                    setNotifications([])
                    setUnReadCount(0)
                }
                setMarkUnSeen(false)
            });
        //}
    }, [socket])

    useMemo(() => {
        if(markUnSeen == true){
            const updateRecord = async () => {
                const {data} = await markAllNotificationsAsSeen();
                if(data?.success === true){
                    setUnReadCount(0)
                }
            }

            updateRecord()
        }
    },[markUnSeen])

    // navigating user
    const navigateUser =  (type , id) => {
        if(type === "Message"){
            navigate(`/customer-chat/${id?.senderName}/${id?.senderId}`)
        }else if(type === "Complaint"){
            //navigate(('/partner/all-complaints'))
        }else if(type === "Menu"){
            navigate(`/top-menus`)
        }else if(type === "Order"){
            navigate(`/all-orders-of-any-customer`)
        }else if(type === "Product"){
            navigate((`/product-details/${id?.name}/${id?.id}`))
        }else{ // means restaurant
            navigate(('/featured-restaurants'))
        }
    }

    // marking single notification as Read
    const markAsRead = async (id) => {
        const {data} = await markAnyNotificationsAsRead(id);
        if(data?.success === true){
            let newArr = allNotifications
            let isFound = newArr.find(item => item._id == id);
            if(isFound){
                isFound.read_by.push({readerId : userDetails?.Id , read_at : new Date()});
                newArr.filter(item => item._id == id ? isFound : item )
                setNotifications(newArr)
            }
            toast.success("Marked as Read")
        }else{
            toast.error(data?.message)
        }
    }

  return (
    <div className='partner-notification' style={{backgroundColor : '#1F1F1F' , maxWidth : "20px"}} >
        <div className="dropdown" style={{display : "flex"}} >
            <button className="notification-btn" style={{backgroundColor : "#1F1F1F"}} type="button" data-bs-toggle="dropdown" onClick={() => markUnSeen === false ? setMarkUnSeen(true) : ""} >
                <img src={bell} alt="" />
                {
                    unReadCount > 0 ? (
                        <div className="notification-alert">{unReadCount}</div>
                    ) : (
                        null
                    )
                }
            </button>  
            <ul className="dropdown-menu notification-list" style={{maxHeight : "300px" , maxWidth : "300px" , overflowY : "scroll" ,backgroundColor : '#1F1F1F' }} >
                {
                    allNotifications?.length > 0 ? (
                        allNotifications?.map((item) => (
                            item?.read_by?.find(itemOne => JSON.stringify(itemOne.readerId) == JSON.stringify(userDetails?.Id))  ? (
                                <li className='p-2 border-bottom' style={{display : "flex" , flexDirection : 'column' , backgroundColor : '#1F1F1F'}} onClick={() => navigateUser(item?.type , item?.id)} >
                                    <b>{item?.title} </b>
                                    <p style={{marginLeft : 'auto' , maxHeight : '5px'}} >{moment(item?.createdAt).format("DD MMM YY, h:mm a")}</p>
                                    <p>{ item?.desc?.length > 120 ? item?.desc?.substring(0 , 120) : item?.desc }</p>
                                </li>
                            ) : (
                                <li className='p-2 border-bottom' style={{display : "flex" , backgroundColor: "gray", flexDirection : 'column'}} onClick={() => {markAsRead(item?._id); navigateUser(item?.type , item?.id)}} >
                                    <b>{item?.title} </b>
                                    <p style={{marginLeft : 'auto' , maxHeight : '5px'}} >{moment(item?.createdAt).format("DD MMM YY, h:mm a")}</p>
                                    <p>{ item?.desc?.length > 120 ? item?.desc?.substring(0 , 120) : item?.desc }</p>
                                    
                                </li>
                            )
                        ))
                    ) : (
                        <p>No Notifications Found</p>
                    )
                }
            </ul>
        </div>
        <div id='menu' className={`${active ? 'rotate' : ''} partner-menu-btn ms-3`} onClick={click}>
            <div className={`menu-line1 bg-dark ${active ? 'rotate1' : ''}`}  ></div>
            <div className={`menu-line2 bg-dark ${active ? 'rotate2' : ''}`}></div>
        </div>
    </div>
  )
}

export default Notification