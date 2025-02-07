import { useEffect, useState } from "react"
import useScreenSize from "../utils/screenSize"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { Heart, MessageCircle } from "lucide-react"
import CommentsSection from "./CommentsSection"

const PostList = () => {
    const screenSize = useScreenSize()
    const [posts, setPosts] = useState([])
    const [postsLoading, setPostsLoading] = useState(false)
    const [openCommentsSection, showCommentsSection] = useState(false)
    const [commentsFor, setCommentsFor] = useState(null)
    const currentUser = JSON.parse(localStorage.getItem("profile"))

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPostsLoading(true)
                const followingSnapShot = await getDocs(query(collection(db, "following"), where("follower", "==", currentUser.username)))
                const following = followingSnapShot.docs.map(doc => doc.data().following)

                if (following.length) {
                    const querySnapShot = await getDocs(query(collection(db, "posts"), where("username", "in", following)));
                    let postsArray = querySnapShot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        }
                        
                    });

                    const postIDs = postsArray.map(post => post.id)
                    const likesSnapShot = await getDocs(query(collection(db, "likes"), where("postID", "in", postIDs)))
                    const likedPosts = likesSnapShot.docs.map(doc => {
                        if (doc.data().username == currentUser.username) {
                            return doc.data().postID
                        }
                    })
                    const commentsSnapshot = await getDocs(query(collection(db, "comments"), where("postID", "in", postIDs)))
                    console.log(commentsSnapshot.docs);
                    
                    
                    postsArray = postsArray.map(post => {
                        return {
                            liked: likedPosts.includes(post.id) ? true : false,
                            likeCount: likesSnapShot.docs.filter(doc => doc.data().postID == post.id).length,
                            commentCount: commentsSnapshot.docs.filter(doc => doc.data().postID == post.id).length,
                            ...post
                        }
                    })
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

    const toggleLike = async (post) => {
        try {
            const likes = await getDocs(query(collection(db, "likes"), where("postID", "==", post.id), where("username", "==", currentUser.username)))
            if (likes.docs.length) {
                setPosts(prevPosts => prevPosts.map(row => {
                    if (row.id == post.id) {
                        return {
                            ...row,
                            likeCount: row.likeCount - 1,
                            liked: false
                        }
                    } else {
                        return row
                    }
                }))
                await deleteDoc(doc(db, "likes", likes.docs[0].id))
            } else {
                setPosts(prevPosts => prevPosts.map(row => {
                    if (row.id == post.id) {
                        return {
                            ...row,
                            likeCount: row.likeCount + 1,
                            liked: true
                        }
                    } else {
                        return row
                    }
                }))
                await addDoc(collection(db, "likes"), {
                    "postID": post.id,
                    "username": currentUser.username
                })
            }
        } catch(err) {
            console.log(err);
        }
    }

    const showComments = (post) => {
        setCommentsFor(post.id)
        showCommentsSection(true)
    }

    const hideComments = () => {
        showCommentsSection(false)
        setCommentsFor(null)
    }

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
                <div className="flex items-center space-x-5">
                    <div className="flex items-center space-x-1">
                        <span>
                        {post.likeCount}
                        </span>
                        <Heart className={`w-5 h-5 cursor-pointer ${post.liked ? 'fill-red-600 stroke-red-600' : ''}`} onClick={() => toggleLike(post)}/>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span>
                        {post.commentCount}
                        </span>
                        <MessageCircle className="w-5 h-5 cursor-pointer" onClick={() => showComments(post)}/>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="my-5">
            {
                posts.length 
                ?
                <div className={ `flex flex-col space-y-10 ${screenSize.width < 640 ? 'w-full' : 'w-1/2'}`  }>
                {renderedPosts}
                </div>
                :
                postsLoading
                ?
                <div className="text-center mt-40">
                    Loading ...
                </div>
                :
                <div className="flex items-center justify-center mt-52">
                    No posts found. Please  <a href="/search" className="mx-1 text-orange-600"> search </a> for friends and follow them.
                </div>
            }
            <CommentsSection open={openCommentsSection} post={commentsFor} handleClose={hideComments} />
        </div>
        
    )
}

export default PostList