import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Accordion from 'react-bootstrap/Accordion';
import {Row , Col } from 'react-bootstrap'
import {GrFormAdd}  from 'react-icons/gr'
import {getAllFAqs} from '../api/CommonApi'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const FaqPage = ({socket}) => {
    document.title = ' FAQ'

    const [ faqs , setFaqs ] = useState([]);
    const [ isFetching , setIsFetching ] = useState(false)

    // getting data
    useEffect(() => {
        const getAllMyFaqs = async () => {
            setIsFetching(true)
            const {data} = await getAllFAqs();
            if(data?.success === true){
                setFaqs(data?.AllFaqs)
            }else{
                toast.error(data?.message)
            }
            setIsFetching(false)
        }
        getAllMyFaqs()
    },[])


  return (
    <>
        <div className='homepage'>
            <Header socket={socket} />
                <div style={{ maxWidth : "1240px" , margin : "auto", marginTop : "25px"}} >
                <div className="container" style={{marginTop : '25px', marginBottom : '15px'}} >
                <h3>Frequently Asked Questions</h3> 
            </div>
                <Row className="container mx-auto" style={{ marginTop : '35px', marginBottom : "55px" , maxWidth : "1000px" , margin : "auto"}} >
                    <Col md={12} lg={12} style={{marginBottom : "10px"}} >
                        {
                            isFetching === true ? (
                                <h4>Fetching Latest FAQs...</h4>
                            ) : (
                                faqs?.length > 0 ? (
                                    <Accordion>
                                        {
                                            faqs?.map((item, index) => (
                                                <Accordion.Item eventKey={index} key={index} >
                                                    <Accordion.Header style={{marginBottom : "12px", borderRight : "1px solid white" ,color : "black"}} >
                                                        <div style={{display : "flex", justifyContent: "space-between"  ,  color : "black"}} >
                                                            <h6 style={{color : "black"}}>
                                                                {item?.heading}
                                                            </h6>
                                                        </div>
                                                    </Accordion.Header>
                                                    <Accordion.Body style={{color : "black"}}>
                                                        {item?.desc}
                                                    </Accordion.Body>
                                                </Accordion.Item>  
                                            ))
                                        }
                                    </Accordion>
                                ) : (
                                    <p>No FAQS have been added Yet</p>
                                )
                            )
                        }
                    </Col>
                </Row>
                </div>
            <Footer/>
        </div>
    </>
  )
}

export default FaqPage