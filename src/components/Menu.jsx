import { LayoutDashboard, CirclePlus, UserRound, LogOut } from "lucide-react"

const Menu =  () => {
    return (
        <div className="fixed bottom-0 z-10 flex justify-around bg-white w-full">
            <div className="py-3">
                <LayoutDashboard/>
            </div>
            <div className="py-3">
                <CirclePlus/>
            </div>
            <div className="py-3">
                <UserRound/>
            </div>
            <div className="cursor-pointer py-3">
                <LogOut/>
            </div>
        </div>
    )
}
export default Menu