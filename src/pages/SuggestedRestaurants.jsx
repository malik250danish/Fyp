import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation, Link } from 'react-router-dom'
import heart from '../assets/icons/heart.svg'
import stopwatch from '../assets/icons/stopwatch.svg'
import check from '../assets/icons/check.svg'
import motorcycle from '../assets/icons/motorcycle.svg'
import { Row, Col } from 'react-bootstrap'
import { getAllSuggestedRestaurantsMainPage } from '../api/CommonApi'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { FcClearFilters } from 'react-icons/fc'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactStars from "react-rating-stars-component";
import { BsFilterSquare } from "react-icons/bs"
import RestaurantSkeleton from "../common/RestaurantSkeleton"
import Form from 'react-bootstrap/Form';


const AllUbCategories = ({ socket }) => {
    const location = useLocation()
    document.title = " Suggested Restaurants"

    const [allRestaurants, setRestaurants] = useState([])
    const [isFilterApplied, setIsFilterApplied] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    // getting suggested Restaurants on first reload of page
    useEffect(() => {
        // getting suggested Restaurants
        const getTopMenus = async () => {
            const { data } = await getAllSuggestedRestaurantsMainPage();
            setRestaurants(data?.AllRestaurants)
        }

        getTopMenus()
    }, [location])

    // getting top menus on scroll
    const getTopMyRestaurants = async () => {
        setIsFetching(true)
        axios.get(`https://fivechefapp.cyclic.app/api/v1/restaurants/getAllSuggestedRestaurantsForCommonMainPage?skip=${allRestaurants.length}`)
            .then(function (response) {
                // handle success
                console.log("response got", response?.data?.success);
                if (response?.data?.success === true) {
                    let newArr = allRestaurants;
                    newArr.push(...response?.data?.AllRestaurants)
                    setRestaurants(newArr)
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

    // filtration modal
    const [filterData, setFilterData] = useState({
        rating: "",
        isDelivery: false,
        isPickUp: false,
        tags: []
    })
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    // for getting rating
    const ratingChanged = (newRating) => {
        setFilterData({ ...filterData, rating: newRating })
    };

    // applying filters
    const applyMyFilters = async () => {
        axios.get(`https://fivechefapp.cyclic.app/api/v1/restaurants/getFilteredRestaurantsForWeb?tags=${filterData.tags}&rating=${filterData.rating}&isDelivery=${filterData.isDelivery}&isPickUp=${filterData.isPickUp}`)
            .then(function (response) {
                // handle success
                console.log("response ===========> : ", response)
                if (response?.data?.success === true) {
                    setRestaurants(response?.data?.AllMatchedRestaurants)
                } else {
                    setRestaurants([])
                }
                setIsFilterApplied(true)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
                handleClose()
                setIsFetching(false)

            });
    }

    // remove filters
    const removeFilters = async () => {
        setIsFilterApplied(false)
        setFilterData({ rating: "", isPickUp: false, isDelivery: false, tags: [] })
        const { data } = await getAllSuggestedRestaurantsMainPage();
        setRestaurants(data?.AllRestaurants)
    }

    // limit for skeleton
    const limit = [1, 2, 3]

    // tags
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
        let newArr = filterData;
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
        setFilterData(newArr)
    }

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ display: "flex", marginTop: "20px", justifyContent: "space-between", maxWidth: "1240px", margin: "auto" }} >
                    <h4 style={{ marginLeft: "15px", marginTop: "15px" }} >All Suggested Restaurants</h4>
                    <div style={{ display: "flex", flexDirection: "column", }} >
                        <BsFilterSquare style={{ fontSize: "25px", cursor: "pointer" }} onClick={handleShow} />
                        {
                            isFilterApplied === true && (
                                <FcClearFilters style={{ fontSize: "25px", cursor: "pointer", marginTop: "10px" }} onClick={removeFilters} />
                            )
                        }
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={allRestaurants.length}
                    next={getTopMyRestaurants}
                    hasMore={true}
                    loader={isFetching === true && <h4>Loading...</h4>}
                    style={{ overflowX: "hidden", maxWidth: "1240px", margin: "auto", minHeight: "100vh" }}
                >
                    <Row style={{ padding: "15px" }} >
                        {
                            isFetching === true ? (
                                limit?.map((item) => (
                                    <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px" }} key={item}  >
                                        <RestaurantSkeleton />
                                    </Col>
                                ))
                            ) : (
                                allRestaurants?.length > 0 ? (
                                    allRestaurants?.map((item) => (
                                        <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px" }} >
                                            <div className="restaurants-slide">
                                                <div className="restaurants-img">
                                                    <Link to={`/restaurant/${item?._id}`}>
                                                        <img src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.image} alt="" />
                                                    </Link>
                                                    {/* <div className="deals-price">
                                                <span className='text-color-primary'>$</span>
                                                5.90
                                            </div> */}
                                                    <div className="restaurants-heart">
                                                        <img src={heart} alt="" />
                                                    </div>
                                                </div>
                                                <div className="restaurants-desc" style={{ margin: '5px' }}>
                                                    <h3 className='restaurants-name'>
                                                        <Link to={``} className='text-light'>{item?.name}</Link>
                                                        {
                                                            item?.isVerified === true && (<img src={check} alt="" />)
                                                        }
                                                    </h3>
                                                    <div className="restaurants-features"  >
                                                        {/* {
                                                    item?.isFreeDelivery === true && (
                                                        <div className="restaurants-feat">
                                                            <img src={motorcycle} alt="" /> Free Delivery
                                                        </div>
                                                    )
                                                } */}
                                                        <div className="restaurants-feat">
                                                            <img src={stopwatch} alt="" />
                                                            {item?.deliveryTime}
                                                        </div>
                                                    </div>
                                                    <div className="restaurants-tags" style={{ minHeight: '50px' }}>
                                                        {
                                                            item?.tags?.map((tag) => (
                                                                <div className="restaurants-tag">{tag}</div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <h5>No Suggested Restaurants Found</h5>
                                )
                            )
                        }
                    </Row>
                </InfiniteScroll>

                <Footer />

                {/* filtration modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Choose Filter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: "flex", flexDirection: "column", padding: "20px" }} >
                            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", marginBottom: "15px" }} >
                                <h6>Choose Rating : </h6>
                                <ReactStars
                                    count={5}
                                    onChange={ratingChanged}
                                    size={70}
                                    isHalf={true}
                                    emptyIcon={<i className="far fa-star"></i>}
                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                    fullIcon={<i className="fa fa-star"></i>}
                                    activeColor="#ffd700"
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", marginBottom: "15px" }} >
                                <h6 style={{ marginBottom: "15px" }} >Choose Delivery Type : </h6>
                                <Form style={{ display: "flex", justifyContent: "space-between" }} >
                                    <Form.Check
                                        type="switch"
                                        checked={filterData?.isDelivery}
                                        onChange={(e) => setFilterData({ ...filterData, isDelivery: !filterData?.isDelivery })}
                                        id="custom-switch"
                                        label="Delivery Service"
                                    />
                                    <Form.Check
                                        type="switch"
                                        checked={filterData?.isPickUp}
                                        onChange={(e) => setFilterData({ ...filterData, isPickUp: !filterData?.isPickUp })}
                                        label="Pick Up Service"
                                        id="custom-switch"
                                    />
                                </Form>
                            </div>
                            {/* <div style={{display : "flex" , justifyContent: "center" ,  flexDirection : "column", marginBottom : "15px"}} >
                        <h6>Choose any Tag : </h6>
                        <select class="form-select" multiple aria-label="Default select example" onChange={(e) => setFilterData({...filterData , tags : e.target.value})} >
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
                    </div> */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={applyMyFilters}>
                            Apply Filters
                        </Button>
                    </Modal.Footer>
                </Modal>


            </div>
        </>
    )
}

export default AllUbCategories