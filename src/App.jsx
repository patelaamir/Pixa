import './App.css'
import useScreenSize from "./utils/screenSize"
import DesktopLayout from "./components/DesktopLayout"
import MobileLayout from "./components/MobileLayout"
import { useState, useEffect } from 'react'
import { db } from './firebase' 

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => doc.data()))
    })
  })

  const screenSize = useScreenSize()
  const layout = screenSize.width < 640 ? <MobileLayout posts={posts}/> : <DesktopLayout posts={posts}/>

  return (
    <div>
      {layout}
    </div>
  )
}

export default App
