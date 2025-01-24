import './App.css'
import useScreenSize from "./utils/screenSize"
import DesktopLayout from "./components/DesktopLayout"
import MobileLayout from "./components/MobileLayout"
import { useEffect } from 'react'
import { auth } from './firebase' 
import { Routes, Route } from 'react-router-dom';
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";
import Profile from "./pages/Profile"
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import PostList from './components/PostList'
import Search from "./pages/Search"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, loading] = useAuthState(auth);
  const screenSize = useScreenSize()
  
  useEffect(() => {
    authenticateUser()
  }, [])

  const authenticateUser = () => {
    try {
      if(!loading && (!auth.currentUser || location.pathname != "/signup")) {
        navigate("/login")
      }
    } catch (e) {
        console.error(e);
    }
  }

  

  const Layout = ({ children }) => {
    return screenSize.width < 640 ? (
      <MobileLayout>{children}</MobileLayout>
    ) : (
      <DesktopLayout>{children}</DesktopLayout>
    );
  };

  return (
    <Layout>
      <Routes>
        <Route path="/signup" element={ <Signup />}/>
        <Route path="/login" element={ <Login /> }/>
        <Route path="/profile/:username" element={ <Profile /> } />
        <Route path="/search" element={<Search />}/>
        <Route path="/" element={<PostList />} />
      </Routes>
    </Layout>
  )
}

export default App
