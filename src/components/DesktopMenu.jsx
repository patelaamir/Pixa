import { LayoutDashboard, CirclePlus, UserRound, LogOut } from "lucide-react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function DesktopLayout() {
    const navigate = useNavigate()

    function logout (){
        signOut(auth).then(() => {
            navigate("/login")
        }).catch((error) => {
            console.log(error)
        });
        
    }

    return (
        <div className="w-1/4 pl-5 pt-5">
            <div className="flex items-center space-x-2 py-5">
                <LayoutDashboard className=""/>
                <span>
                    Home
                </span>
            </div>

            <div className="flex item-center space-x-2 py-5">
                <CirclePlus/>
                <span>
                    Create
                </span>
            </div>

            <div className="flex items-center space-x-2 py-5">
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
        </div>
    )
}

export default DesktopLayout