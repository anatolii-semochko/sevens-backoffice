import React from 'react'
import { useSelector } from 'react-redux'

const SiteLogo = () => {
  const storageImages = useSelector((state) => state.path.storageImages)
  return <>
    <img src={storageImages + 'sevens-logo.svg'} style={{ height: '32px' }} alt="Sevenstime Logo"/>
    <b className="ps-3" style={{fontSize: '20px'}}>SEVENSTIME</b>
  </>
}

export { SiteLogo }
