import { LayoutDashboard, CirclePlus, UserRound, LogOut, Search, Bolt } from "lucide-react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm"
import { useState } from 'react'
import Settings from "./Settings";

function DesktopLayout() {
    const navigate = useNavigate()
    
    const [openProfileForm, toggleProfileForm] = useState(false);
    const [openSettingsModal, toggleSettings] = useState(false)
    const currentUser = JSON.parse(localStorage.getItem("profile"))

    const openTimeline = () => {
        navigate("/")
    }

    function openPostForm() {
        toggleProfileForm(true)
    }

    function closePostForm() {
        toggleProfileForm(false)
    }

    const openProfile = () => {
        navigate(`/profile/${currentUser.username}`)
    }

    function openSettings() {
        toggleSettings(true)
    }

    function closeSettings() {
        toggleSettings(false)
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
        <div className="pl-5 pt-5">
            <div className="flex items-center space-x-2 cursor-pointer pb-5" onClick={openTimeline}>
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
            <div className="flex items-center space-x-2 cursor-pointer py-5" onClick={openSettings}>
                <Bolt/>
                <span>
                    Settings
                </span>
            </div>
            <div onClick={logout} className="flex items-center space-x-2 cursor-pointer py-5">
                <LogOut />
                <span>
                    Logout
                </span>
            </div>
            <PostForm open={openProfileForm} handleClose={closePostForm} />
            <Settings open={openSettingsModal} handleClose={closeSettings} />
        </div>
    )
}

export default DesktopLayout