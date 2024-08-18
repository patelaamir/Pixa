import { LayoutDashboard } from "lucide-react"
import { CirclePlus } from "lucide-react"
import { UserRound } from "lucide-react"

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
        </div>
    )
}
export default Menu