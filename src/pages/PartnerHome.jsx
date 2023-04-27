import React, { useState, useEffect } from 'react'
import Notification from '../components/Notification'
import Sidebar from '../components/Sidebar'
import analytics from '../assets/icons/analyticsColors.svg'
import orders from '../assets/icons/ordersColors.svg'
import chat from '../assets/icons/chatColors.svg'
import settings from '../assets/icons/settingsColors.svg'
import list from '../assets/icons/list.svg'
import messages from '../assets/icons/messages.svg'
import article1 from '../assets/img/article1.svg'
import article2 from '../assets/img/article2.svg'
import { Link, useNavigate } from 'react-router-dom'
import { getAllMyArticles, appendMoreArticlesData, emptyArticlesData } from '../redux/actions/ArticlesActions'
import { getDashboardData } from "../api/PartnerApi"
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import axios from "axios"
import { getPartnerGraphData } from "../api/PartnerApi"
import Cookies from 'universal-cookie';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from "faker";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top"
        },
        title: {
            display: true,
            text: "Monthly Sales"
        }
    }
};


const PartnerHome = ({ socket }) => {
    const navigate = useNavigate()
    const [active, setActive] = useState(false)
    const handleOpen = () => {
        setActive(!active)
    }

    // setting graph data
    const [labels, setLables] = useState([])
    const [graphData, setGraphData] = useState([])
    const data = {
        labels,
        datasets: [
            {
                label: "Monthly Sales",
                data: graphData,
                backgroundColor: "rgba(255, 99, 132, 0.5)"
            }
        ]
    };

    const dispatch = useDispatch()
    const { isPartnerSignInSuccess } = useSelector(state => state.partnerReducer)
    const { isAllArticlesFetching, isGetAllArticlesErrorMsg, isShowMoreArticles, allArticles } = useSelector(state => state.articlesReducer)
    const [isShowMore, setIsShowMore] = useState(allArticles?.length > 0 ? true : false)
    const [dashboardData, setDashboardData] = useState({
        pendingOrders: 0,
        allOrders: 0,
        completedOrders: 0,
        allComplaints: 0,
        reviews: 0
    })

    useEffect(() => {
        setIsShowMore(allArticles?.length > 0 ? true : false)
    }, [allArticles])

    const cookies = new Cookies();
    // checking if user is signed in or not
    useEffect(() => {
        const checkUser = () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                navigate('/partner/login')
            } else {
            }
        }
        checkUser()
    }, [navigate, isPartnerSignInSuccess])

    // getting all training articles
    useEffect(() => {
        // getting all training articles
        const getParCategories = async () => {
            if (allArticles?.length < 1) {
                dispatch(getAllMyArticles(dispatch))
            }
        }

        //getting all dashboard record
        const getMyDashboardData = async () => {
            const { data } = await getDashboardData();
            setDashboardData({
                pendingOrders: data?.PendingOrders,
                completedOrders: data?.CompletedOrders,
                allOrders: data?.TotalOrders,
                allComplaints: data?.TotalComplaints,
                reviews: data?.TotalViews
            })
        }

        // getting graph data
        const getGraphData = async () => {
            const { data } = await getPartnerGraphData();
            if (data?.success === true) {
                let newLabeles = [], newData = []
                let myNewArray = data?.MonthlyRecord.reverse();
                for (let i = 0; i !== myNewArray?.length; i++) {
                    newLabeles.push(myNewArray[i]?.date)
                    newData.push(myNewArray[i]?.totalSale)
                }
                setLables(newLabeles)
                setGraphData(newData)
            }
        }

        getParCategories()
        getMyDashboardData()
        getGraphData()
    }, [])

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all training articles on reload
        dispatch(emptyArticlesData(dispatch))
    };

    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);


    // getting more data
    const getMoreArticles = async () => {
        navigate("/partner/articles")
    }

    return (
        <div className='partner-route'>
            {
                isPartnerSignInSuccess === true && (
                    <>
                        <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

                        <div className="partner-content">

                            <Notification click={handleOpen} active={active} socket={socket} />

                            <div className="p-5 partner-route-content">

                                {/* <h1 className='partner-heading mb-4'>Welcome to 5 Chef’s</h1> */}

                                <div className="row">
                                    <div className="col-lg-8">
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "white", padding: '10px', borderRadius: "10px" }} >
                                            <h4 style={{ fontWeight: 600 }} >Your Statistics</h4>
                                            <Bar options={options} data={data} />
                                        </div>
                                        <h1 className='partner-heading mt-4'>Latest Training Articles</h1>
                                        {/* training articles */}
                                        <div className="row">
                                            {
                                                isAllArticlesFetching === true ? (
                                                    <h4>Fetching ...</h4>
                                                ) : (
                                                    isGetAllArticlesErrorMsg !== "" ? (
                                                        <h5>{isGetAllArticlesErrorMsg}</h5>
                                                    ) : (
                                                        allArticles?.length > 0 ? (
                                                            allArticles?.map((item) => (
                                                                <div className="col-lg-6" style={{ cursor: "pointer" }} key={item?._id} onClick={() => navigate(`/article-details/${item?.name}/${item?._id}`)} >
                                                                    <div className="article-card">
                                                                        <div className="article-img-container">
                                                                            <img src={"https://fivechefapp.cyclic.app" + "/blogsImages/" + item?.image} alt="" className='article-img' />
                                                                        </div>
                                                                        <div className="article-desc">
                                                                            <h4>{item?.name?.length > 50 ? item?.name?.substring(0, 50) + "... " : item?.name}</h4>
                                                                            <p>
                                                                                {item?.desc?.length > 120 ? item?.desc?.substring(0, 120) + "... " : item?.desc}
                                                                            </p>
                                                                            <div className="article-details">
                                                                                <span className='text-light p-1 pb-0 bg-color-primary'>5chef</span>
                                                                                {moment(item?.createdAt).startOf('day').fromNow()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <h6>No Training Articles Posted Yet</h6>
                                                        )
                                                    )
                                                )
                                            }
                                        </div>


                                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }} >
                                            {/* {
                                            isShowMoreArticles == true && ( */}
                                            <button style={{ backgroundColor: "#0984e3", color: "white", border: "none", borderRadius: "10px", padding: "5px" }} onClick={getMoreArticles} >show more</button>
                                            {/* )
                                        } */}
                                        </div>

                                    </div>

                                    <div className="col-lg-4 partner-news-container">
                                        <div className="partner-news w-100">
                                            <div className="news-item">
                                                <div className="news-img">
                                                    <img src={list} alt="" />
                                                </div>
                                                <div className="news-text">
                                                    <h4>Total {dashboardData?.allOrders} Received Orders</h4>
                                                    <Link to={'/partner/allOrders'}>View</Link>
                                                </div>
                                            </div>
                                            <div className="news-item">
                                                <div className="news-img">
                                                    <img src={list} alt="" />
                                                </div>
                                                <div className="news-text">
                                                    <h4>{dashboardData?.pendingOrders} Pending Orders</h4>
                                                    <Link to={'/partner/orders'}>View</Link>
                                                </div>
                                            </div>
                                            <div className="news-item">
                                                <div className="news-img">
                                                    <img src={list} alt="" />
                                                </div>
                                                <div className="news-text">
                                                    <h4>{dashboardData?.completedOrders} Completed Orders</h4>
                                                    <Link to={'/partner/allOrders'}>View</Link>
                                                </div>
                                            </div>
                                            <div className="news-item">
                                                <div className="news-img">
                                                    <img src={list} alt="" />
                                                </div>
                                                <div className="news-text">
                                                    <h4>{dashboardData?.allComplaints} Complaints</h4>
                                                    <Link to={'/partner/complaints'}>View</Link>
                                                </div>
                                            </div>
                                            {/* <div className="news-item">
                                            <div className="news-img">
                                                <img src={messages} alt="" />
                                            </div>
                                            <div className="news-text">
                                                <h4>{dashboardData?.reviews} Reviews</h4>
                                                <Link to={'#'}>View</Link>
                                            </div>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </>
                )
            }


        </div>
    )
}

export default PartnerHome