import { useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import PostList from './PostList'

function MobileLayout(props) {  
      return (
        <div className='px-5'>
          <Header/>
          <PostList posts={props.posts}/>
          <Menu/>
        </div>
      )
}

export default MobileLayout