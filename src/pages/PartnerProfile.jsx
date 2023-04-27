import React, { useState, useEffect } from 'react'
import { Button, Table, Form, Row, Col } from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { updateMyProfile } from "../redux/actions/PartnerActions"
import { comparePassword, updatePassword } from "../api/PartnerApi"


const PartnerViewAllMenus = ({ socket }) => {
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    document.title = `Profile`

    const handleOpen = () => {
        setActive(!active)
    }

    const [isFetching, setIsFetching] = useState(false)
    const [uploadImage, setUploadImage] = useState(null)
    const [myPassword, setMyPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const dispatch = useDispatch()
    const { isPartnerSignInSuccess, partnerDetails, isProfileFetching, } = useSelector(state => state.partnerReducer)

    const [userData, setUserData] = useState({
        username: partnerDetails?.UserName,
        email: partnerDetails?.Email,
        phoneNo: partnerDetails?.PhoneNo,
        city: partnerDetails?.City,
        address: partnerDetails?.Address,
    })

    const [isDisabled, setIsDisabled] = useState(true)

    // checking if user is signed in or not
    useEffect(() => {
        if (isPartnerSignInSuccess === false) {
            navigate("/partner/login")
        }
    }, [])


    // updating data
    const updateRecord = async () => {
        console.log("userData ; ", userData)
        let formData = new FormData();
        formData.append("username", userData?.username);
        formData.append("phoneNo", userData?.phoneNo);
        formData.append("city", userData?.city);
        formData.append("address", userData?.address);
        formData.append("ownerImage", uploadImage);
        dispatch(updateMyProfile(formData, dispatch))
        setUploadImage(null)
    }

    // checking password on blur
    const checkPPassword = async () => {
        if (myPassword?.length > 0) {
            const { data } = await comparePassword(myPassword)
            if (data?.success === true) {
                toast.success(data?.message)
                setIsDisabled(false)
                setMyPassword("")
            } else {
                toast.error(data?.message)
                setIsDisabled(true)
            }
        }
    }

    // checking password on blur
    const updateMyPassword = async () => {
        if (isDisabled === false) {
            const { data } = await updatePassword({ password: newPassword })
            console.log("data of update : ", data)
            if (data?.success === true) {
                toast.success(data?.message)
                setIsDisabled(true)
                setNewPassword("")
                setMyPassword("")
            } else {
                toast.error(data?.message)
            }
        } else {
            toast.warning("Please Enter Your Previous Password first")
        }
    }

    return (
        <>
            <div className='partner-route' >
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content" style={{ minHeight: "100%" }}>
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content" style={{ minHeight: "100%" }}>
                        <div style={{ maxWidth: "1240px", margin: "auto", marginTop: "40px", padding: "10px", minHeight: "100vh" }} >
                            <h4 style={{ marginBottom: "30px", color: '#0984e3' }} >Update Profile:</h4>
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <img style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "10px" }} alt="user image" src={"https://fivechefapp.cyclic.app" + "/restaurantOwnerImages/" + partnerDetails?.Thumbnail} />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <Row>
                                        <Col xs={12} sm={12} md={6} lg={6} >
                                            {
                                                uploadImage !== null && (
                                                    <img style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }} alt="user image" src={URL.createObjectURL(uploadImage)} />
                                                )
                                            }
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} >
                                            <Form.Group controlId="formFile" className="mb-3">
                                                <Form.Label>Update Image</Form.Label>
                                                <Form.Control type="file" accept="image/*" onChange={(e) => setUploadImage(e.target.files[0])} />
                                            </Form.Group>
                                            <div className='d-flex flex-column' >
                                                {
                                                    uploadImage !== null && (
                                                        <Button variant="danger" style={{ maxHeight: '40px', marginTop: '15px', minWidth: '120px' }} onClick={() => setUploadImage(null)} >Remove</Button>
                                                    )
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "20px" }} >
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <input type="text" placeholder="User name ...." style={{ minWidth: "99%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} value={userData?.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <input type="email" placeholder="email ..." disabled style={{ minWidth: "100%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} value={userData?.email} />
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "20px" }}>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <input type="text" placeholder="Phone No. ...." style={{ minWidth: "99%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} value={userData?.phoneNo} onChange={(e) => setUserData({ ...userData, phoneNo: e.target.value })} />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <input type="text" placeholder="City ..." style={{ minWidth: "100%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} value={userData?.city} onChange={(e) => setUserData({ ...userData, city: e.target.value })} />
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "20px" }}>
                                <Col xs={12} sm={12} md={6} lg={6} >
                                    <input type="text" placeholder="Address ...." style={{ minWidth: "99%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} value={userData?.address} onChange={(e) => setUserData({ ...userData, address: e.target.value })} />
                                </Col>
                            </Row>

                            {
                                isProfileFetching === true ? (
                                    <h4>Please wait...</h4>
                                ) : (
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }} >
                                        <Button variant="success" onClick={updateRecord} >Update Profile</Button>
                                    </div>
                                )
                            }

                            <hr />

                            <h4>Update Password:</h4>

                            <Row style={{ marginTop: "20px" }}>
                                <Col xs={12} sm={12} md={12} lg={5} >
                                    <input type="text" placeholder="Previous Password ...." style={{ minWidth: "99%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} value={myPassword} onChange={(e) => setMyPassword(e.target.value)} onBlur={checkPPassword} />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={5} >
                                    <input type="text" placeholder="New Password ..." style={{ minWidth: "100%", borderRadius: "10px", padding: "10px", minHeight: "15px", color: "black" }} disabled={isDisabled} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={2} >
                                    {
                                        isDisabled === false && (
                                            <Button variant="success" onClick={updateMyPassword} >Update Password</Button>
                                        )
                                    }
                                </Col>
                            </Row>

                        </div>


                    </div>
                </div>
            </div>



        </>
    )
}

export default PartnerViewAllMenus