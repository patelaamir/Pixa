import Header from "./Header"
import PostList from "./PostList"
import DesktopMenu from "./DesktopMenu"

function DesktopLayout({children}) {
    return (
        <div className='px-5'>
          <Header/>
          <div className="flex">
            <DesktopMenu />
            <div>
              {children}
            </div>
            <div className="w-1/4"></div>
          </div>
        </div>
      )
}

export default DesktopLayout
