import React , {useState } from 'react'
import FsLightBox from "fslightbox-react";

const MyLightBox = ({toggler, sources}) => {
    console.log("bgImages in inner ====> : ",sources)
  return (
    <>
        <FsLightBox
			toggler={toggler}
			sources={sources}
			type="image"
	        types={[null, null, "video"]}
		/>
    </>
  )
}

export default MyLightBox