import { LayoutDashboard, CirclePlus, UserRound, LogOut, Search, Bolt } from "lucide-react"
import PostForm from "./PostForm"
import Settings from "./Settings"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Menu =  () => {
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
        <div className="fixed bottom-0 z-10 flex justify-around bg-white w-full">
            <div className="py-3" onClick={openTimeline}>
                <LayoutDashboard/>
            </div>
            <div className="py-3" onClick={() => window.location.href = "/search"}>
                <Search/>
            </div>
            <div className="py-3" onClick={openPostForm}>
                <CirclePlus/>
            </div>
            <div className="py-3" onClick={openProfile}>
                <UserRound/>
            </div>
            <div className="py-3" onClick={openSettings}>
                <Bolt/>
            </div>
            <div className="cursor-pointer py-3" onClick={logout}>
                <LogOut/>
            </div>
            <PostForm open={openProfileForm} handleClose={closePostForm} />
            <Settings open={openSettingsModal} handleClose={closeSettings} />
        </div>
    )
}
export default Menu