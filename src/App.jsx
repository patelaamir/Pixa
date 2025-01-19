import './App.css'
import useScreenSize from "./utils/screenSize"
import DesktopLayout from "./components/DesktopLayout"
import MobileLayout from "./components/MobileLayout"
import { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore"; 
import { db, auth } from './firebase' 
import { Routes, Route } from 'react-router-dom';
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";
import Profile from "./pages/Profile"
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);

  

  useEffect(() => {

    (async function() {
      try {
        if(!loading && (!auth.currentUser || location.pathname != "/signup")) {
        	navigate("/login")
        }
        const querySnapShot = await getDocs(collection(db, "posts"))
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
        <Route path="/profile/:username" element={ <Profile /> } />
        <Route path="/" element={layout} />
      </Routes>
    </div>
  )
}

export default App
