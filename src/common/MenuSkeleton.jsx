import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const MenuSkeleton = () => {
  return (
    <>
        <SkeletonTheme color='#F5F5F5' highlightColor='#ffffff'>
        <div className="deals-slide" style={{margin : 'auto', cursor : "pointer" , maxHeight : "300px"}} >
            <div className="deals-img" style={{padding : '5px'}} >
                <Skeleton width={"100%"} height={180} style={{backgroundColor : "#dfe6e9"}} />
            </div>
            <div className="deals-desc" style={{minHeight : '150px' , padding : '5px'}}>
                <Skeleton width={"100%"} height={20} />
                <Skeleton width={"65%"} height={20} />
                <Skeleton width={100} height={25} style={{marginTop : "15px" , borderRadius : "10px"}}  />
            </div>
        </div>
        </SkeletonTheme>
    </>
  )
}

export default MenuSkeleton