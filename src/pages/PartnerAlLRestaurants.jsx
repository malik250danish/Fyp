import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Form } from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllRestaurants, getAllProductsDropDown, updateAnyRestaurant, getAllMenusForDropdown, getAllRestaurantsDropDown, getAllCategoriesForDropdown, getAllSubCategoriesForDropdown, addNewProduct, getSingleRestaurantDetails, updateSingleRestaurantStatus, updateSingleProductStatus, addNewRestaurant } from "../api/PartnerApi"
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';

const PartnerViewAllMenus = ({ socket }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    document.title = `Restaurants`

    const handleOpen = () => {
        setActive(!active)
    }

    const [allOrders, setAllOrders] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [singleRecord, setSingleRecord] = useState(null)
    const [singleUserData, setSingleUserData] = useState(null)
    const [isGetting, setIsGetting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [uploadImage, setUploadImage] = useState(null)
    const [partnerAllProds, setAllPartnerProds] = useState([])
    const [allMenus, setAllMenus] = useState([])
    const [allRestaurants, setAllRestaurants] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [allSubCategories, setAllSubCategories] = useState([])
    const dispatch = useDispatch()
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                toast.error("Please Sign In to See your Orders")
                navigate("/partner/login")
            } else {
                const { data } = await getAllRestaurants();
                console.log("all resturants : ", data)
                if (data?.success === true) {
                    setAllOrders(data?.AllRestaurants)

                    // getting all products
                    const res = await getAllProductsDropDown();
                    if (res?.data?.success === true) {
                        setAllPartnerProds(res?.data?.AllProducts)
                    }

                    // getting all restaurants
                    const response = await getAllRestaurantsDropDown();
                    if (response?.data?.success === true) {
                        setAllRestaurants(response?.data?.AllRestaurants)
                    }

                    // getting all menus
                    const responseOne = await getAllMenusForDropdown();
                    if (responseOne?.data?.success === true) {
                        setAllMenus(responseOne?.data?.AllMenus)
                    }

                    // getting all categories
                    const responseTwo = await getAllCategoriesForDropdown();
                    if (responseTwo?.data?.success === true) {
                        setAllCategories(responseTwo?.data?.AllCategories)
                    }

                    // getting all sub categories
                    const responseThree = await getAllSubCategoriesForDropdown();
                    if (responseThree?.data?.success === true) {
                        setAllSubCategories(responseThree?.data?.AllCategories)
                    }

                } else {
                    toast.error(data?.message)
                }
            }
        }

        getData()
    }, [isPartnerSignInSuccess])

    // getting top menus on scroll
    const getTopMyMoreOrders = async () => {
        if (isPartnerSignInSuccess === false) {
            toast.error("Please Sign In to Continue")
            navigate("/partner/login")
        } else {
            setIsFetching(true)
            axios.get(`https://fivechefapp.cyclic.app/api/v1/menus/getAllMenusOfAnyOwner?skip=${allOrders.length}`)
                .then(function (response) {
                    // handle success
                    console.log("response got", response?.data);
                    if (response?.data?.success === true) {
                        let newArr = allOrders;
                        newArr.push(...response?.data?.AllMenus)
                        setAllOrders(newArr)
                        //dispatch(appendMoreOrders(response?.data?.AllOrders , dispatch))
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                    setIsFetching(false)
                });
        }
    }

    // adding new record
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [userData, setUserData] = useState({
        name: "",
        address: "",
        deliveryTime: "",
        isDelivery: false,
        isPickUp: false,
        phoneNo: "",
        is24HoursOpen: false,
        desc: "",
        closingTime: "",
        openingTime: "",
        desc: "",
        city: "",
        tags: []
    })

    // sending data
    const addNewRecord = async () => {
        if (userData?.name == "" || userData?.address == "" || uploadImage == null) {
            toast.warning("Please all Fields")
            return;
        } else {
            setIsSending(true)
            let formData = new FormData();
            formData.append("restaurantLogo", uploadImage)
            formData.append("name", userData?.name)
            formData.append("address", userData?.address)
            formData.append("deliveryTime", userData?.deliveryTime)
            formData.append("isDelivery", userData?.isDelivery)
            formData.append("isPickUp", userData?.isPickUp)
            formData.append("phoneNo", userData?.phoneNo)
            formData.append("desc", userData?.desc)
            formData.append("openingTime", userData?.openingTime)
            formData.append("closingTime", userData?.closingTime)
            if (userData?.tags?.length > 0) {
                formData.append("tags", JSON.stringify(userData?.tags))
            }
            const { data } = await addNewRestaurant(formData);
            if (data?.success === true) {
                toast.success("New Restaurant Added SuccessFully")
                setUploadImage(null)
                setUserData({
                    name: "",
                    address: "",
                    deliveryTime: "",
                    isDelivery: false,
                    isPickUp: false,
                    phoneNo: "",
                    is24HoursOpen: false,
                    desc: "",
                    closingTime: "",
                    openingTime: "",
                    desc: "",
                    city: ""
                })

                // again getting all data
                setIsFetching(true)
                const res = await getAllRestaurants();
                if (res?.data?.success === true) {
                    setAllOrders(res?.data?.AllRestaurants)
                }
                setIsFetching(false)
                handleClose()
            } else {
                toast.error(data?.message)
            }
            setIsSending(false)
        }
    }

    // getting any record details
    const [viewRecord, setViewRecord] = useState(false);
    const handleViewClose = () => setViewRecord(false);
    const handleViewRecord = async (id) => {
        setViewRecord(true);
        setIsGetting(true)
        const { data } = await getSingleRestaurantDetails(id);
        if (data?.success === true) {

            setSingleRecord(data?.Restaurant)
            setSingleUserData(data?.Restaurant)
        } else {
            toast.error(data?.message)
        }
        setIsGetting(false)
    }

    // changing status
    const changeStatus = async (id) => {
        let isFound = allOrders.find(item => item._id == id);
        if (isFound) {
            const { data } = await updateSingleRestaurantStatus(id);
            if (data?.success === true) {
                if (isFound.status == false) {
                    isFound.status = true
                    toast.success("Restaurant Activated Successfully");
                } else {
                    isFound.status = false
                    toast.success("Restaurant InActivated Successfully");
                }
                let newData = allOrders;
                let finalData = newData.filter(item => item.Id === id ? isFound : item);
                setAllOrders(finalData)
            } else {
                toast.success(data?.message);
            }
        }
    }

    // updating any record
    const updateData = async () => {
        setIsSending(true)
        let formData = new FormData()
        formData.append("name", singleUserData?.name)
        formData.append("address", singleUserData?.address)
        formData.append("deliveryTime", singleUserData?.deliveryTime)
        formData.append("isDelivery", singleUserData?.isDelivery)
        formData.append("isPickUp", singleUserData?.isPickUp)
        formData.append("phoneNo", singleUserData?.phoneNo)
        formData.append("desc", singleUserData?.desc)
        formData.append("city", singleUserData?.city)
        if (singleUserData?.tags?.length > 0) {
            formData.append("tags", JSON.stringify(singleUserData?.tags))
        }
        formData.append("openingTime", singleUserData?.openingTime)
        formData.append("closingTime", singleUserData?.closingTime)
        if (uploadImage !== null) {
            formData.append("restaurantLogo", uploadImage)
        }
        const { data } = await updateAnyRestaurant(singleUserData._id, formData);
        if (data?.success === true) {
            toast.success(data?.message)
            setUploadImage(null)
            setSingleRecord(null)
            setUserData(null)

            // again getting all data
            setIsFetching(true)
            const res = await getAllRestaurants();
            if (res?.data?.success === true) {
                setAllOrders(res?.data?.AllRestaurants)
            }
            setIsFetching(false)
            handleViewClose()
        } else {
            toast.error(data?.message)
        }
        setIsSending(false)
    }

    const desiredTags = [
        { label: "Baked", value: "Baked" },
        { label: "Dairy ", value: "Dairy " },
        { label: "Edible ", value: "Edible " },
        { label: "Edible Nuts", value: "Edible Nuts" },
        { label: "Legumes", value: "Legumes" },
        { label: "Starchy ", value: "Starchy " },
    ]

    // adding tags on adding
    const addMyTags = (tag) => {
        let newArr = userData;
        let isFound = newArr?.tags?.find(item => item == tag)
        if (isFound) {
            let myNewArr = newArr?.tags?.filter(item => item != tag);
            newArr.tags = myNewArr
        } else {
            if (!newArr.tags) {
                newArr.tags = []
            }
            newArr.tags.push(tag)
        }
        setUserData(newArr)
    }

    // adding tags on adding
    const addMyTagsUpdate = (tag) => {
        let newArr = singleUserData;
        let isFound = newArr?.tags?.find(item => item == tag)
        if (isFound) {
            let myNewArr = newArr?.tags?.filter(item => item != tag);
            newArr.tags = myNewArr
        } else {
            if (!newArr.tags) {
                newArr.tags = []
            }
            newArr.tags.push(tag)
        }
        setSingleUserData(newArr)
    }

    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <h1 className='partner-heading mb-4'>All Restaurants</h1>
                            <Button variant="primary" size="sm" style={{ maxHeight: "35px" }} onClick={handleShow} >Add New</Button>
                        </div>
                        {
                            isFetching === true ? (
                                <h4>Fetching...</h4>
                            ) : (
                                <InfiniteScroll
                                    dataLength={allOrders?.length}
                                    next={getTopMyMoreOrders}
                                    hasMore={true}
                                    loader={isFetching === true && <h4>Loading...</h4>}
                                    endMessage={
                                        <p style={{ textAlign: "center" }}>
                                            <strong>No More Products.</strong>
                                        </p>
                                    }
                                    style={{ overFlowY: "scroll", minHeight: "100vh" }}
                                >
                                    <Table responsive striped bordered hover style={{ marginTop: "25px" }} >
                                        <thead  >
                                            <tr>
                                                <th>Name</th>
                                                <th>Address</th>
                                                <th>Delivery Time</th>
                                                <th>Delivery Type</th>
                                                <th>Phone No</th>
                                                <th>Rating</th>
                                                <th>Status</th>
                                                <th>View</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                allOrders?.length > 0 ? (
                                                    allOrders?.map((item) => (
                                                        <>
                                                            <tr>
                                                                <td>
                                                                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", }} >
                                                                        {item?.name}
                                                                        <img alt="product image" src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.logo} style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} />
                                                                    </div>
                                                                </td>
                                                                <td>{item?.address}</td>
                                                                <td>
                                                                    {item?.deliveryTime}
                                                                </td>
                                                                <td>
                                                                    {item?.deliveryType}
                                                                </td>
                                                                <td>
                                                                    {item?.phoneNo}
                                                                </td>
                                                                <td>{item?.rating} ({item?.ratingCount})</td>
                                                                <td>
                                                                    <Dropdown>
                                                                        <Dropdown.Toggle variant="info" size="sm" id="dropdown-basic">
                                                                            {
                                                                                item?.status === true ? (
                                                                                    "Activated"
                                                                                ) : (
                                                                                    "De Activated"
                                                                                )
                                                                            }
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu>
                                                                            <Dropdown.Item style={{ backgroundColor: '#2ecc71', color: "white" }} onClick={() => changeStatus(item?._id)} >Activate</Dropdown.Item>
                                                                            <Dropdown.Item style={{ backgroundColor: '#d35400', color: "white" }} onClick={() => changeStatus(item?._id)} >De Activate</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </td>
                                                                <td>
                                                                    <Button size="sm" variant="primary" onClick={() => { handleViewRecord(item?._id) }} >Details</Button>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ))
                                                ) : (
                                                    <h4 style={{ marginTop: "20px ", textAlign: "center" }} > No Menus Added by You Yet </h4>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                </InfiniteScroll>
                            )
                        }

                    </div>
                </div>
            </div>

            {/* adding new menu */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex justify-center min-w-[100%]" style={{ display: "flex", justifyContent: "center", width: "100%" }} >
                        <div className='flex justify-center flex-col align-center pb-4 md:min-w-[600px] min-w-[300px] max-w-[700px]  w-[100%]  pt-3' style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", minWidth: "100%" }} >
                            <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: 'column', minWidth: "100%", }} >
                                <h6>Restaurant Image(*)</h6>
                                <div style={{ display: "flex", width: "100%", marginBottom: "20px" }}  >
                                    <input type="file" accept="image/*" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' onChange={(e) => setUploadImage(e.target.files[0])} />
                                    {
                                        uploadImage !== null && (
                                            <div className="flex justify-between mb-5 mt-4" >
                                                <img src={URL.createObjectURL(uploadImage)} alt="cover pic" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '10px', marginRight: "40px" }} />
                                                <Button variant="danger" size="sm" className='bg-[#e74c3c] mt-3 ml-6 rounded-md p-2 text-white font-semibold mx-auto max-h-[40px]' style={{ marginLeft: "15px" }} onClick={() => setUploadImage(null)} >Remove</Button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "center", minWidth: "100%", }} >
                                <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }}>
                                    <h6 className="pb-3" >Restaurant Name:(*)</h6>
                                    <input type="text" placeholder="Enter Name ..." className='min-h-[35px] p-2 rounded-md min-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%", borderRadius: "5px", minWidth: "100%" }} value={userData?.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                                </div>
                                <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "100%", flexDirection: "column" }}  >
                                    <h6   >Address:(*)</h6>
                                    <span style={{ color: 'crimson', fontSize: "10px" }} >(Please always provide valid address)</span>
                                    <input type="text" placeholder="Enter Address ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%", borderRadius: "5px", minWidth: "100%" }} value={userData?.address} onChange={(e) => setUserData({ ...userData, address: e.target.value })} />
                                </div>
                            </div>
                            <div className='flex md:flex-row flex-col pt-1  min-w-[100%]' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "15px" }}>
                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", width: "50%", flexDirection: "column" }} >
                                    <h6>Delivery Type:(*)</h6>
                                    <div style={{ display: "flex", marginTop: '15px', justifyContent: "space-evenly" }} >
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Delivery"
                                            onChange={() => userData?.isDelivery == true ? setUserData({ ...userData, isDelivery: false }) : setUserData({ ...userData, isDelivery: true })}
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Pick Up"
                                            onChange={() => userData?.isPickUp == true ? setUserData({ ...userData, isPickUp: false }) : setUserData({ ...userData, isPickUp: true })}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "370px", flexDirection: "column" }}  >
                                    <h6 className="pb-0" >City:</h6>
                                    <input type="text" placeholder="Enter City ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%" }} value={singleUserData?.phoneNo} onChange={(e) => setSingleUserData({ ...userData, phoneNo: e.target.value })} />
                                </div>
                            </div>
                            {
                                userData?.isDelivery == true ? (
                                    <div className='flex md:flex-row flex-col pt-2  min-w-[100%]' style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start", minWidth: "100%" }}>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }} >
                                            <h6>24 Hours Service:</h6>
                                            {
                                                userData?.is24HoursOpen == true ? (
                                                    <Form.Check
                                                        type="switch"
                                                        checked
                                                        id="custom-switch"
                                                        label="Remove from 24h Open"
                                                        onChange={(e) => setUserData({ ...userData, is24HoursOpen: false })}
                                                    />
                                                ) : (
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        label="Add to 24h Open"
                                                        onChange={(e) => setUserData({ ...userData, is24HoursOpen: true })}
                                                    />
                                                )
                                            }
                                        </div>
                                        <div className='flex flex-col pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "100%", flexDirection: "column" }} >
                                            <h6>Delivery Time:</h6>
                                            <input type="text" placeholder="Enter Delivery Time..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: "1px solid black", borderRadius: "10px", width: "100%" }} value={userData?.deliveryTime} onChange={(e) => setSingleUserData({ ...userData, deliveryTime: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    null
                                )
                            }
                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", marginBottom: "20px", width: "100%" }}  >
                                {
                                    userData?.isDelivery == true ? (
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' >
                                            <h6>Delivery Type:</h6>
                                            {
                                                userData?.isFreeDelivery == true ? (
                                                    <Form.Check
                                                        type="switch"
                                                        checked
                                                        id="custom-switch"
                                                        label="make it as free"
                                                        onChange={(e) => setSingleUserData({ ...singleUserData, isFreeDelivery: false })}
                                                    />
                                                ) : (
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        label="make as Not free"
                                                        onChange={(e) => setSingleUserData({ ...userData, isFreeDelivery: true })}
                                                    />
                                                )
                                            }
                                        </div>
                                    ) : (
                                        null
                                    )
                                }

                            </div>
                            {
                                userData?.is24HoursOpen == false || userData?.is24HoursOpen == undefined ? (
                                    <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", minWidth: "100%" }}  >
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "48%", maxWidth: "48%" }} >
                                            <h6>Opening Time</h6>
                                            <input type="time" placeholder="Enter Delivery Time ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%", borderRadius: "5px", minWidth: "100%" }} value={userData?.openingTime} onChange={(e) => setUserData({ ...userData, openingTime: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "50%", maxWidth: "50%" }} >
                                            <h6>Closing Time</h6>
                                            <input type="time" placeholder="Enter Delivery Time ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%", borderRadius: "5px", minWidth: "100%" }} value={userData?.closingTime} onChange={(e) => setUserData({ ...userData, closingTime: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    null
                                )
                            }

                            <div className='flex md:flex-row flex-col pt-1  min-w-[100%]' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "15px" }}>
                                <div className='flex flex-col pl-3 font-semibold md:max-w-[50%] w-full' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }}>
                                    <h6>Select Tags:</h6>
                                    <select class="form-select" multiple aria-label="Default select example" >
                                        {
                                            desiredTags?.length > 0 ? (
                                                desiredTags?.map((item) => (
                                                    <option value={item?.value} onClick={() => addMyTags(item?.value)} >{item?.label}</option>
                                                ))
                                            ) : (
                                                <option >No tags Found</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "center", flexDirection: "column", minWidth: "100%" }} >
                                <h6>Description:</h6>
                                <textArea rows="8" placeholder="Enter Description ..." style={{ borderRadius: "10px", padding: "10px", border: "1px solid black", width: "100%" }} onChange={(e) => setUserData({ ...userData, desc: e.target.value })} >
                                    {singleUserData?.desc}
                                </textArea>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        isSending === true ? (
                            <h4>Please wait...</h4>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={addNewRecord} >Add Now</Button>
                            </>
                        )
                    }
                </Modal.Footer>
            </Modal>

            {/* updating/viewing single menu */}
            <Modal
                show={viewRecord}
                onHide={handleViewClose}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>View Restaurant Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        isGetting === true ? (
                            <h4>Getting Details</h4>
                        ) : (
                            <div className="flex justify-center min-w-[100%]" style={{ display: "flex", justifyContent: "center", width: "100%" }} >
                                <div className='flex justify-center flex-col align-center pb-4 md:min-w-[600px] min-w-[300px] max-w-[700px]  w-[100%]  pt-3' style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", minWidth: "100%" }} >
                                    <div className='flex md:flex-row flex-col pt-1' style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                                        <img src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + singleUserData?.logo} alt="cover pic" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '10px', margin: 'auto' }} />
                                        <div className='flex flex-col pt-1 pl-3 font-semibold' >
                                            {
                                                uploadImage !== null && (
                                                    <div className="flex justify-between mt-4 mb-5">
                                                        <img src={URL.createObjectURL(uploadImage)} alt="cover pic" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '10px' }} />
                                                        <button className='bg-[#e74c3c] mt-3 rounded-md p-2 text-white font-semibold mx-auto max-h-[40px]' onClick={(e) => setUploadImage(null)} >Remove</button>
                                                    </div>
                                                )
                                            }
                                            <input type="file" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black' }} onChange={(e) => setUploadImage(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <div className='flex md:flex-row flex-col pt-2 min-w-[100%]' style={{ display: "flex", justifyContent: "center", minWidth: "100%", }}  >
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }} >
                                            <h6 className="pb-2" style={{ marginBottom: "20px" }} >Name:</h6>
                                            <input type="text" placeholder="Enter user name ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", minWidth: "50%" }} value={singleUserData?.name} onChange={(e) => setSingleUserData({ ...userData, name: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "100%", flexDirection: "column" }} >
                                            <h6>Address:</h6>
                                            <span style={{ color: 'crimson', fontSize: '12px' }} >(please always provide a valid address)</span>
                                            <input type="text" placeholder="Enter user name ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: "1px solid black", borderRadius: "10px", width: "100%" }} value={singleUserData?.address} onChange={(e) => setSingleUserData({ ...singleUserData, address: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className='flex md:flex-row flex-col pt-1  min-w-[100%]' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "15px" }}>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }} >
                                            <h6>Delivery Type:(*)</h6>
                                            <div style={{ display: "flex", marginTop: '15px', justifyContent: "space-evenly" }} >
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Delivery"
                                                    onChange={() => singleUserData?.isDelivery == true ? setSingleUserData({ ...singleUserData, isDelivery: false }) : setSingleUserData({ ...singleUserData, isDelivery: true })}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Pick Up"
                                                    onChange={() => singleUserData?.isPickUp == true ? setSingleUserData({ ...singleUserData, isPickUp: false }) : setSingleUserData({ ...singleUserData, isPickUp: true })}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "100%", flexDirection: "column" }}  >
                                            <h6 className="pb-0" >City:</h6>
                                            <input type="text" placeholder="Enter City ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%" }} value={singleUserData?.city} onChange={(e) => setSingleUserData({ ...singleUserData, city: e.target.value })} />
                                        </div>
                                    </div>
                                    {
                                        singleUserData?.isDelivery == true ? (
                                            <div className='flex md:flex-row flex-col pt-2  min-w-[100%]' style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start", minWidth: "100%" }}>
                                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }} >
                                                    <h6>24 Hours Service:</h6>
                                                    {
                                                        singleUserData?.is24HoursOpen == true ? (
                                                            <Form.Check
                                                                type="switch"
                                                                checked
                                                                id="custom-switch"
                                                                label="Remove from 24h Open"
                                                                onChange={(e) => setSingleUserData({ ...singleUserData, is24HoursOpen: false })}
                                                            />
                                                        ) : (
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label="Add to 24h Open"
                                                                onChange={(e) => setSingleUserData({ ...singleUserData, is24HoursOpen: true })}
                                                            />
                                                        )
                                                    }
                                                </div>
                                                <div className='flex flex-col pl-3 font-semibold min-w-[50%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "100%", flexDirection: "column" }} >
                                                    <h6>Delivery Time:</h6>
                                                    <input type="text" placeholder="Enter Delivery Time..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: "1px solid black", borderRadius: "10px", width: "100%" }} value={singleUserData?.deliveryTime} onChange={(e) => setSingleUserData({ ...singleUserData, deliveryTime: e.target.value })} />
                                                </div>
                                            </div>
                                        ) : (
                                            null
                                        )
                                    }
                                    <div className='flex md:flex-row flex-col min-w-[100%]' style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", marginBottom: "20px", width: "100%" }}  >
                                        {
                                            singleUserData?.isDelivery == true ? (
                                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' >
                                                    <h6>Delivery Type:</h6>
                                                    {
                                                        singleUserData?.isFreeDelivery == true ? (
                                                            <Form.Check
                                                                type="switch"
                                                                checked
                                                                id="custom-switch"
                                                                label="make it as free"
                                                                onChange={(e) => setSingleUserData({ ...singleUserData, isFreeDelivery: false })}
                                                            />
                                                        ) : (
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label="make as Not free"
                                                                onChange={(e) => setSingleUserData({ ...singleUserData, isFreeDelivery: true })}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                null
                                            )
                                        }
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", width: "370px", flexDirection: "column" }}  >
                                            <h6 className="pb-0" >City:</h6>
                                            <input type="text" placeholder="Enter City ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%" }} value={singleUserData?.phoneNo} onChange={(e) => setSingleUserData({ ...singleUserData, phoneNo: e.target.value })} />
                                        </div>
                                    </div>
                                    {
                                        singleUserData?.is24HoursOpen === false || singleUserData?.is24HoursOpen === undefined ? (
                                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", minWidth: "100%" }}  >
                                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "48%", maxWidth: "48%" }} >
                                                    <h6>Opening Time</h6>
                                                    <input type="time" placeholder="Enter Delivery Time ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%", borderRadius: "5px", minWidth: "100%" }} value={singleUserData?.openingTime} onChange={(e) => setSingleUserData({ ...singleUserData, openingTime: e.target.value })} />
                                                </div>
                                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "50%", maxWidth: "50%" }} >
                                                    <h6>Closing Time</h6>
                                                    <input type="time" placeholder="Enter Delivery Time ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "10px", width: "100%", borderRadius: "5px", minWidth: "100%" }} value={singleUserData?.closingTime} onChange={(e) => setSingleUserData({ ...singleUserData, closingTime: e.target.value })} />
                                                </div>
                                            </div>
                                        ) : (
                                            null
                                        )
                                    }
                                    <div className='flex md:flex-row flex-col pt-1  min-w-[100%]' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "15px" }}>
                                        <div className='flex flex-col pl-3 font-semibold md:max-w-[50%] w-full' style={{ display: "flex", justifyContent: "flex-start", width: "100%", flexDirection: "column" }}>
                                            <h6>Select Tags:</h6>
                                            <select class="form-select" multiple aria-label="Default select example" >
                                                {
                                                    desiredTags?.length > 0 ? (
                                                        desiredTags?.map((item) => (
                                                            singleUserData?.tags?.find(itemOne => itemOne == item.value) ? (
                                                                <option value={item?.value} selected onClick={() => addMyTagsUpdate(item?.value)} >{item?.label}</option>
                                                            ) : (
                                                                <option value={item?.value} onClick={() => addMyTagsUpdate(item?.value)} >{item?.label}</option>
                                                            )
                                                        ))
                                                    ) : (
                                                        <option >No tags Found</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[100%]' style={{ display: "flex", justifyContent: "center", flexDirection: "column", minWidth: "100%" }} >
                                        <h6>Description:</h6>
                                        <textArea rows="8" placeholder="Enter Description ..." style={{ borderRadius: "10px", padding: "10px", border: "1px solid black", width: "100%" }} onChange={(e) => setSingleUserData({ ...singleUserData, desc: e.target.value })} >
                                            {singleUserData?.desc}
                                        </textArea>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    {
                        isSending === true ? (
                            <h4>Please wait...</h4>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={handleViewClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={updateData} >Update Now</Button>
                            </>
                        )
                    }
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default PartnerViewAllMenus