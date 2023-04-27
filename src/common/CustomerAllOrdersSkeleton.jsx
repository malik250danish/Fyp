import React from 'react'
import {Table} from "react-bootstrap"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CustomerAllOrdersSkeleton = () => {
    const limit = [1,2,3,4,5,6,7,8,10]
  return (
    <>
        <SkeletonTheme color='#F5F5F5' highlightColor='#ffffff'>            
            <Table responsive variant="dark" style={{padding : "20px", borderRadius : "10px" , maxWidth : "1240px", margin : "auto"}} >
                <thead style={{borderRadius : "10px"}} >
                    <tr>
                        <th>Ref. No.</th>
                        <th>Posted On</th>
                        <th>Delivery Date</th>
                        <th>Restaurant</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>View</th>
                        <th>Complaint</th>
                        <th>Review</th>
                        <th>Cancel</th>
                        {/* <th>Re-Order</th> */}
                        <th>Chat</th>
                        {/* <th>Invoice</th> */}
                    </tr>
                </thead>
                <tbody >
                    {
                        limit?.map((item, index) => (
                            <tr key={index} >
                                <td><Skeleton width={50} height={25}  /></td>
                                <td><Skeleton width={80} height={25}  /></td>
                                <td><Skeleton width={80} height={25}  /></td>
                                <td><Skeleton width={80} height={25}  /></td>
                                <td ><Skeleton width={50} height={25}  /></td>
                                <td>
                                    <Skeleton width={60} height={25}  />
                                </td>
                                <td>
                                    <Skeleton width={50} height={25}  />
                                </td>
                                <td>
                                    <Skeleton width={50} height={25}  />
                                </td>
                                <td>
                                    <Skeleton width={50} height={25}  />
                                </td>
                                <td>
                                    <Skeleton width={50} height={25}  />
                                </td>
                                <td>
                                    <Skeleton width={50} height={25}  />
                                </td>
                            </tr>        
                        ))
                    }
                </tbody>
            </Table>
        </SkeletonTheme>
    </>
  )
}

export default CustomerAllOrdersSkeleton