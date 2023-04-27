import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CategoriesSkeleton = () => {
  return (
    <>
        <SkeletonTheme color='#F5F5F5' highlightColor='#ffffff'>            
            <div className={`tab`} style={{backgroundColor : "#74b9ff" , color : "white" , display : "flex" , maxWidth : "200px" , marginRight : "10px" , justifyContent : "flex-start" , }} >
                <Skeleton width={35} height={35} style={{ borderRadius : "50%" }}  />
                <Skeleton width={70} height={25} style={{marginLeft : "5px"}} />
            </div>
        </SkeletonTheme>
    </>
  )
}

export default CategoriesSkeleton