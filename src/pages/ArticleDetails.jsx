import React, { useState, useEffect } from 'react'
import Notification from '../components/Notification'
import Sidebar from '../components/Sidebar'
import avatar1 from '../assets/img/avatar1.svg'
import avatar2 from '../assets/img/avatar2.svg'
import { Link, useParams } from 'react-router-dom'
import { getSingleArticleDetails } from "../api/PartnerApi"

const PartnerOrders = () => {

    const [active, setActive] = useState(false)

    const handleOpen = () => {
        setActive(!active)
    }

    const { name, id } = useParams()

    document.title = `Article Details | ${name}`

    const [blogData, setBlogData] = useState(null)

    useEffect(() => {
        const getData = async () => {
            const { data } = await getSingleArticleDetails(id)
            console.log("data : ", data)
            if (data?.success === true) {
                setBlogData(data?.Blog)
            } else {

            }
        }
        getData()
    }, [id])

    return (
        <div className='partner-route'>

            <Sidebar className={active ? 'sidebar active' : 'sidebar'} />

            <div className="partner-content">

                <Notification click={handleOpen} active={active} />

                <div className="p-5 partner-route-content">

                    <h1 className='partner-heading mb-4'>Article Details</h1>

                    <div style={{ maxWidth: "1240px", margin: "auto", display: "flex", flexDirection: "column" }}>
                        <img alt="article image" style={{ maxWidth: "100%", borderRadius: "10px", maxHeight: "300px", objectFit: "cover" }} src={"https://fivechefapp.cyclic.app" + "/blogsImages/" + blogData?.image} />
                        <div style={{ display: "flex", marginTop: "30px", justifyContent: "center" }} >
                            <h5 style={{ color: "#0984e3", marginRight: "10px" }} >Category: </h5>
                            <h5>{blogData?.category}</h5>
                        </div>
                        <h2 style={{ marginTop: "20px", marginBottom: "15px" }} >Details:</h2>
                        <p>
                            {blogData?.desc}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default PartnerOrders