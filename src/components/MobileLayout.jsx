import { useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import PostList from './PostList'

function MobileLayout() {
    const [posts, setPosts] = useState([
        {
          username: "jannatp",
          image: "https://t3.ftcdn.net/jpg/02/43/25/90/360_F_243259090_crbVsAqKF3PC2jk2eKiUwZHBPH8Q6y9Y.jpg",
          caption: "Its a sunday!"
        },
        {
          username: "aamirp",
          image: "https://t3.ftcdn.net/jpg/02/43/25/90/360_F_243259090_crbVsAqKF3PC2jk2eKiUwZHBPH8Q6y9Y.jpg",
          caption: "Its a Monday!"
        },
        {
          username: "danishp",
          image: "https://t3.ftcdn.net/jpg/02/43/25/90/360_F_243259090_crbVsAqKF3PC2jk2eKiUwZHBPH8Q6y9Y.jpg",
          caption: "Its a Tuesday!"
        },
      ])
    
      return (
        <div className='px-5'>
          <Header/>
          <PostList posts={posts}/>
          <Menu/>
        </div>
      )
}

export default MobileLayout