import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Table, Modal } from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllCoupons, getAllProductsDropDown, getAllMenusForDropdown, getAllRestaurantsDropDown, getAllCategoriesForDropdown, getAllSubCategoriesForDropdown, addNewCoupon, getSingleCouponDetails, updateSingleCoupon, updateSingleCouponStatus } from "../api/PartnerApi"
import Dropdown from 'react-bootstrap/Dropdown';
import moment from "moment"
import Cookies from 'universal-cookie';

const PartnerViewAllMenus = ({ socket }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    document.title = `Coupons`

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
                const { data } = await getAllCoupons();
                console.log("all coupons : ", data)
                if (data?.success === true) {
                    setAllOrders(data?.AllCoupons)

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
        disPercent: "",
        expiryDate: "",
        minAmountForCoupon: "",
        startDate: "",
    })

    // sending data
    const addNewRecord = async () => {
        if (userData?.disPercent == "" || userData?.expiryDate == "" || userData?.minAmountForCoupon == "" || userData?.startDate == "") {
            toast.warning("Please All Fields")
            return;
        } else {
            setIsSending(true)
            const { data } = await addNewCoupon(userData);
            if (data?.success === true) {
                toast.success("New Coupon Added SuccessFully")
                setUploadImage(null)
                setUserData({
                    disPercent: "",
                    expiryDate: "",
                    minAmountForCoupon: "",
                    startDate: "",
                })

                // again getting all data
                setIsFetching(true)
                const response = await getAllCoupons();
                if (response?.data?.success === true) {
                    setAllOrders(response?.data?.AllCoupons)
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
        const { data } = await getSingleCouponDetails(id);
        if (data?.success === true) {
            setSingleRecord(data?.Coupon)
        } else {
            toast.error(data?.message)
        }
        setIsGetting(false)
    }

    // changing status
    const changeStatus = async (id) => {
        let isFound = allOrders.find(item => item._id == id);
        if (isFound) {
            const { data } = await updateSingleCouponStatus(id);
            if (data?.success === true) {
                if (isFound.isActive == false) {
                    isFound.isActive = true
                    toast.success("Coupon Activated Successfully");
                } else {
                    isFound.isActive = false
                    toast.success("Coupon InActivated Successfully");
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
        const { data } = await updateSingleCoupon(singleRecord._id, singleRecord);
        if (data?.success === true) {
            toast.success(data?.message)
            setIsFetching(true)
            const res = await getAllCoupons();
            if (res?.data?.success === true) {
                setAllOrders(res?.data?.AllCoupons)
            }
            setIsFetching(false)
            handleViewClose()
        } else {
            toast.error(data?.message)
        }

        setIsSending(false)
    }

    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <h1 className='partner-heading mb-4'>All Coupons</h1>
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
                                    style={{ overFlow: "scroll", minHeight: "100vh" }}
                                >
                                    <Table responsive striped bordered hover style={{ marginTop: "25px" }} >
                                        <thead  >
                                            <tr>
                                                <th>Code</th>
                                                <th>Discount</th>
                                                <th>min Amount</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>desc</th>
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
                                                                    {item?.code}
                                                                </td>
                                                                <td>{item?.disPercent}%</td>
                                                                <td>{item?.minAmountForCoupon}$</td>
                                                                <td>
                                                                    {moment(item?.startDate).format("DD-MM-YY")}
                                                                </td>
                                                                <td>
                                                                    {moment(item?.expiryDate).format("DD-MM-YY")}
                                                                </td>
                                                                <td>{item?.desc}</td>
                                                                <td>
                                                                    <Dropdown>
                                                                        <Dropdown.Toggle variant="info" size="sm" id="dropdown-basic">
                                                                            {
                                                                                item?.isActive === true ? (
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

            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Coupon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex justify-center" >
                        <div className='flex justify-center flex-col align-center pb-4  max-w-[400px] w-[100%] mx-auto pt-3' >
                            <div className='flex flex-col pl-3 font-semibold' >
                                <h6>Discount Percentage Amount:</h6>
                                <input type="number" placeholder="Enter Please ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={userData?.disPercent} onChange={(e) => setUserData({ ...userData, disPercent: e.target.value })} />
                            </div>
                            <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                <h6>Start Date:</h6>
                                <input type="date" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={userData?.startDate} onChange={(e) => setUserData({ ...userData, startDate: e.target.value })} />
                            </div>
                            <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                <h6>End Date:</h6>
                                <input type="date" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={userData?.expiryDate} onChange={(e) => setUserData({ ...userData, expiryDate: e.target.value })} />
                            </div>
                            <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                <h6>Min Amount to Apply Coupon:</h6>
                                <input type="number" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={userData?.minAmountForCoupon} onChange={(e) => setUserData({ ...userData, minAmountForCoupon: e.target.value })} />
                            </div>
                            <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                <h6>Description (any):</h6>
                                <textArea type="text" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={userData?.desc} onChange={(e) => setUserData({ ...userData, desc: e.target.value })} />
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
                    <Modal.Title>View Coupon Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        isGetting === true ? (
                            <h4>Getting Details</h4>
                        ) : (
                            <div className="flex justify-center" >
                                <div className='flex justify-center flex-col align-center pb-4  max-w-[400px] w-[100%] mx-auto pt-3' >
                                    <div className='flex flex-col pl-3 font-semibold' >
                                        <h6>Discount Percentage Amount:</h6>
                                        <input type="number" placeholder="Enter Please ..." className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={singleRecord?.disPercent} onChange={(e) => setSingleRecord({ ...singleRecord, disPercent: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                        <h6>Start Date:</h6>
                                        <input type="date" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={moment(singleRecord?.startDate).format("YYYY-MM-DD")} onChange={(e) => setSingleRecord({ ...singleRecord, startDate: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                        <h6>End Date:</h6>
                                        <input type="date" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={moment(singleRecord?.expiryDate).format("YYYY-MM-DD")} onChange={(e) => setSingleRecord({ ...singleRecord, expiryDate: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                        <h6>Min Amount to Apply Coupon:</h6>
                                        <input type="number" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} value={singleRecord?.minAmountForCoupon} onChange={(e) => setSingleRecord({ ...singleRecord, minAmountForCoupon: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col pt-5 pl-3 font-semibold' >
                                        <h6>Description (any):</h6>
                                        <textArea type="text" className='min-h-[35px] p-2 rounded-md max-w-[95%] mt-2 border-[#636e72]' style={{ border: '1px solid black', minWidth: "100%", borderRadius: "10px" }} onChange={(e) => setSingleRecord({ ...singleRecord, desc: e.target.value })}>
                                            {singleRecord?.desc}
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