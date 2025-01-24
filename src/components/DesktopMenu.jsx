import { LayoutDashboard, CirclePlus, UserRound, LogOut, Search } from "lucide-react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm"
import { useState } from 'react'

function DesktopLayout() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("profile"))

    const openTimeline = () => {
        navigate("/")
    }

    function openPostForm() {
        setOpen(true)
    }

    function closePostForm() {
        setOpen(false)
    }

    const openProfile = () => {
        console.log("profile");
        
        navigate(`/profile/${currentUser.username}`)
    }

    function logout() {
        signOut(auth).then(() => {
            localStorage.removeItem("profile")
            navigate("/login")
        }).catch((error) => {
            console.log(error)
        });
        
    }

    return (
        <div className="w-1/4 pl-5 pt-5">
            <div className="flex items-center space-x-2 cursor-pointer py-5" onClick={openTimeline}>
                <LayoutDashboard className=""/>
                <span>
                    Home
                </span>
            </div>

            <div className="flex items-center space-x-2 cursor-pointer py-5" onClick={() => window.location.href = "/search"}>
                <Search className=""/>
                <span>
                    Search
                </span>
            </div>

            <div className="flex item-center space-x-2 cursor-pointer py-5" onClick={openPostForm}>
                <CirclePlus/>
                <span>
                    Create
                </span>
            </div>

            <div className="flex items-center space-x-2 cursor-pointer py-5" onClick={openProfile}>
                <UserRound/>
                <span>
                    Profile
                </span>
            </div>
            <div onClick={logout} className="flex items-center space-x-2 cursor-pointer py-5">
                <LogOut />
                <span>
                    Logout
                </span>
            </div>
            <PostForm open={open} handleClose={closePostForm} />
        </div>
    )
}

export default DesktopLayout