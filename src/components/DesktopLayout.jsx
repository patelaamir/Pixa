import Header from "./Header"
import DesktopMenu from "./DesktopMenu"
import { useLocation } from "react-router-dom"

function DesktopLayout({children}) {
  const location = useLocation()

    return (
        <div className='px-5'>
          <Header/>
          <div className={!["/signup", "/login"].includes(location.pathname) ? 'flex' : '' }>
            {
              !["/signup", "/login"].includes(location.pathname) 
              &&
              <DesktopMenu />
            }
            <div className="w-full">
              {children}
            </div>
            <div className="w-1/4"></div>
          </div>
        </div>
      )
}

export default DesktopLayout
