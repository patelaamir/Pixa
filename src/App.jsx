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
import PostDetail from './pages/PostDetail'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, loading] = useAuthState(auth);
  const screenSize = useScreenSize()

  useEffect(() => {
    authenticateUser()
  }, [loading])

  const authenticateUser = () => {
    try {
      if (!loading && !auth.currentUser && location.pathname != "/signup") {
        navigate("/login")
      }
    } catch (e) {
      console.error(e);
    }
  }



  const Layout = ({ children }) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 mt-80 text-gray-500">
        <img src="/loading.gif" className="size-5"/>
        <span>
        Loading
        </span>
    </div>
      )
    } else if (screenSize.width < 640) {
      return <MobileLayout>{children}</MobileLayout>
    } else {
      return <DesktopLayout>{children}</DesktopLayout>
    }
  };

  return (
    <Layout>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/post/:postID" element={<PostDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<PostList />} />
      </Routes>
    </Layout>
  )
}

export default App
