import Header from "./Header"
import PostList from "./PostList"
import DesktopMenu from "./DesktopMenu"

function DesktopLayout(props) {
    return (
        <div className='px-5'>
          <Header/>
          <div className="flex">
            <DesktopMenu />
            <PostList posts={props.posts} />
            <div className="w-1/4"></div>
          </div>
        </div>
      )
}

export default DesktopLayout
