import React from 'react'
import assets from '../assets/assets';

const NotFound404 = ({ value, margin }) => {
  return (
    <h2 className={`col-span-full text-center h-full flex flex-col justify-center items-center gap-4 ${margin} `}>
      <img src={assets.not_found} alt="Not Found" className='w-20' />
      <h2>
        {value}
      </h2>
    </h2>
  )
}

export default NotFound404;
