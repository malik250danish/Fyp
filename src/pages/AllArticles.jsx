import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import { getAllArticles, getSingleArticleDetails } from "../api/PartnerApi"
import Cookies from 'universal-cookie';
import moment from "moment"

const AllArticles = ({ socket }) => {
    const cookies = new Cookies();
    const [active, setActive] = useState(false)
    const navigate = useNavigate()

    const handleOpen = () => {
        setActive(!active)
    }

    const [allArticles, setAllArticles] = useState([])
    const [isFetching, setIsFetching] = useState(false)


    // getting all articles
    useEffect(() => {
        const getData = async () => {
            let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if (!partnerToken) {
                navigate("/partner/login")
            } else {
                setIsFetching(true)
                const getAllMyArticles = async () => {
                    const { data } = await getAllArticles();
                    if (data?.success === true) {
                        setAllArticles(data?.AllBlogs)
                    } else {
                        toast.error(data?.message)
                    }
                    setIsFetching(false)
                }

                getAllMyArticles()
            }
        }
        getData()
    }, [])

    return (
        <>
            <div className='partner-route'>
                <Sidebar className={active ? 'sidebar active' : 'sidebar'} />
                <div className="partner-content">
                    <Notification click={handleOpen} active={active} socket={socket} />
                    <div className="p-5 partner-route-content">
                        <h1 className='partner-heading mb-4'>All Articles</h1>
                        {
                            isFetching === true ? (
                                <h5>Fetching...</h5>
                            ) : (
                                allArticles?.length > 0 ? (
                                    <>
                                        <Row>
                                            {
                                                allArticles?.map((item) => (
                                                    <Col lg={4} md={6} xs={12} key={item?._id} >
                                                        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/article-details/${item?.name}/${item?._id}`)} >
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
                                                    </Col>
                                                ))
                                            }
                                        </Row>

                                    </>
                                ) : (
                                    <h6>No Training Articles Posted Yet</h6>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllArticles