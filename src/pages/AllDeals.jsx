import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation, Link } from 'react-router-dom'
import heart from '../assets/icons/heart.svg'
import stopwatch from '../assets/icons/stopwatch.svg'
import { Row, Col } from 'react-bootstrap'
import star from '../assets/icons/star.svg'
import discount from '../assets/icons/discount.svg'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { getMyAllTopMenusMain, getMyAllTopMenusEmpty } from '../redux/actions/HomePageActions'
import { addAppMenuToCart, removeAppMenuFromCart, deleteAppMenuFromCart } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'
import MenuSkeleton from "../common/MenuSkeleton"


const AllUbCategories = ({ socket }) => {
    const location = useLocation()
    document.title = "Top Deals"
    const dispatch = useDispatch()
    const { isAllTopMenusFetching, isAllTopMenusError, allAllTopMenus } = useSelector(state => state.homePageReducer)
    const { userSignInSuccess, appMenus, isAppMenusFetching, isAppMenusErrorMsg, isAppAddingMenusSuccess, isAppMenusRemovingSuccess } = useSelector(state => state.usersReducer)


    const [allMenus, setMenus] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    // getting top menus on first reload of page
    useEffect(() => {
        // getting top menus
        const getTopMenus = async () => {
            if (allAllTopMenus?.length < 1) {
                dispatch(getMyAllTopMenusMain(dispatch))
            }
        }

        getTopMenus()
    }, [])

    // getting top menus on scroll
    const getTopMyMyMenus = async () => {
        setIsFetching(true)
        axios.get(`https://fivechefapp.cyclic.app/api/v1/menus/getAllMenusForCommonForMainPage?skip=${allMenus.length}`)
            .then(function (response) {
                // handle success
                console.log("response got", response?.data?.success);
                if (response?.data?.success === true) {
                    let newArr = allMenus;
                    newArr.push(...response?.data?.AllMenus)
                    setMenus(newArr)
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

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all top deals
        dispatch(getMyAllTopMenusEmpty(dispatch))
    };

    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    // adding custom menu to cart
    const addMyItemToCart = (data) => {
        dispatch(addAppMenuToCart(data, dispatch))
    }

    // removing custom menu from cart
    const removeMyItemFromCart = (id) => {
        //dispatch(removeAppMenuFromCart(id,dispatch))
        dispatch(deleteAppMenuFromCart(id, dispatch))

    }

    // limit for skeleton
    const limit = [1, 2, 3]

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div className="flex justify-center" >
                    <h4 style={{ marginLeft: "15px", marginTop: "15px", maxWidth: "1240px", margin: "auto" }} >All Top Deals</h4>
                </div>
                {
                    isAllTopMenusFetching === true ? (
                        <Row style={{ overflowX: "hidden", marginTop: "20px", maxWidth: "1240px", margin: "auto", }} >
                            {
                                limit?.map((item) => (
                                    <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px" }} key={item}  >
                                        <MenuSkeleton />
                                    </Col>
                                ))
                            }
                        </Row>
                    ) : (
                        isAllTopMenusError === true ? (
                            <h4>Could not get all Top Menus {isAllTopMenusError}</h4>
                        ) : (
                            // getting recent menus on scroll
                            <InfiniteScroll
                                dataLength={allMenus.length}
                                next={getTopMyMyMenus}
                                hasMore={true}
                                loader={isFetching === true && <h4>Loading...</h4>}
                                style={{ overflowX: "hidden", maxWidth: "1240px", margin: "auto", minHeight: "100vh" }}
                            >
                                <Row style={{ padding: "15px" }} >
                                    {

                                        allAllTopMenus?.length > 0 ? (
                                            allAllTopMenus?.map((item) => (
                                                <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px" }} key={item?.Menu?._id} >
                                                    <div className="deals-slide" style={{ marginRight: '25px' }} >
                                                        <Link to={`/menu-details/${item?.Menu?.name}/${item?.Menu?._id}`} >
                                                            <div className="deals-img" style={{ padding: '5px' }}>
                                                                <img src={"https://fivechefapp.cyclic.app" + "/menuImages/" + item?.Menu?.image} alt="" style={{ borderRadius: "15px", objectFit: "cover" }} />
                                                                <div className="deals-price">
                                                                    <span className='text-color-primary'>$</span>
                                                                    {item?.total}
                                                                </div>
                                                                <div >
                                                                    {/* <img src={heart} alt="" /> */}
                                                                </div>
                                                            </div>

                                                        </Link>
                                                        <div className="deals-desc" style={{ minHeight: '150px', padding: '5px' }} >
                                                            {/* <div className="deals-rating">
                                                            {item?.Menu?.rating}
                                                            <img src={star} alt="" style={{maxWidth : "20px", maxHeight : "20px"}} />
                                                            <span>(0)</span>
                                                        </div> */}
                                                            <div className="deals-name" style={{ marginTop: "35px", maxHeight: "100px" }} >
                                                                <h3>
                                                                    {item?.Menu?.name?.length > 40 ? item?.Menu?.name.substring(0, 40) + '....' : item?.Menu?.name}
                                                                    <span>{item?.Menu?.restaurant?.name}</span>
                                                                </h3>
                                                                {/* {
                                                                item?.Menu?.isOffer === true && (
                                                                    <img src={discount} alt="" />
                                                                )
                                                            } */}
                                                            </div>
                                                        </div>
                                                        {
                                                            isAppMenusFetching === true ? (
                                                                <p>please wait...</p>
                                                            ) : (
                                                                appMenus?.length < 1 ? (
                                                                    <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                ) : (
                                                                    Object.values(appMenus).find(itemOne => itemOne.Menu == item?.Menu?._id) ?
                                                                        (
                                                                            <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => removeMyItemFromCart(item?.Menu?._id)} >- Remove</button>
                                                                        ) : (
                                                                            <>
                                                                                <button className='deals-atc' style={{ marginTop: "-50px" }} onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                            </>
                                                                        )
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </Col>
                                            ))
                                        ) : (
                                            <h5>Could Not Get Top Menus </h5>
                                        )
                                    }
                                </Row>
                            </InfiniteScroll>
                        )
                    )
                }

                <Footer />
            </div>
        </>
    )
}

export default AllUbCategories