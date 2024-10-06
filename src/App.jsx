import './App.css'
import useScreenSize from "./utils/screenSize"
import DesktopLayout from "./components/DesktopLayout"
import MobileLayout from "./components/MobileLayout"
import { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore"; 
import { db, auth } from './firebase' 
import { Routes, Route } from 'react-router-dom';
import Signup from "./components/Signup"; 
import Login from "./components/Login";
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);

  

  useEffect(() => {

    (async function() {
      try {
        if(!auth.currentUser) {
          navigate("/login")
        }
        const querySnapShot = await getDocs(collection(db, "posts"))
        console.log(querySnapShot.docs)
        setPosts(querySnapShot.docs.map(doc => doc.data()))
      } catch (e) {
          console.error(e);
      }
    })();
    
  }, [])


  const screenSize = useScreenSize()
  const layout = screenSize.width < 640 ? <MobileLayout posts={posts}/> : <DesktopLayout posts={posts}/>

  return (
    <div>
      <Routes>
        <Route path="/signup" element={ <Signup />}/>
        <Route path="/login" element={ <Login /> }/>
        <Route path="/" element={layout} />
      </Routes>
    </div>
  )
}

export default App
