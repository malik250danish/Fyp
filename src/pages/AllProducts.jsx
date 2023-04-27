import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { getAllProductsRelatedToAnyCategory } from '../api/CommonApi'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import { addCustomMenuToCart, removeCustomMenuFromCart } from "../redux/actions/UserActions"
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';

const AllUbCategories = ({ socket }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { category, subCategory, categoryId, subCategoryId } = useParams()
    document.title = `Products Related to ${category} & ${subCategory}`

    const [allRestaurants, setRestaurants] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    // getting all related products
    useEffect(() => {
        const getData = async () => {
            setIsFetching(true)
            const { data } = await getAllProductsRelatedToAnyCategory(categoryId, subCategoryId)
            console.log("response : ", data)
            setRestaurants(data?.AllProducts)
            setIsFetching(false)
        }

        getData()
    }, [location])

    // getting top menus on scroll
    const getTopMyRestaurants = async () => {
        setIsFetching(true)
        axios.get(`https://fivechefapp.cyclic.app/api/v1/products/getProductsRelatedToCategoryAndSubCategory/${categoryId}/${subCategoryId}?skip=${allRestaurants.length}`)
            .then(function (response) {
                // handle success
                console.log("response got", response?.data?.success);
                if (response?.data?.success === true) {
                    let newArr = allRestaurants;
                    newArr.push(...response?.data?.AllProducts)
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
    const dispatch = useDispatch()
    const { userSignInSuccess, customMenu, isCustomMenuFetching, isCustomMenuErrorMsg, isCustomMenuAddingSuccess } = useSelector(state => state.usersReducer)

    // adding menu to cart
    const addMyItemToCart = (data) => {
        dispatch(addCustomMenuToCart(data, dispatch))
    }

    // removing menu from cart
    const removeMyItemFromCart = (id) => {
        dispatch(removeCustomMenuFromCart(id, dispatch))
    }

    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div className="flex justify-center" style={{ maxWidth: "1240px", margin: "auto" }} >
                    <h4 style={{ marginLeft: "15px", marginTop: "15px" }} >All Products related to "{category}" and "{subCategory}" </h4>
                </div>
                <InfiniteScroll
                    dataLength={allRestaurants?.length}
                    next={getTopMyRestaurants}
                    hasMore={true}
                    loader={isFetching === true && <h4>Loading...</h4>}
                    style={{ overflowX: "hidden", maxWidth: "1240px", margin: "auto", minHeight: "100vh" }}
                >
                    <Row style={{ padding: "15px" }} >
                        {
                            allRestaurants?.length > 0 ? (
                                allRestaurants?.map((item) => (
                                    <Col sm={12} md={6} lg={4} xl={3} style={{ marginBottom: "20px" }}  >
                                        <div className="restaurants-slide">
                                            <div className="restaurants-img" style={{ margin: '5px' }} onClick={() => navigate(`/product-details/${item?.name}/${item?._id}`)} >
                                                <Link to={``}>
                                                    <img src={"https://fivechefapp.cyclic.app" + "/productImages/" + item?.thumbnail} alt="" />
                                                </Link>
                                            </div>
                                            <div className="restaurants-desc" style={{ margin: '5px' }}>
                                                <h6>{item?.name}</h6>
                                                <div className="restaurants-features"  >
                                                    <h6 style={{ marginTop: "8px" }} >Restaurant:</h6>
                                                    <div className="restaurants-feat" style={{ marginLeft: "15px", marginTop: "5px", marginRight: "0" }} >
                                                        <h6>{item?.restaurant?.name}</h6>
                                                        <img alt="restaurant logo" style={{ minWidth: "30px", marginBottom: "5px", minHeight: "30px", borderRadius: "50%", marginLeft: "10px" }} src={"https://fivechefapp.cyclic.app" + "/restaurantsImages/" + item?.restaurant?.logo} />
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "flex-start", minWidth: "100%" }} >
                                                        <div style={{ display: "flex", minWidth: "50%" }} >
                                                            <h6  >Rating:</h6>
                                                            <div className="restaurants-feat" style={{ marginLeft: "15px", marginRight: "0" }} >
                                                                <h6>({item?.rating})</h6>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "flex-end" }} >
                                                            <h6  >Price:</h6>
                                                            <div className="restaurants-feat" style={{ marginLeft: "15px", marginRight: "0" }} >
                                                                <h6>${item?.price}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", margin: "auto", minWidth: "100%" }}>
                                                {
                                                    isCustomMenuFetching === true ? (
                                                        <p>please wait...</p>
                                                    ) : (
                                                        customMenu?.length < 1 ? (
                                                            <button className='deals-atc' onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                        ) : (
                                                            customMenu?.products?.find(itemOne => itemOne?._id == item?._id) ?
                                                                (
                                                                    <button className='deals-atc' onClick={() => removeMyItemFromCart(item)} >- Remove</button>
                                                                ) : (
                                                                    <>
                                                                        <button className='deals-atc' onClick={() => addMyItemToCart(item)}>+ Add to cart</button>
                                                                    </>
                                                                )
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <h5>No Products Found</h5>
                            )
                        }
                    </Row>
                </InfiniteScroll>

                <Footer />
            </div>
        </>
    )
}

export default AllUbCategories