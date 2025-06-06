import { useEffect, useState } from "react"
import useScreenSize from "../utils/screenSize"
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../firebase"
import Post from "./Post"

const PostList = () => {
    const screenSize = useScreenSize()
    const [posts, setPosts] = useState([])
    const [postsLoading, setPostsLoading] = useState(false)

    const currentUser = JSON.parse(localStorage.getItem("profile"))

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPostsLoading(true)
                const followingSnapShot = await getDocs(query(collection(db, "following"), where("follower", "==", currentUser.username)))
                const following = followingSnapShot.docs.map(doc => doc.data().following)

                if (following.length) {
                    const querySnapShot = await getDocs(query(collection(db, "posts"), where("username", "in", following), orderBy("createdAt", "desc")));
                    let postsArray = querySnapShot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        }
                        
                    });
                    setPosts(postsArray);
                    setPostsLoading(false)
                } else {
                    setPostsLoading(false)
                }
                
            } catch (error) {
              console.error("Error fetching posts:", error);
            }
          };
      
        fetchPosts();
    }, [])


    const renderedPosts = posts?.map(post => {
        return (
           <Post post={post} />
        )
    })

    return (
        <div className="my-5">
            {
                posts.length 
                ?
                <div className={ `flex flex-col space-y-20 ${screenSize.width < 640 ? '' : 'w-1/3'}`  }>
                {renderedPosts}
                </div>
                :
                postsLoading
                ?
                <div className="flex flex-col items-center justify-center space-y-2 mt-80 text-gray-500">
                <img src="/loading.gif" className="size-5"/>
                <span>
                Loading
                </span>
            </div>
                :
                <div className="text-center mt-10 py-20 px-10 bg-gray-100 rounded-md">
                    No posts found. Please  <a href="/search" className="mx-1 text-orange-600"> search </a> for friends and follow them.
                </div>
            }
        </div>
        
    )
}

export default PostList