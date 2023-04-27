import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Row, Col } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge';
import { getSingleProductDetails } from '../api/CommonApi'
import { useParams } from 'react-router-dom'

const MenuDetails = ({ socket }) => {
    document.title = " Product Details"
    const { name, id } = useParams()
    const [productDetails, setProductDetails] = useState(null)
    // getting details
    useEffect(() => {
        // getting menu details
        const getData = async () => {
            const { data } = await getSingleProductDetails(id);
            setProductDetails(data?.Product)
        }

        getData()
    }, [id])
    return (
        <>
            <div className='homepage'>
                <Header socket={socket} />
                <div style={{ display: "flex", flexDirection: "column", maxWidth: "1240px", margin: "auto" }} >
                    <img src={productDetails?.thumbnail ? "https://fivechefapp.cyclic.app" + "/productImages/" + productDetails?.thumbnail : "http://localhost:3000/static/media/menu5.197a4e74d8bc9f89baf1.jpg"} alt="menu logo" style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "10px", objectFit: "cover" }} />
                </div>
                <Row style={{ maxWidth: "1240px", margin: "auto" }} >
                    <Col sm={12} md={6} lg={4} >
                        <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column" }} >
                            <h5 style={{ marginLeft: "15px", marginTop: "15px" }} >{name}</h5>
                        </div>
                    </Col>
                    <Col sm={12} md={6} lg={4} >
                        <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column", alignItems: "center", marginTop: '20px' }} >
                            <h5 style={{ marginLeft: "15px", marginTop: "5px" }} >{productDetails?.menu?.name}</h5>
                        </div>
                    </Col>
                    <Col sm={12} md={6} lg={4} >
                        <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column", alignItems: "center", marginTop: '10px' }} >
                            <h5 style={{ marginLeft: "15px", marginTop: "15px" }} >{productDetails?.restaurant?.name} </h5>
                        </div>
                    </Col>
                </Row>

                <div style={{ maxWidth: "1240px", margin: "auto" }} >
                    <h5 style={{ marginLeft: "15px", marginTop: "15px" }} >Allergens</h5>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }} >
                        {
                            productDetails?.allergens?.map((item) => (
                                <Badge pill bg="dark" style={{ marginTop: "10px", border: "1px solid white", marginLeft: "20px", fontSize: "15px" }} >{item}</Badge>
                            ))
                        }
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default MenuDetails