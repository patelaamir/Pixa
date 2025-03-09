import { useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import { useLocation } from "react-router-dom"
import PostList from './PostList'

function MobileLayout({ children }) {  
  const location = useLocation()

    return (
      <div className='mb-20'>
        <Header/>
        <div className='px-5'>
          
          <div className="">
            {children}
          </div>
        {
          !["/signup", "/login"].includes(location.pathname) 
          &&
          <Menu />
        }
      </div>
    </div>
    )
}

export default MobileLayout