import React , { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {Button} from "react-bootstrap"
import {sendContactEmail} from "../api/CommonApi"
import { toast } from 'react-toastify';

const FaqPage = () => {
    document.title = 'Contact Us'
    const [ isSending , setIsSending ] = useState(false)
    const [ userData , setUserData ] = useState({
        username : "",
        email : "",
        desc : ""
    })

    // sending data
    const sendEmail = async () => {
        setIsSending(true)
        console.log("userData: ",userData?.desc.length < 1 ? "true" : "false")
        if(userData?.username?.length < 1  || userData?.email?.length < 1  || userData?.desc?.length < 1 ){
            toast.error("Please fill All Fields")
        }else{
            const {data} = await sendContactEmail(userData);
            if(data?.success === true){
                setUserData({
                    username : "",
                    email : "",
                    desc : ""
                })
                toast.success("Thanks for your interest, We will get back to you soon.")
            }else{
                toast.error(data?.message)
            }
        }
        setIsSending(false)
    }

  return (
    <>
        <div className='homepage'>
            <Header/>
                <div style={{maxWidth : "1240px" , margin : "auto", marginTop : "35px", display : "flex" , justifyContent : "center",}} >
                    <h3>Contact Us:</h3>
                </div>
                <div style={{ maxWidth : "500px" , margin : "auto", marginTop : "25px", display : "flex" , justifyContent : "center", flexDirection : "column", padding : "10px"}} >
                    <input type="text" placeholder="Your User Name ...." style={{minWidth : "100%", borderRadius : "10px", padding : "10px" , minHeight : "15px" , color : "black", marginBottom : "20px" }}  value={userData?.username} onChange={(e) => setUserData({...userData , username : e.target.value })} />
                    <input type="email" placeholder="Your Email ...." style={{minWidth : "100%", borderRadius : "10px", padding : "10px" , minHeight : "15px" , color : "black", marginBottom : "20px" }}  value={userData?.email} onChange={(e) => setUserData({...userData , email : e.target.value })} />
                    <textArea rows="7" placeholder="Type Your Issue ...." style={{minWidth : "100%", borderRadius : "10px", padding : "10px" , minHeight : "15px" , color : "black", marginBottom : "20px" }} onChange={(e) => setUserData({...userData , desc : e.target.value })} >
                        {userData?.desc}
                    </textArea>
                    {
                        isSending === false ? (
                            <Button variant="info" onClick={sendEmail} >Send Now</Button>
                        ) : (
                            <h6>Sending, Please wait....</h6>
                        )
                    }
                </div>
            <Footer/>
        </div>
    </>
  )
}

export default FaqPage