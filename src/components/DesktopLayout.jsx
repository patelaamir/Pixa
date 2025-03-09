import Header from "./Header"
import DesktopMenu from "./DesktopMenu"
import { useLocation } from "react-router-dom"

function DesktopLayout({children}) {
  const location = useLocation()

    return (
        <div className=''>
          <Header/>
          <div className={ `px-5 ${!["/signup", "/login"].includes(location.pathname) ? 'grid grid-cols-[20%,80%]' : ''}` }>
            {
              !["/signup", "/login"].includes(location.pathname) 
              &&
              <DesktopMenu />
            }
            <div className="">
              {children}
            </div>
            <div className="w-1/4"></div>
          </div>
        </div>
      )
}

export default DesktopLayout
