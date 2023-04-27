import React ,{useState , useEffect } from 'react'
import {placeNewOrder} from "../api/CustomerApi"
import { toast } from 'react-toastify';
import { useNavigate , useParams ,useLocation } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import Button from 'react-bootstrap/Button';
import Footer from '../components/Footer'
import {emptyingMyCustomMenu , removeAppMenuFromCart , deleteAppMenuFromCart} from "../redux/actions/UserActions"
import Header from '../components/Header'
import Form from 'react-bootstrap/Form';
import {comparePassword} from "../api/CustomerApi"
import moment from "moment"

const PlaceOrder = ({socket}) => {
    const [msg, setMsg] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isCustomMenu} = useParams()
    const myParam = useLocation().search;
    const menuId = new URLSearchParams(myParam.toString()).get("refNo");
    const { appMenus , customMenu , userSignInSuccess , userDetails } = useSelector(state => state.usersReducer)

    // getting menu details
    useEffect(() => {
        if(isCustomMenu == "false"){
            let desiredMenu = appMenus.find(item => item.refNo == menuId);
            setOrderData({
                products : desiredMenu?.products,
                total : desiredMenu?.total,
                restaurant : desiredMenu?.restaurant,
                menu : desiredMenu?.Menu,
                isCustomMenu : false,
                address : userDetails?.Address
            })
        }else{
            setOrderData({
                products : customMenu?.products,
                total : customMenu?.total,
                restaurant : customMenu?.restaurant,
                menu : customMenu?.Menu,
                isCustomMenu : true,
                address : userDetails?.Address
            })
        }
    }, [isCustomMenu])
    
    const [ isSending , setIsSending ] = useState(false)
    const [ password , setPassword ] = useState("")
    const [ orderData , setOrderData ] = useState({
        products : [],
        address : userDetails?.Address,
        deliveryDate : "",
        note : "",
        total : "",
        restaurant : "",
        menu : null,
        isCustomMenu : null,
        customerName : "",
        customerEmail : "",
        customerAddress : "",
        customerPhoneNo : "",
        customerServiceType : "",
        password : "",
        customerPaymentMethod : ""
    })
    
    // comparing password
    const compareMyPassword = async () => {
        const {data} = await comparePassword(password)
            if(data?.success === true){
                toast.success(data?.message)
                placeMyNewOrder()
            }else{
               toast.error("Password is In Correct")
            }
    }

    // sending new order
    const placeMyNewOrder = async () => {
        setMsg("")
        if(userSignInSuccess === false){
            toast.warning("Please sign in to Continue")
            navigate("/login")
        }else{
            if(orderData?.deliveryDate == "" || orderData?.customerName == "" || orderData?.customerEmail == "" ||  orderData?.customerAddress == "" ){
                toast.warning("Please Fill All required Fields")
            }
            else{
                    const res = await placeNewOrder(orderData);
                    console.log("response : ",res?.data)
                    setMsg(res?.data?.message)
                    setIsSending(true)
                    if(res?.data?.success === true){
                        setOrderData({
                            products : [],
                            address : "",
                            deliveryDate : "",
                            note : "",
                            total : "",
                            restaurant : "",
                            menu : null,
                            isCustomMenu : null,
                            customerName : "",
                            customerEmail : "",
                            customerAddress : "",
                            customerPhoneNo : "",
                            customerServiceType : "",
                            password : "",
                            customerPaymentMethod : ""
                        })
                        if(isCustomMenu == "false"){
                            console.log("menuId ===> : ",menuId)
                            dispatch(deleteAppMenuFromCart(orderData?.menu , dispatch))
                        }else{
                            dispatch(emptyingMyCustomMenu(dispatch))
                        }
                        toast.success(res?.data?.message)
                        navigate("/cart")
                    }else{
                        toast.error(res?.data?.message)
                    }
                    setIsSending(false)
            }
        }
    }
        
  return (
    <>
        <div className='cart-page'>
            <Header socket={socket} />
            <div className="container">
                <h1 className='section-title cart-title'> <span className='fs-3'>Enter Your Details:</span></h1>
 
                <div style={{display : "flex", flexDirection : "column" , backgroundColor : "#1F1F1F", color : "white"}}  >
                    <p style={{color : "#3498db" , fontWeight : 600 , marginBottom : "20px"}} >{msg}</p>   

                    <div style={{display : "flex" , justifyContent : "flex-start", minWidth : "100%", marginTop : "25px"}} >
                        <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start",  minWidth : "50%",}} >
                            <h6>Your Name (*):</h6>
                            <input placeholder="Enter username..." autoFocus={true} type="text" style={{borderRadius : "5px" , backgroundColor : "#1F1F1F", color : "white" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px"}} value={orderData?.customerName} onChange={(e) => setOrderData({...orderData , customerName : e.target.value})} />
                        </div>
                        <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start" ,  minWidth : "48%", marginLeft : "15px"}} >
                            <h6>Your Email (*):</h6>
                            <input type="email" style={{borderRadius : "5px" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px", backgroundColor : "#1F1F1F", color : "white"}} value={orderData?.customerEmail} onChange={(e) => setOrderData({...orderData , customerEmail : e.target.value})} />
                        </div>
                    </div> 
                    <div style={{display : "flex" ,  justifyContent : "flex-start", minWidth : "100%", marginTop : "25px"}} >
                        <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start",  minWidth : "50%"}} >
                            <h6>Phone No. (*):</h6>
                            <input placeholder="Enter Phone No..." autoFocus={true} type="number" style={{borderRadius : "5px" , backgroundColor : "#1F1F1F", color : "white" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px"}} value={orderData?.customerPhoneNo} onChange={(e) => setOrderData({...orderData , customerPhoneNo : e.target.value})} />
                        </div>
                        {/* <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start", minWidth : "48%", marginLeft : "15px"}} >
                            <h6>Your Password (*):</h6>
                            <input type="text" style={{borderRadius : "5px" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px", backgroundColor : "#1F1F1F", color : "white"}} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div> */}
                        <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start", minWidth : "48%", marginLeft : "15px"}} >
                            <h6>Delivery Date (*):</h6>
                            <input type="date" min={moment().format("YYYY-MM-DD")} style={{borderRadius : "5px" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px", backgroundColor : "#1F1F1F", color : "white"}} value={orderData?.deliveryDate} onChange={(e) => {setOrderData({...orderData , deliveryDate : e.target.value}); console.log("target : ", typeof(e.target.value))}} />
                        </div>
                    </div>    
                    <div style={{display : "flex" ,  justifyContent : "flex-start", minWidth : "100%", marginTop : "25px"}} >
                        {/* <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start",  minWidth : "50%"}} >
                            <h6>Service Type (*):</h6>
                            <div style={{display : "flex" , }} >
                                <input type="radio" id="age1" name="ServiceType" value="30" onClick={(e) => setOrderData({...orderData , customerServiceType : "Pick Up"})} />
                                <label for="age1">Pick Up</label>
                                <input type="radio" id="age2" name="ServiceType" value="60" style={{marginLeft : "25px"}} onClick={(e) => setOrderData({...orderData , customerServiceType : "delivery"})} />
                                <label for="age2">Delivery</label>
                            </div>
                        </div> */}
                        {/* <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start", minWidth : "48%", marginLeft : "15px"}} >
                            <h6>Delivery Date (*):</h6>
                            <input type="date" min={moment().format("YYYY-MM-DD")} style={{borderRadius : "5px" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px", backgroundColor : "#1F1F1F", color : "white"}} value={orderData?.deliveryDate} onChange={(e) => {setOrderData({...orderData , deliveryDate : e.target.value}); console.log("target : ", typeof(e.target.value))}} />
                        </div> */}
                    </div>
                    <div style={{display : "flex" , justifyContent : "flex-start", minWidth : "100%", marginTop : "25px"}} >
                        <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start",  minWidth : "50%"}} >
                            <h6>Delivery Address (*):</h6>
                            <input placeholder="Enter Delivery Address..." autoFocus={true} type="text" style={{borderRadius : "5px" , backgroundColor : "#1F1F1F", color : "white" , border : "1px solid #dfe6e9" ,padding : "10px" , mibHeight : "25px"}} value={orderData?.address} onChange={(e) => setOrderData({...orderData , address : e.target.value})} />
                        </div>
                        {/* <Form.Select aria-label="Default select example" size="sm" style={{backgroundColor : "transparent", marginLeft : "15px", marginTop : "25px", maxHeight : "45px", color : "white"}} onChange={(e) => setOrderData({...orderData , customerPaymentMethod : e.target.value})} >
                            <option style={{backgroundColor : "#000000", maxWidth : "200px", color : "white"}}>Select payment Method (*)</option>
                            <option style={{backgroundColor : "#000000", maxWidth : "200px", color : "white"}} value="PayPal">PayPal</option>
                            <option style={{backgroundColor : "#000000", maxWidth : "200px", color : "white"}} value="Stripe">Stripe</option>
                            <option style={{backgroundColor : "#000000", maxWidth : "200px", color : "white"}} value="Apple">Apple</option>
                            <option style={{backgroundColor : "#000000", maxWidth : "200px", color : "white"}} value="COD">COD</option>
                        </Form.Select> */}
                    </div>     
                </div>
                <div style={{display : "flex" , justifyContent : "flex-start", minWidth : "100%", marginTop : "25px"}} >
                    {/* <Form.Select aria-label="Default select example" size="sm" style={{backgroundColor : "#000000", marginTop : "25px", maxHeight : "45px", color : "white"}} onChange={(e) => setOrderData({...orderData , customerPaymentMethod : e.target.value})} >
                        <option style={{backgroundColor : "#000000", color : "white"}}>Select payment Method (*)</option>
                        <option style={{backgroundColor : "#000000", color : "white"}} value="PayPal">PayPal</option>
                        <option style={{backgroundColor : "#000000", color : "white"}} value="Stripe">Stripe</option>
                        <option style={{backgroundColor : "#000000", color : "white"}} value="Apple">Apple</option>
                        <option style={{backgroundColor : "#000000", color : "white"}} value="COD">COD</option>
                    </Form.Select> */}
                    <div style={{display : "flex" , flexDirection : "column", justifyContent : "flex-start" ,  minWidth : "100%"}} >
                        <h6 style={{marginTop : "15px"}} >Note (optional):</h6>
                        <textArea placeholder="Enter any special note (If Any)..." rows={5} style={{borderRadius : "5px" , border : "1px solid #dfe6e9" , backgroundColor : "#1F1F1F", color : "white" ,padding : "10px" , mibHeight : "25px"}}  onChange={(e) => setOrderData({...orderData , note : e.target.value})}> {orderData?.note} </textArea>
                    </div>
                </div> 
                
                {
                    isSending === true ? (
                        <p>please wait ... </p>
                    ) : (
                        <div style={{ display : "flex" , justifyContent : "center" , alignItems : "center" , maxWidth : "1240px", margin: "auto"}} >
                            <Button variant="success" onClick={placeMyNewOrder} style={{marginTop : "50px"}} >Order Now</Button>
                        </div>
                    )
                }
            </div>
        < Footer />
        </div>
    </>
  )
}

export default PlaceOrder