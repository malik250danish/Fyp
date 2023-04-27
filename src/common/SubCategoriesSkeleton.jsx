import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SubCategoriesSkeleton = () => {
  return (
    <>
        <SkeletonTheme color='#F5F5F5' highlightColor='#ffffff'>            
            <div className="menu-slide" style={{paddingRight: "5px" , cursor : "pointer" , maxHeight : "200px"}}  >
                <Skeleton width={"200px"} height={"200px"} style={{ borderRadius : "10%" }}  />
                <div className='menu-slide-text'>
                    <Skeleton width={130} height={25} style={{marginLeft : "5px"}} />
                </div>
            </div>
        </SkeletonTheme>
    </>
  )
}

export default SubCategoriesSkeleton