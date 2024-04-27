import React from 'react'
import videoBG from '../assets/videoBG.mp4'

export const Home = () => {
  return (
    <div className='main'>
      <video src={videoBG} autoPlay loop muted/>
    </div>

    //<div>Home</div>
  )
}
