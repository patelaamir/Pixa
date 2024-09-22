import Header from "./Header"
import PostList from "./PostList"
import Menu from "./Menu"

function DesktopLayout(props) {
    return (
        <div className='px-5'>
          <Header/>
          <PostList posts={props.posts}/>
          <Menu/>
        </div>
      )
}

export default DesktopLayout
