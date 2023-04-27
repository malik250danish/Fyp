import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Table, Modal } from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllMenusOfPartner, getAllProductsDropDown, getAllRestaurantsDropDown, getAllProductsOfRestaurant, addNewMenu, getANyMenuDetails, updateSingleMenu, updateSingleMenuStatus } from "../api/PartnerApi"
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';

const PartnerViewAllMenus = ({ socket }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    document.title = `Menus`

    const handleOpen = () => {
        setActive(!active)
    }

    const [allOrders, setAllOrders] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [singleRecord, setSingleRecord] = useState(null)
    const [isGetting, setIsGetting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [uploadImage, setUploadImage] = useState(null)
    const [partnerAllProds, setAllPartnerProds] = useState([])
    const [selectedParent, setSelectedParent] = useState([])
    const [allRestaurants, setAllRestaurants] = useState([])
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
                const { data } = await getAllMenusOfPartner();
                if (data?.success === true) {
                    setAllOrders(data?.AllMenus)

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

                } else {
                    toast.error(data?.message)
                }
            }
        }

        getData()
    }, [isPartnerSignInSuccess])

    // getting top menus on scroll
    const getTopMyMoreOrders = async () => {
        let partnerToken = cookies.get('fiveChefsPartnersTempToken')
        if (!partnerToken) {
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
    const handleClose = () => {
        setShow(false);
        setAllPartnerProds([])
    }
    const handleShow = () => setShow(true);


    const [userData, setUserData] = useState({
        name: "",
        restaurant: "",
        products: [],
    })

    // sending data
    const addNewRecord = async () => {
        if (userData?.name === "" || userData?.name == "" || userData?.name == "" || uploadImage == null) {
            toast.warning("Please all Fields")
            return;
        } else {
            setIsSending(true)
            let formData = new FormData();
            formData.append("name", userData?.name)
            formData.append("restaurant", userData?.restaurant)
            formData.append("menuImage", uploadImage)
            formData.append("products", JSON.stringify(userData?.products))
            const { data } = await addNewMenu(userData);
            if (data?.success === true) {
                toast.success("New Menu Added SuccessFully")
                setUploadImage(null)
                setUserData({
                    name: "",
                    restaurant: "",
                    products: [],
                })

                setIsFetching(true)
                const { data } = await getAllMenusOfPartner();
                if (data?.success === true) {
                    setAllOrders(data?.AllMenus)
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
    const handleViewClose = () => {
        setViewRecord(false)
        setAllPartnerProds([])
    };
    const handleViewRecord = async (id) => {
        setViewRecord(true);
        setIsGetting(true)
        const { data } = await getANyMenuDetails(id);
        if (data?.success === true) {
            setSingleRecord(data?.Menu)
        } else {
            toast.error(data?.message)
        }
        setIsGetting(false)
    }

    // changing status
    const changeStatus = async (id) => {
        let isFound = allOrders.find(item => item._id == id);
        if (isFound) {
            const { data } = await updateSingleMenuStatus(id);
            if (data?.success === true) {
                if (isFound.status == false) {
                    isFound.status = true
                    toast.success("Menu Activated Successfully");
                } else {
                    isFound.status = false
                    toast.success("Menu InActivated Successfully");
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
        formData.append("name", singleRecord?.name)
        formData.append("restaurant", singleRecord?.restaurant)
        if (uploadImage !== null) {
            console.log("image appended")
            formData.append("menuImage", uploadImage)
        }
        formData.append("products", JSON.stringify(singleRecord?.products))
        const { data } = await updateSingleMenu(singleRecord._id, formData);
        if (data?.success === true) {
            toast.success(data?.message)

            // getting updated data
            setIsFetching(true)
            const res = await getAllMenusOfPartner();
            if (res?.data?.success === true) {
                setAllOrders(res?.data?.AllMenus)
            }
            setIsFetching(false)

            handleViewClose()
        } else {
            toast.error(data?.message)
        }
        setIsSending(false)
    }

    // getting relevant sub categories
    useEffect(() => {
        const getSubCate = async () => {
            const { data } = await getAllProductsOfRestaurant(selectedParent);
            if (data?.success === true) {
                setAllPartnerProds(data?.AllProducts)
            } else {
                setAllPartnerProds([])
            }
        }
        if (selectedParent !== "") {
            getSubCate()
        }
    }, [selectedParent])

    // adding products to array
    const addMyNewProductsToArr = (id) => {
        let newArr = userData;
        let isFound = newArr?.products?.find(item => item == id);
        if (!isFound) {
            if (!newArr?.products) {
                newArr.products = []
            }
            newArr?.products?.push(id)
        } else {
            let myArr = newArr?.products?.filter(item => item != id)
            newArr.products = myArr
        }
        setUserData(newArr)
    }

    // adding products to array
    const addMyNewProductsToArrNew = (myItem) => {
        let newArr = singleRecord;
        let isFound = newArr.products.find(item => item == myItem)
        if (isFound == undefined) {
            newArr.products.push(myItem)
        } else {
            let newMyArr = newArr?.products?.filter(item => item != myItem)
            newArr.products = newMyArr
        }
        setSingleRecord(newArr)
    }

    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <h1 className='partner-heading mb-4'>All Menus</h1>
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
                                            <strong>No More Menus.</strong>
                                        </p>
                                    }
                                    style={{ overflowY: "scroll", minHeight: "100vh" }}
                                >
                                    <Table responsive striped bordered hover style={{ marginTop: "25px" }} >
                                        <thead  >
                                            <tr>
                                                <th>Name</th>
                                                <th>Restaurant</th>
                                                <th>Rating</th>
                                                <th>Sales</th>
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
                                                                        <img alt="menu image" src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.image} style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} >
                                                                        {item?.restaurant?.name}
                                                                        {/* <img alt="restaurant image" style={{maxWidth : "50px" , maxHeight : "50px" , borderRadius : "10px"}} src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.restaurant?.logo} /> */}
                                                                    </div>
                                                                </td>
                                                                <td>{item?.rating} ({item?.ratingCount})</td>
                                                                <td>{item?.totalSales}</td>
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
                    <Modal.Title>Add New Menu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex justify-center min-w-[100%]" >
                        <div className='flex justify-center flex-col align-center pb-4 md:min-w-[600px] min-w-[300px] max-w-[700px]  w-[100%]  pt-3' >
                            <div className='flex md:flex-row flex-col min-w-[100%]'  >
                                <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ marginBottom: "20px" }} >
                                    <h6 className="pb-1" >Menu Title:</h6>
                                    <input type="text" placeholder="Enter Title ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "5px", minWidth: "100%" }} value={userData?.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                                </div>
                                <div className='flex flex-col font-semibold min-w-[50%]' style={{ marginBottom: "20px" }} >
                                    <h6>Menu Picture (optional)</h6>
                                    <input type="file" accept="image/*" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' onChange={(e) => setUploadImage(e.target.files[0])} />
                                    {
                                        uploadImage !== null && (
                                            <div className="flex justify-between mb-5 mt-4">
                                                <img src={URL.createObjectURL(uploadImage)} alt="cover pic" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '10px' }} />
                                                <button className='bg-[#e74c3c] mt-3 rounded-md p-2 text-white font-semibold mx-auto max-h-[40px]' onClick={() => setUploadImage(null)} >Remove</button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='flex md:flex-row flex-col pt-1  min-w-[100%]' style={{ marginBottom: "20px" }}>
                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' >
                                    <h6>Restaurant:</h6>
                                    <select class="form-select" aria-label="Default select example" onChange={(e) => { setUserData({ ...userData, restaurant: e.target.value }); setSelectedParent(e.target.value) }}>
                                        <option selected disabled>select restaurant</option>
                                        {
                                            allRestaurants?.length > 0 ? (
                                                allRestaurants?.map((item) => (
                                                    <option value={item?._id} >{item?.name}</option>
                                                ))
                                            ) : (
                                                <option >No Restaurants Found</option>
                                            )
                                        }
                                    </select>
                                </div>

                            </div>
                            <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                <h6>Products:</h6>
                                {
                                    partnerAllProds?.length > 0 ? (
                                        <select multiple class="form-select" aria-label="Default select example">
                                            {
                                                partnerAllProds?.length > 0 ? (
                                                    partnerAllProds?.map((item) => (
                                                        <option value={item?._id} onClick={() => addMyNewProductsToArr(item._id)} >{item?.name}</option>
                                                    ))
                                                ) : (
                                                    <option >No Products Found</option>
                                                )
                                            }
                                        </select>
                                    ) : (
                                        null
                                    )
                                }
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
                    <Modal.Title>View Menu Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        isGetting === true ? (
                            <h4>Getting Details</h4>
                        ) : (
                            <div className="flex justify-center min-w-[100%]" >
                                <div className='flex justify-center flex-col align-center pb-4 md:min-w-[600px] min-w-[300px] max-w-[700px]  w-[100%]  pt-3' >
                                    <div className='flex md:flex-row flex-col min-w-[100%]'  >
                                        <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ marginBottom: "20px" }} >
                                            <h6 className="pb-1" >Menu Title:</h6>
                                            <input type="text" placeholder="Enter Title ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "5px", minWidth: "100%" }} value={singleRecord?.name} onChange={(e) => setSingleRecord({ ...singleRecord, name: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col font-semibold min-w-[50%]' style={{ marginBottom: "20px" }} >
                                            <h6>Menu Picture</h6>
                                            <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + singleRecord?.image} alt="cover pic" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '10px', margin: 'auto' }} />
                                            {
                                                uploadImage !== null && (
                                                    <div className="flex justify-between mb-5 mt-4">
                                                        <img src={URL.createObjectURL(uploadImage)} alt="cover pic" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '10px' }} />
                                                        <button className='bg-[#e74c3c] mt-3 rounded-md p-2 text-white font-semibold mx-auto max-h-[40px]' onClick={() => setUploadImage(null)} >Remove</button>
                                                    </div>
                                                )
                                            }
                                            <input type="file" accept="image/*" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' onChange={(e) => setUploadImage(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <div className='flex md:flex-row flex-col pt-1  min-w-[100%]' style={{ marginBottom: "20px" }}>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' >
                                            <h6>Restaurant:</h6>
                                            <select class="form-select" aria-label="Default select example" onChange={(e) => { setSingleRecord({ ...singleRecord, restaurant: e.target.value }); setSelectedParent(e.target.value) }}>
                                                <option selected disabled>select restaurant</option>
                                                {
                                                    allRestaurants?.length > 0 ? (
                                                        allRestaurants?.map((item) => (
                                                            singleRecord?.restaurant == item?._id ? (
                                                                <option value={item?._id} selected>{item?.name}</option>
                                                            ) : (
                                                                <option value={item?._id}>{item?.name}</option>
                                                            )
                                                        ))) : (
                                                        <option >No Restaurants Found</option>
                                                    )
                                                }
                                            </select>
                                        </div>

                                    </div>
                                    <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                        <h6>Products:</h6>
                                        {
                                            selectedParent !== "" && (
                                                <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                                    <h6>Products:</h6>
                                                    <select multiple class="form-select" aria-label="Default select example" onChange={(e) => console.log("id got : ", e.target.value)}>
                                                        {
                                                            partnerAllProds?.length > 0 ? (
                                                                partnerAllProds?.map((item) => (
                                                                    singleRecord?.products?.find(e => e._id == item?._id) ? (
                                                                        <option value={item?._id} selected onClick={() => addMyNewProductsToArrNew(item._id)} >{item?.name}</option>
                                                                    ) : (
                                                                        <option value={item?._id} onClick={() => addMyNewProductsToArrNew(item._id)} >{item?.name}</option>
                                                                    )
                                                                ))
                                                            ) : (
                                                                <option >No Products Found</option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            )
                                        }
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