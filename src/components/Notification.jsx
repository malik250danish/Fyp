import {useState , useEffect , useMemo } from "react"
import bell from '../assets/icons/bell.svg'
import {Link} from "react-router-dom"
import {Button} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {useSelector} from 'react-redux'
import {getAllNotifications , markAllNotificationsAsSeen , markAnyNotificationsAsRead} from "../api/PartnerApi"
import moment from "moment"
import { toast } from 'react-toastify';


const Notification = ({ click, active , socket }) => {
    const { partnerDetails } = useSelector(state => state.partnerReducer)
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
            navigate(`/partner-chat/${id?.senderName}/${id?.senderId}`)
        }else if(type === "Complaint"){
            //navigate(('/partner/all-complaints'))
        }else if(type === "Menu"){
            navigate(`/partner/all-menus`)
        }else if(type === "Order"){
            navigate(`/partner/orders/view/${id?.id}`)
        }else if(type === "Product"){
            navigate(('/partner/all-products'))
        }else{ // means restaurant
            navigate(('/partner/all-restaurants'))
        }
    }

    // marking single notification as Read
    const markAsRead = async (id) => {
        const {data} = await markAnyNotificationsAsRead(id);
        if(data?.success === true){
            let newArr = allNotifications
            let isFound = newArr.find(item => item._id == id);
            if(isFound){
                isFound.read_by.push({readerId : partnerDetails?.Id , read_at : new Date()});
                newArr.filter(item => item._id == id ? isFound : item )
                setNotifications(newArr)
            }
            toast.success("Marked as Read")
        }else{
            toast.error(data?.message)
        }
    }

  return (
    <div className='partner-notification'>
        <div className="dropdown" style={{display : "flex"}} >
            <Button  style={{ backgroundColor : "#74b9ff", color : "red" , border : "none" , marginRight : "10px" , fontWeight : 600}} ><Link to='/partner-chat'>Chat</Link></Button>
            
            <button className="notification-btn" type="button" data-bs-toggle="dropdown" onClick={() => markUnSeen === false ? setMarkUnSeen(true) : ""} >
                <img src={bell} alt="" />
                {
                    unReadCount > 0 ? (
                        <div className="notification-alert">{unReadCount}</div>
                    ) : (
                        null
                    )
                }
            </button>  
            <ul className="dropdown-menu notification-list" style={{maxHeight : "300px" , maxWidth : "300px" , overflowY : "scroll" }} >
                {
                    allNotifications?.length > 0 ? (
                        allNotifications?.map((item) => (
                            item?.read_by?.find(itemOne => JSON.stringify(itemOne.readerId) == JSON.stringify(partnerDetails?.Id))  ? (
                                <li className='p-2 border-bottom' style={{display : "flex" , flexDirection : 'column'}} onClick={() => navigateUser(item?.type , item?.id)} >
                                    <b>{item?.title} </b>
                                    <p style={{marginLeft : 'auto' , maxHeight : '5px'}} >{moment(item?.createdAt).format("DD MMM YY")}</p>
                                    <p>{ item?.desc?.length > 120 ? item?.desc?.substring(0 , 120) : item?.desc }</p>
                                    {
                                        item?.type == "Order" ? (
                                            <p style={{color : "#0984e3" , fontWeight : 600}} >#{ item?.id?.refNo}</p>
                                        ) : (
                                            null
                                        )
                                    }
                                </li>
                            ) : (
                                <li className='p-2 border-bottom' style={{display : "flex" , backgroundColor: "gray", flexDirection : 'column'}} onClick={() => {markAsRead(item?._id); navigateUser(item?.type , item?.id)}} >
                                    <b>{item?.title} </b>
                                    <p style={{marginLeft : 'auto' , maxHeight : '5px'}} >{moment(item?.createdAt).format("DD MMM YY")}</p>
                                    <p>{ item?.desc?.length > 120 ? item?.desc?.substring(0 , 120) : item?.desc }</p>
                                    {
                                        item?.type == "Order" ? (
                                            <p style={{color : "#0984e3" , fontWeight : 600 , maxHeight : "10px" , marginTop : "-10px" , marginBottom : "0px"}} >#{ item?.id?.refNo}</p>
                                        ) : (
                                            null
                                        )
                                    }
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