import React, { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Row, Col, Dropdown, DropdownButton, ButtonGroup, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { getAllForumsForCommon, appendMoreForumsData, emptyForumsData, getAllForumsWithFilters, getAllUnFilteredForums } from '../redux/actions/ForumsActions'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import moment from "moment"
import {
    getAllForums,
} from '../api/CommonApi'
import { toast } from 'react-toastify';


const ForumsListing = ({ socket }) => {
    const navigate = useNavigate()
    document.title = " All Forums"

    const dispatch = useDispatch()
    const { isAllForumsFetching, isGetAllForumsErrorMsg, isGetAllForumsSuccess, allForums } = useSelector(state => state.forumsReducer)
    const { userSignInSuccess } = useSelector(state => state.usersReducer)
    const [allMyForums, setAllMyForums] = useState([])

    // getting all tickets
    useEffect(() => {
        const getAllData = async () => {
            const { data } = await getAllForums();
            if (data?.success === true) {
                setAllMyForums(data?.AllForums)
            } else {
                toast.error(data?.message)
            }
        }

        getAllData()
    }, [])

    // getting top forums on scroll
    const getTopMyAllForumsMore = async () => {
        // axios.get(`https://fivechefapp.cyclic.app/api/v1/forums/getAllForums?skip=${allForums.length}&category=${category}` , {withCredentials: true,})
        // .then(function (response) {
        //     // handle success
        //     console.log("response got", response?.data?.success);
        //     if(response?.data?.success === true){
        //         // appending new data
        //         dispatch(appendMoreForumsData(response?.data?.AllForums , dispatch))
        //     }
        // })
        // .catch(function (error) {
        //     // handle error
        //     console.log(error);
        // })
        // .finally(function () {
        //     // always executed
        // });
    }

    // emptying all arrays fetched on reload.
    const emptyAllData = (e) => {
        // emptying all tickets data
        dispatch(emptyForumsData(dispatch))
    };
    // removing all data on reload
    useEffect(() => {
        window.addEventListener("beforeunload", emptyAllData);
        return () => {
            window.removeEventListener("beforeunload", emptyAllData);
        };
    }, []);

    const [category, setCategory] = useState("");

    // getting data on changing category
    useMemo(async () => {
        if (category?.length < 1) {
            dispatch(getAllUnFilteredForums(dispatch))
        } else {
            axios.get(`https://fivechefapp.cyclic.app/api/v1/forums/getAllForums?skip=${0}&category=${category}`, { withCredentials: true, })
                .then(function (response) {
                    // handle success
                    console.log("response : ", response?.data)
                    if (response?.data?.success === true) {
                        // getting new data
                        dispatch(getAllForumsWithFilters(response?.data?.AllForums, dispatch))
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }
    }, [category])


    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ maxWidth: "1240px", marginTop: "35px", margin: "auto" }} >

                    {/* Tickets Main Heading */}
                    <Row style={{ display: "flex", marginTop: "35px", padding: "10px" }} >
                        <Col xs={12} sm={12} md={10} lg={10}>
                            <h2 style={{ display: "flex" }} >All Forums</h2>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <DropdownButton
                                    as={ButtonGroup}
                                    variant="info"
                                    title="Select Category"
                                    style={{ color: "white", backgroundColor: "black" }}
                                >
                                    <Dropdown.Item eventKey="1" style={{ color: "white", backgroundColor: "black" }} active onClick={() => setCategory("Restaurants")} >Restaurants</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" style={{ color: "white", backgroundColor: "black" }} onClick={() => setCategory("Orders")} >Orders</Dropdown.Item>
                                    <Dropdown.Item eventKey="3" style={{ color: "white", backgroundColor: "black" }} onClick={() => setCategory("Customers")} >Customers</Dropdown.Item>
                                    <Dropdown.Item eventKey="4" style={{ color: "white", backgroundColor: "black" }} onClick={() => setCategory("Partners")} >Partners</Dropdown.Item>
                                </DropdownButton>
                                {
                                    category !== "" && (
                                        <Button variant="danger" style={{ marginTop: "8px" }} onClick={() => setCategory("")} >Clear Filters</Button>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>

                    {/* Forums Heading */}
                    <Row style={{ marginTop: "30px" }} >
                        <Col xs={8} sm={8} md={8} lg={8} >
                            <p style={{ paddingLeft: "15px", color: "#0984e3" }}>Topic</p>
                        </Col>
                        <Col xs={4} sm={6} md={4} lg={4} >
                            <Row>
                                <Col xs={4} sm={4} >
                                    <p style={{ textOverflow: "ellipsis", overflow: "hidden", color: "#0984e3" }}>Category</p>
                                </Col>
                                <Col xs={4} sm={4} >
                                    <p style={{ textOverflow: "ellipsis", overflow: "hidden", color: "#0984e3" }} >Replies</p>
                                </Col>
                                <Col xs={4} sm={4} >
                                    <p style={{ textOverflow: "ellipsis", overflow: "hidden", color: "#0984e3" }}>Activity</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* All Tickets */}
                    <InfiniteScroll
                        dataLength={allForums.length}
                        next={getTopMyAllForumsMore}
                        hasMore={true}
                        loader={isAllForumsFetching === true && <h4>Loading...</h4>}
                        style={{ overflowX: "hidden", minHeight: "100vh" }}
                    >
                        {
                            isAllForumsFetching === true ? (
                                <h4>Fetching ...</h4>
                            ) : (
                                isGetAllForumsSuccess === false ? (
                                    <h4>
                                        {
                                            isGetAllForumsErrorMsg?.length > 0 ? isGetAllForumsErrorMsg : "Could not get Data, please reload to try again"
                                        }
                                    </h4>
                                ) : (
                                    allMyForums?.length > 0 ? (
                                        allMyForums?.map((item, index) => (
                                            <Row style={{ marginTop: "30px" }} key={item?._id} >
                                                <Col xs={8} >
                                                    <p style={{ textOverflow: "ellipsis", overflow: "hidden", cursor: "pointer", paddingLeft: "5px" }} onClick={() => navigate(`/view-single-forum/${item?.title}/${item?._id}`)} >{item?.title}</p>
                                                </Col>
                                                <Col xs={4} >
                                                    <Row>
                                                        <Col xs={3} sm={4} >
                                                            <h6>{item?.category?.name}</h6>
                                                        </Col>
                                                        <Col xs={3} sm={4} >
                                                            <h6>{item?.replies}</h6>
                                                        </Col>
                                                        <Col xs={6} sm={4} >
                                                            <h6 >{moment(item?.updatedAt).format("DD-MMM-YY")}</h6>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ))
                                    ) : (
                                        <h4>No Forums Found</h4>
                                    )
                                )
                            )
                        }
                    </InfiniteScroll>
                </div>
                <Footer />


            </div>
        </>
    )
}

export default ForumsListing