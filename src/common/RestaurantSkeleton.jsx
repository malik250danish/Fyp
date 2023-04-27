import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const RestaurantSkeleton = () => {
  return (
    <>
        <SkeletonTheme color='#F5F5F5' highlightColor='#ffffff'>
          <div className="restaurants-slide" >
              <div className="restaurants-img" >
                  <Skeleton width={"100%"} height={180} style={{backgroundColor : "#dfe6e9"}} />
              </div>
              <div className="restaurants-desc" style={{marginTop : '-20px' , marginBottom : "20px"}}>
                  <Skeleton width={"100%"} height={20} />
                  <Skeleton width={"65%"} height={20} />
              </div>
          </div>
        </SkeletonTheme>
    </>
  )
}

export default RestaurantSkeleton