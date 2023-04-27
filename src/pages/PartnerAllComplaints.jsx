import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllComplaints } from "../api/PartnerApi"
import moment from "moment"
import Cookies from 'universal-cookie';

const PartnerViewAllMenus = ({ socket }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    document.title = `Complaints`

    const handleOpen = () => {
        setActive(!active)
    }

    const [allOrders, setAllOrders] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)

    // getting all related complaints
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                toast.error("Please Sign In to See your Orders")
                navigate("/partner/login")
            } else {
                const { data } = await getAllComplaints();
                if (data?.success === true) {
                    setAllOrders(data?.AllComplaints)
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
            axios.get(`https://fivechefapp.cyclic.app/api/v1/complaints/getAllComplaintsOfAnyOwnerForWeb?skip=${allOrders.length}`)
                .then(function (response) {
                    // handle success
                    console.log("response got", response?.data);
                    if (response?.data?.success === true) {
                        let newArr = allOrders;
                        newArr.push(...response?.data?.AllComplaints)
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

    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />

                    <div className="p-5 partner-route-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }} >
                            <h1 className='partner-heading mb-4'>All Complaints</h1>
                            {/* <Button variant="primary" size="sm" style={{maxHeight : "35px"}} onClick={handleShow} >Add New</Button> */}
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
                                        <p style={{ textAlign: "center", minHeight: "100vh" }}>
                                            <strong>No More Complaints.</strong>
                                        </p>
                                    }
                                >
                                    <Table responsive striped bordered hover style={{ marginTop: "25px" }} >
                                        <thead  >
                                            <tr>
                                                <th>Order Id</th>
                                                <th>Posted On</th>
                                                <th>User</th>
                                                <th>Complaint</th>
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
                                                                    {item?.orderId?.refNo}
                                                                </td>
                                                                <td>{moment(item?.createdAt).format("DD-MM-YY")}</td>
                                                                <td>{item?.userId?.username}</td>
                                                                <td>
                                                                    {item?.desc}
                                                                </td>
                                                                <td>
                                                                    <Button size="sm" variant="primary" onClick={() => navigate(`/vew-single-ticket/${item?.userId?.username}/${item?.orderId?.complaintId}`)} >View</Button>
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
        </>
    )
}

export default PartnerViewAllMenus