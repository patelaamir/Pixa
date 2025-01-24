import { useEffect, useState } from "react"
import useScreenSize from "../utils/screenSize"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "../firebase"

const PostList = () => {
    const screenSize = useScreenSize()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
              const querySnapShot = await getDocs(query(collection(db, "posts")));
              const postsArray = querySnapShot.docs.map((doc) => doc.data());
              setPosts(postsArray);
            } catch (error) {
              console.error("Error fetching posts:", error);
            }
          };
      
        fetchPosts();
    }, [])

    const renderedPosts = posts?.map(post => {
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