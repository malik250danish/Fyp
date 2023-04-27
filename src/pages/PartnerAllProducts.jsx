import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Table, Modal } from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllProductsOfOwner, getAllProductsDropDown, getAllMenusForDropdown, getAllRestaurantsDropDown, getAllCategoriesForDropdown, getAllSubCategoriesForDropdown, addNewProduct, getSingleProductDetails, updateSingleProduct, updateSingleProductStatus } from "../api/PartnerApi"
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';

const PartnerViewAllMenus = ({ socket }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    document.title = `Products`

    const [active, setActive] = useState(false)
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
                const { data } = await getAllProductsOfOwner();
                if (data?.success === true) {
                    setAllOrders(data?.AllProducts)

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
        price: "",
        tags: [],
        menu: "",
        restaurant: "",
        parentCategory: "",
        subCategory: "",
        allergens: [],
        image: uploadImage
    })

    // sending data
    const addNewRecord = async () => {
        if (userData?.name == "" || userData?.price == "" || userData?.owner == "" || userData?.restaurant == "" || userData?.parentCategory == "" || userData?.subCategory == "" || uploadImage == null) {
            toast.warning("Please all Fields")
            return;
        } else {
            setIsSending(true)
            let formData = new FormData();
            formData.append("myProductImage", uploadImage)
            formData.append("name", userData?.name)
            formData.append("price", userData?.price)
            if (userData?.tags?.length > 0) {
                formData.append("tags", JSON.stringify(userData?.tags))
            }
            formData.append("menu", userData?.menu)
            formData.append("parentCategory", userData?.parentCategory)
            formData.append("subCategory", userData?.subCategory)
            formData.append("restaurant", userData?.restaurant)
            if (userData?.allergens?.length > 0) {
                formData.append("allergens", JSON.stringify(userData?.allergens))
            }
            if (singleRecord?.menu != undefined) {
                formData.append("menu", userData?.menu)
            }
            const { data } = await addNewProduct(userData);
            if (data?.success === true) {
                toast.success("New Product Added SuccessFully")
                setUploadImage(null)
                setUserData({
                    name: "",
                    price: "",
                    tags: [],
                    menu: "",
                    restaurant: "",
                    parentCategory: "",
                    subCategory: "",
                    allergens: [],
                })

                // again getting all data
                setIsFetching(true)
                const response = await getAllProductsOfOwner();
                if (response?.data?.success === true) {
                    setAllOrders(response?.data?.AllProducts)
                }
                setIsFetching(false)
                handleClose()
            } else {
                toast.error(data?.error)
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
        const { data } = await getSingleProductDetails(id);
        if (data?.success === true) {
            setSingleRecord(data?.Product)
        } else {
            toast.error(data?.message)
        }
        setIsGetting(false)
    }

    // changing status
    const changeStatus = async (id) => {
        let isFound = allOrders.find(item => item._id == id);
        if (isFound) {
            const { data } = await updateSingleProductStatus(id);
            if (data?.success === true) {
                if (isFound.status == false) {
                    isFound.status = true
                    toast.success("Product Activated Successfully");
                } else {
                    isFound.status = false
                    toast.success("Product InActivated Successfully");
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
        formData.append("price", singleRecord?.price)
        if (singleRecord?.tags?.length > 0) {
            formData.append("tags", JSON.stringify(singleRecord?.tags))
        }
        if (singleRecord?.menu != undefined) {
            formData.append("menu", singleRecord?.menu)
        }
        formData.append("parentCategory", singleRecord?.parentCategory)
        formData.append("subCategory", singleRecord?.subCategory)
        formData.append("restaurant", singleRecord?.restaurant)
        console.log("checking =====> : ", formData.get('tags'))
        if (singleRecord?.allergens?.length > 0) {
            formData.append("allergens", JSON.stringify(singleRecord?.allergens))
        }
        if (uploadImage !== null) {
            formData.append("myProductImage", uploadImage)
        }
        const { data } = await updateSingleProduct(formData, singleRecord._id);
        if (data?.success === true) {
            toast.success(data?.message)
            setUploadImage(null)
            setSingleRecord(null)

            // getting updated data
            setIsFetching(true)
            const res = await getAllProductsOfOwner();
            if (res?.data?.success === true) {
                setAllOrders(res?.data?.AllProducts)
            }
            setIsFetching(false)

            handleViewClose()
        } else {
            toast.error(data?.message)
        }
        setIsSending(false)
    }

    // adding allergens on adding
    const addMyAllergens = (allergen) => {
        let newArr = userData;
        let isFound = newArr?.allergens?.find(item => item == allergen)
        if (isFound) {
            let myNewArr = newArr?.allergens?.filter(item => item != allergen);
            newArr.allergens = myNewArr
        } else {
            if (!newArr.allergens) {
                newArr.allergens = []
            }
            newArr.allergens.push(allergen)
        }
        setUserData(newArr)
    }

    // adding allergens on adding
    const addMyAllergensUpdate = (allergen) => {
        let newArr = singleRecord;
        let isFound = newArr?.allergens?.find(item => item == allergen)
        if (isFound) {
            let myNewArr = newArr?.allergens?.filter(item => item != allergen);
            newArr.allergens = myNewArr
        } else {
            if (!newArr.allergens) {
                newArr.allergens = []
            }
            newArr.allergens.push(allergen)
        }
        setSingleRecord(newArr)
    }

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
        let newArr = singleRecord;
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
        setSingleRecord(newArr)
    }

    const allergens = [
        { label: "Milk", value: "Milk" },
        { label: "Eggs", value: "Eggs" },
        { label: "Fish", value: "Fish" },
        { label: "Crustacean Shellfish", value: "Crustacean Shellfish" },
        { label: "Wheat", value: "Wheat" },
        { label: "Soybeans", value: "Soybeans" },
    ]

    const tags = [
        { label: "Baked", value: "Baked" },
        { label: "Dairy ", value: "Dairy " },
        { label: "Edible ", value: "Edible " },
        { label: "Edible Nuts", value: "Edible Nuts" },
        { label: "Legumes", value: "Legumes" },
        { label: "Starchy ", value: "Starchy " },
    ]

    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <h1 className='partner-heading mb-4'>All Products</h1>
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
                                    style={{ overflowY: "scroll", minHeight: "100vh" }}
                                >
                                    <Table responsive striped bordered hover style={{ marginTop: "25px" }} >
                                        <thead  >
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Tags</th>
                                                <th>Menu</th>
                                                <th>Restaurant</th>
                                                <th>Category</th>
                                                <th>Sub Category</th>
                                                <th>Rating</th>
                                                <th>Allergens</th>
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
                                                                        <img alt="product image" src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.thumbnail} style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "10px" }} />
                                                                    </div>
                                                                </td>
                                                                <td>{item?.price}</td>
                                                                <td>
                                                                    {
                                                                        item?.tags?.map((itemOne) => (
                                                                            <p>{itemOne},</p>
                                                                        ))
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} >
                                                                        {item?.menu?.name}
                                                                        {/* <img alt="restaurant image" style={{maxWidth : "50px" , maxHeight : "50px" , borderRadius : "10px"}} src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.menu?.image} /> */}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} >
                                                                        {item?.restaurant?.name}
                                                                        {/* <img alt="restaurant image" style={{maxWidth : "50px" , maxHeight : "50px" , borderRadius : "10px"}} src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.restaurant?.logo} /> */}
                                                                    </div>
                                                                </td>
                                                                <td>{item?.parentCategory?.name}</td>
                                                                <td>{item?.subCategory?.name}</td>
                                                                <td>{item?.rating} ({item?.ratingCount})</td>
                                                                <td>
                                                                    {
                                                                        item?.allergens?.map((itemOne) => (
                                                                            <p>{itemOne},</p>
                                                                        ))
                                                                    }
                                                                </td>
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
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex justify-center min-w-[100%]" >
                        <div className='flex justify-center flex-col align-center pb-4 md:min-w-[600px] min-w-[300px] max-w-[700px]  w-[100%]  pt-3' >
                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }} >
                                <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ minWidth: "48%" }} >
                                    <h6 className="pb-1" >Products Name:(*)</h6>
                                    <input type="text" placeholder="Enter Name ..." className='min-h-[35px] p-2 rounded-md min-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "5px", minWidth: "100%" }} value={userData?.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                                </div>
                                <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ minWidth: "50%" }}   >
                                    <h6 className="pb-1" >Price:(*)</h6>
                                    <input type="number" placeholder="Enter Price ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "5px", minWidth: "100%" }} value={userData?.price} onChange={(e) => setUserData({ ...userData, price: e.target.value })} />
                                </div>
                            </div>
                            <h6>Product Image(*)</h6>
                            <div className='flex flex-row font-semibold max-w-[50%]' style={{ display: "flex", width: "100%" }}  >
                                <input type="file" accept="image/*" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' onChange={(e) => setUploadImage(e.target.files[0])} />
                                {
                                    uploadImage !== null && (
                                        <div className="flex justify-between mb-5 mt-4">
                                            <img src={URL.createObjectURL(uploadImage)} alt="cover pic" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '10px', marginRight: "40" }} />
                                            <Button variant="danger" size="sm" className='bg-[#e74c3c] mt-3 ml-6 rounded-md p-2 text-white font-semibold mx-auto max-h-[40px]' onClick={() => setUploadImage(null)} >Remove</Button>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}  >
                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "48%", maxWidth: "48%" }} >
                                    <h6>Choose Restaurant:(*)</h6>
                                    <select class="form-select" aria-label="Default select example" onChange={(e) => setUserData({ ...userData, restaurant: e.target.value })}>
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
                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "50%", maxWidth: "50%" }} >
                                    <h6>Select Menu:</h6>
                                    <select class="form-select" aria-label="Default select example" onChange={(e) => setUserData({ ...userData, menu: e.target.value })}>
                                        <option selected disabled>select menu</option>
                                        {
                                            allMenus?.length > 0 ? (
                                                allMenus?.map((item) => (
                                                    <option value={item?._id} >{item?.name}</option>
                                                ))
                                            ) : (
                                                <option >No Menu Found</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}  >
                                <div className='flex md:flex-row flex-col pt-1  max-w-[50%]' style={{ minWidth: "48%" }}>
                                    <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                        <h6>Category:(*)</h6>
                                        <select class="form-select" aria-label="Default select example" onChange={(e) => setUserData({ ...userData, parentCategory: e.target.value })}>
                                            <option selected disabled>select category</option>
                                            {
                                                allCategories?.length > 0 ? (
                                                    allCategories?.map((item) => (
                                                        <option value={item?._id} >{item?.name}</option>
                                                    ))
                                                ) : (
                                                    <option >No Categroies Found</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "50%" }} >
                                    <h6>Sub Category:(*)</h6>
                                    <select class="form-select" aria-label="Default select example" onChange={(e) => setUserData({ ...userData, subCategory: e.target.value })}>
                                        <option selected disabled>select sub category</option>
                                        {
                                            allSubCategories?.length > 0 ? (
                                                allSubCategories?.map((item) => (
                                                    <option value={item?._id} >{item?.name}</option>
                                                ))
                                            ) : (
                                                <option >No Sub Categories Found</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}  >
                                <div className='flex md:flex-row flex-col pt-1  max-w-[50%]' style={{ minWidth: "48%" }}>
                                    <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                        <h6>Tags:</h6>
                                        <select class="form-select" multiple aria-label="Default select example" >
                                            {
                                                tags?.length > 0 ? (
                                                    tags?.map((item) => (
                                                        <option value={item?.value} onClick={() => addMyTags(item?.value)} >{item?.label}</option>
                                                    ))
                                                ) : (
                                                    <option >No tags Found</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='flex md:flex-row flex-col pt-1  max-w-[50%]' style={{ minWidth: "50%" }}>
                                    <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                        <h6>Allergens:</h6>
                                        <select class="form-select" multiple aria-label="Default select example" >
                                            {
                                                allergens?.length > 0 ? (
                                                    allergens?.map((item) => (
                                                        <option value={item?.value} onClick={() => addMyAllergens(item?.value)} >{item?.label}</option>
                                                    ))
                                                ) : (
                                                    <option >No Allergens Found</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
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
                    <Modal.Title>View Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        isGetting === true ? (
                            <h4>Getting Details</h4>
                        ) : (
                            <div className="flex justify-center min-w-[100%]" >
                                <div className='flex justify-center flex-col align-center pb-4 md:min-w-[600px] min-w-[300px] max-w-[700px]  w-[100%]  pt-3' >
                                    <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }} >
                                        <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ minWidth: "48%" }} >
                                            <h6 className="pb-1" >Products Name:</h6>
                                            <input type="text" placeholder="Enter Name ..." className='min-h-[35px] p-2 rounded-md min-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "5px", minWidth: "100%" }} value={singleRecord?.name} onChange={(e) => setSingleRecord({ ...singleRecord, name: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col  pl-3 font-semibold min-w-[100%]' style={{ minWidth: "50%" }}   >
                                            <h6 className="pb-1" >Price:</h6>
                                            <input type="number" placeholder="Enter Price ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72] ' style={{ border: "1px solid black", borderRadius: "5px", minWidth: "100%" }} value={singleRecord?.price} onChange={(e) => setSingleRecord({ ...singleRecord, price: e.target.value })} />
                                        </div>
                                    </div>
                                    <h6>Product Image</h6>
                                    <div className='flex flex-row font-semibold max-w-[50%]' style={{ display: "flex", width: "100%" }}  >
                                        <img alt="product image" style={{ maxWidth: "70px", maHeight: "70px", borderRadius: "10px" }} src={"https://fivechefapp.cyclic.app" + "/productImages/" + singleRecord?.thumbnail} />
                                        <input type="file" accept="image/*" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' onChange={(e) => setUploadImage(e.target.files[0])} />
                                        {
                                            uploadImage !== null && (
                                                <div className="flex justify-between mb-5 mt-4">
                                                    <img src={URL.createObjectURL(uploadImage)} alt="cover pic" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '10px', marginRight: "40" }} />
                                                    <Button variant="danger" size="sm" className='bg-[#e74c3c] mt-3 ml-6 rounded-md p-2 text-white font-semibold mx-auto max-h-[40px]' onClick={() => setUploadImage(null)} >Remove</Button>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}  >
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "48%", maxWidth: "48%" }} >
                                            <h6>Choose Restaurant:</h6>
                                            <select class="form-select" aria-label="Default select example" onChange={(e) => setSingleRecord({ ...singleRecord, restaurant: e.target.value })}>
                                                <option selected disabled>select restaurant</option>
                                                {
                                                    allRestaurants?.length > 0 ? (
                                                        allRestaurants?.map((item) => (
                                                            singleRecord?.restaurant == item?._id ? (
                                                                <option value={item?._id} selected >{item?.name}</option>
                                                            ) : (
                                                                <option value={item?._id} >{item?.name}</option>
                                                            )
                                                        ))
                                                    ) : (
                                                        <option >No Restaurants Found</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "50%", maxWidth: "50%" }} >
                                            <h6>Select Menu:</h6>
                                            <select class="form-select" aria-label="Default select example" onChange={(e) => setSingleRecord({ ...singleRecord, menu: e.target.value })}>
                                                <option selected disabled>select menu</option>
                                                {
                                                    allMenus?.length > 0 ? (
                                                        allMenus?.map((item) => (
                                                            singleRecord?.menu == item?._id ? (
                                                                <option value={item?._id} selected >{item?.name}</option>
                                                            ) : (
                                                                <option value={item?._id} >{item?.name}</option>
                                                            )
                                                        ))
                                                    ) : (
                                                        <option >No Menu Found</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}  >
                                        <div className='flex md:flex-row flex-col pt-1  max-w-[50%]' style={{ minWidth: "48%" }}>
                                            <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                                <h6>Category:</h6>
                                                <select class="form-select" aria-label="Default select example" onChange={(e) => setSingleRecord({ ...singleRecord, parentCategory: e.target.value })}>
                                                    <option selected disabled>select category</option>
                                                    {
                                                        allCategories?.length > 0 ? (
                                                            allCategories?.map((item) => (
                                                                singleRecord?.parentCategory == item?._id ? (
                                                                    <option value={item?._id} selected >{item?.name}</option>
                                                                ) : (
                                                                    <option value={item?._id} >{item?.name}</option>
                                                                )
                                                            ))
                                                        ) : (
                                                            <option >No Categroies Found</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className='flex flex-col pt-2 pl-3 font-semibold min-w-[50%]' style={{ minWidth: "50%" }} >
                                            <h6>Sub Category:</h6>
                                            <select class="form-select" aria-label="Default select example" onChange={(e) => setSingleRecord({ ...singleRecord, subCategory: e.target.value })}>
                                                <option selected disabled>select sub category</option>
                                                {
                                                    allSubCategories?.length > 0 ? (
                                                        allSubCategories?.map((item) => (
                                                            singleRecord?.subCategory == item?._id ? (
                                                                <option value={item?._id} selected >{item?.name}</option>
                                                            ) : (
                                                                <option value={item?._id} >{item?.name}</option>
                                                            )
                                                        ))
                                                    ) : (
                                                        <option >No Sub Categories Found</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='flex md:flex-row flex-col min-w-[100%]' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}  >
                                        <div className='flex md:flex-row flex-col pt-1  max-w-[50%]' style={{ minWidth: "48%" }}>
                                            <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                                <h6>Tags:</h6>
                                                <select class="form-select" multiple aria-label="Default select example" >
                                                    {
                                                        tags?.length > 0 ? (
                                                            tags?.map((item) => (
                                                                singleRecord?.tags?.find(itemOne => itemOne == item.value) ? (
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
                                        <div className='flex md:flex-row flex-col pt-1  max-w-[50%]' style={{ minWidth: "50%" }}>
                                            <div className='flex md:flex-col flex-col pt-2  min-w-[100%]'>
                                                <h6>Allergens:</h6>
                                                <select class="form-select" multiple aria-label="Default select example" >
                                                    {
                                                        allergens?.length > 0 ? (
                                                            allergens?.map((item) => (
                                                                singleRecord?.allergens?.find(itemOne => itemOne == item.value) ? (
                                                                    <option value={item?.value} selected onClick={() => addMyAllergensUpdate(item?.value)} >{item?.label}</option>
                                                                ) : (
                                                                    <option value={item?.value} onClick={() => addMyAllergensUpdate(item?.value)} >{item?.label}</option>
                                                                )
                                                            ))
                                                        ) : (
                                                            <option >No Allergens Found</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </div>
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