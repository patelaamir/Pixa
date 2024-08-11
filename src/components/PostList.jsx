const PostList = (props) => {

    const renderedPosts = props.posts.map(post => {
        return (
            <div className="w-full">
                <div className="font-semibold py-2">
                    {post.username}
                </div>
                <img src={post.image} className="w-full"/>
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
        <div>
            {renderedPosts}
        </div>
    )
}

export default PostList