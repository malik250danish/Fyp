import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Form, Button } from 'react-bootstrap'
import axios from "axios"
import { updateMyProfile } from '../redux/actions/UserActions'
import { useSelector, useDispatch } from 'react-redux'
import { comparePassword, updatePassword } from "../api/CustomerApi"
import { toast } from 'react-toastify';


const AllUbCategories = ({ socket }) => {
    const navigate = useNavigate()
    document.title = "Customer Profile Details"
    const dispatch = useDispatch()
    const { userSignInSuccess, userDetails, isProfileFetching, isProfileErrorMsg } = useSelector(state => state.usersReducer)

    const [uploadImage, setUploadImage] = useState(null)
    const [userData, setUserData] = useState({
        username: userDetails?.UserName,
        email: userDetails?.Email,
        phoneNo: userDetails?.PhoneNo,
        city: userDetails?.City,
        address: userDetails?.Address,
        allergens: userDetails?.Allergens,
        foodPreference: userDetails?.foodPreference,
    })
    const [isDisabled, setIsDisabled] = useState(true)
    const [myPassword, setMyPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    // checking if user is signed in or not
    useEffect(() => {
        if (userSignInSuccess === false) {
            navigate("/login")
        }
    }, [])

    // getting top menus on first reload of page
    useEffect(() => {
        // getting top menus
        const getTopMenus = async () => {
            //    if(allAllTopMenus?.length === undefined){
            //         dispatch(getMyAllTopMenusMain(dispatch))
            //    }
        }

        //getTopMenus()
    }, [])


    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all top deals
        //dispatch(getMyAllTopMenusEmpty(dispatch))
    };

    // removing events on reload
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    // updating data
    const updateRecord = async () => {
        let formData = new FormData();
        formData.append("username", userData?.username);
        formData.append("phoneNo", userData?.phoneNo);
        formData.append("city", userData?.city);
        formData.append("address", userData?.address);
        formData.append("customerImage", uploadImage);
        if (userData?.foodPreference?.length > 0) {
            formData.append("foodPreferences", JSON.stringify(userData?.foodPreference));
        }
        if (userData?.allergens?.length > 0) {
            formData.append("allergens", JSON.stringify(userData?.allergens));
        }
        dispatch(updateMyProfile(formData, dispatch))
        setUploadImage(null)
    }

    const allergens = [
        { label: "Milk", value: "Milk" },
        { label: "Eggs", value: "Eggs" },
        { label: "Fish", value: "Fish" },
        { label: "Tree Nut", value: "Tree Nut" },
        { label: "Wheat", value: "Wheat" },
        { label: "Soya Bean", value: "Soya Bean" },
    ]

    const foodPreference = [
        { label: "Burger", value: "Burger" },
        { label: "Pizza", value: "Pizza" },
        { label: "Spicy", value: "Spicy" },
        { label: "Sandwich", value: "Sandwich" },
    ]

    // updating allergens
    const updateAllergens = (value) => {
        let newArr = userData;
        if (newArr?.allergens?.length > 0) {
            let isFound = newArr?.allergens.find(item => item == value)
            if (!isFound) {
                newArr?.allergens.push(value)
            } else {
                let newMyArr = newArr?.allergens.filter(item => item != value)
                newArr.allergens = newMyArr
            }
        } else {
            if (!newArr?.allergens) {
                newArr.allergens = []
            }
            newArr?.allergens.push(value)
        }
        setUserData(newArr)
    }

    // updating food preferrences
    const updatePreffences = (value) => {
        let newArr = userData;
        if (newArr?.foodPreference?.length > 0) {
            console.log("inside of first if")
            let isFound = newArr?.foodPreference.find(item => item == value)
            if (!isFound) {
                console.log("inside not founc")
                newArr?.foodPreference.push(value)
            } else {
                console.log("inside of found")
                let newMyArr = newArr?.foodPreference.filter(item => item != value)
                newArr.foodPreference = newMyArr
            }
        } else {
            if (!newArr?.foodPreference) {
                console.log("inside of lower if")
                newArr.foodPreference = []
            }

            newArr?.foodPreference.push(value)
        }
        setUserData(newArr)
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
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ maxWidth: "1240px", margin: "auto", marginTop: "40px", padding: "10px" }} >
                    <h4 style={{ marginBottom: "30px", color: '#0984e3' }} >Update Profile:</h4>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} >
                            <img style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "10px" }} alt="user image" src={"https://fivechefapp.cyclic.app" + "/customerImages/" + userDetails?.Thumbnail} />
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

                    <Row style={{ marginTop: "20px" }} >
                        <Col xs={12} sm={12} md={6} lg={6} >
                            <h5>Update Allergens:</h5>
                            <Form.Select aria-label="Default select example" multiple style={{ backgroundColor: "#1F1F1F", color: 'white' }} >
                                {
                                    allergens?.length > 0 ? (
                                        allergens?.map((item) => (
                                            userData?.allergens !== undefined > 0 && userData?.allergens?.find(itemOne => itemOne == item) ? (
                                                <option value={item?.value} selected onClick={() => updateAllergens(item?.value)} >{item?.label}</option>
                                            ) : (
                                                <option value={item?.value} onClick={() => updateAllergens(item?.value)} >{item?.label}</option>
                                            )
                                        ))
                                    ) : (
                                        <p>No Allegens Found</p>
                                    )
                                }
                            </Form.Select>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} >
                            <h5>Update Food Preferences:</h5>
                            <Form.Select aria-label="Default select example" multiple style={{ backgroundColor: "#1F1F1F", color: 'white' }} >
                                {
                                    foodPreference?.length > 0 ? (
                                        foodPreference?.map((item) => (
                                            userData?.foodPreferences !== undefined && userData?.foodPreferences?.find(itemOne => itemOne == item) ? (
                                                <option value={item?.value} selected onClick={() => updatePreffences(item?.value)} >{item?.label}</option>
                                            ) : (
                                                <option value={item?.value} onClick={() => updatePreffences(item?.value)} >{item?.label}</option>
                                            )
                                        ))
                                    ) : (
                                        <p>No preferences Found</p>
                                    )
                                }
                            </Form.Select>
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
                <Footer />
            </div>
        </>
    )
}

export default AllUbCategories