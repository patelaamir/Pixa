import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Menu from './components/Menu'
import Post from './components/Post'
import PostList from './components/PostList'

function App() {

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
    <div className='w-1/2 mx-auto'>
      <Header/>
      <PostList posts={posts}/>
      <Menu/>
    </div>
  )
}

export default App
