import useScreenSize from "../utils/screenSize"

const PostList = (props) => {
    const screenSize = useScreenSize()

    const renderedPosts = props.posts.map(post => {
        return (
            <div key={post.username}>
                <div className="font-semibold py-2">
                    {post.username}
                </div>
                <img src={post.imageUrl} className="w-full"/>
                <div className="my-2">
                    <span className="font-semibold mr-1.5">
                        {post.username}
                    </span>
                    <span>
                        {post.caption}
                    </span>
                </div>
            </div>
        )
    })

    return (
        <div className={ screenSize.width < 640 ? 'w-full' : 'w-1/2' }>
            {renderedPosts}
        </div>
    )
}

export default PostList