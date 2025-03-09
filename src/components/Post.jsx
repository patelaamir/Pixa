import { Heart, MessageCircle, EllipsisVertical } from "lucide-react"
import { useEffect, useState } from "react"
import CommentsSection from "./CommentsSection"
import { getDocs, query, collection, where, deleteDoc, doc, addDoc } from "firebase/firestore"
import { db } from "../firebase"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Post = ({ post }) => {
    const [postInfo, setPostInfo] = useState(post)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl);
    const [isLoading, updateLoading] = useState(true)
    const [openCommentsSection, showCommentsSection] = useState(false)
    const [commentsFor, setCommentsFor] = useState(null)
    const currentUser = JSON.parse(localStorage.getItem("profile"))

    useEffect(() => {
        getPostInfo()
    }, [post])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getPostInfo = async() => {
        const likesSnapShot = await getDocs(query(collection(db, "likes"), where("postID", "==", post.id)))
        const commentsSnapshot = await getDocs(query(collection(db, "comments"), where("postID", "==", post.id)))
        
        let liked = false;
        likesSnapShot.docs.map(doc => {
            if (doc.data().username == currentUser.username) {
                liked = true
            }
        })

        setPostInfo(prev => ({
            liked: liked,
            likeCount: likesSnapShot.docs.length,
            commentCount: commentsSnapshot.docs.length,
            ...prev
        }))
        updateLoading(false)
    }

    const showComments = (post) => {
        setCommentsFor(post.id)
        showCommentsSection(true)
    }

    const hideComments = () => {
        showCommentsSection(false)
        setCommentsFor(null)
    }
    

    const toggleLike = async (post) => {
        try {
            const likes = await getDocs(query(collection(db, "likes"), where("postID", "==", post.id), where("username", "==", currentUser.username)))
            console.log(likes)
            if (likes.docs.length) {
                setPostInfo(prev => ({
                    ...prev,
                    likeCount: prev.likeCount - 1,
                    liked: false,
                }))
                await deleteDoc(doc(db, "likes", likes.docs[0].id))
            } else {
                setPostInfo(prev => {
                    console.log(prev)
                    return {
                        ...prev,
                        likeCount: prev.likeCount + 1,
                        liked: true
                    }
                })
                await addDoc(collection(db, "likes"), {
                    "postID": post.id,
                    "username": currentUser.username
                })
            }
        } catch(err) {
            console.log(err);
        }
    }

    const deletePost = async (post) => {
        await deleteDoc(doc(db, "posts", post.id))
        window.location.href = `/profile/${currentUser.username}`
    }

    const options = [
        {
            "label": 'Delete',
            "action": deletePost
        }
    ];


    return (
        <div>
            {
                isLoading
                ?
                <div className="flex flex-col items-center justify-center space-y-2 w-4/5 h-96 shadow bg-gray-50 rounded-md text-gray-500">
                    <img src="/loading.gif" className="size-5"/>
                    <span>
                    Loading
                    </span>
                </div>
                :
                <div key={postInfo.id}>
                    <div className="flex items-center justify-between">
                        <a className="font-semibold" href={`/profile/${postInfo.username}`}>
                            {postInfo.username}
                        </a>
                        <EllipsisVertical className={`size-4 cursor-pointer ${currentUser.username == postInfo.username ? "block" : "hidden"}`} onClick={handleClick}/>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                            'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                            paper: {
                                style: {
                                    width: '10rem',
                                    fontSize: '14px'
                                },
                            },
                            }}
                        >
                            {options.map((option) => (
                            <MenuItem key={option.label} onClick={() => option.action(postInfo)}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <img src={postInfo.imageUrl} className="mt-4 w-full h-auto rounded-md"/>
                    <div className="my-2">
                        <span className="font-semibold mr-1.5">
                            {postInfo.username}
                        </span>
                        <span>
                            {postInfo.caption}
                        </span>
                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-1">
                            <span>
                            {postInfo.likeCount}
                            </span>
                            <Heart className={`w-5 h-5 cursor-pointer ${postInfo.liked ? 'fill-red-600 stroke-red-600' : ''}`} onClick={() => toggleLike(postInfo)}/>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span>
                            {postInfo.commentCount}
                            </span>
                            <MessageCircle className="w-5 h-5 cursor-pointer" onClick={() => showComments(postInfo)}/>
                        </div>
                    </div>
                    <CommentsSection open={openCommentsSection} post={commentsFor} handleClose={hideComments} />
                </div>
            }
        </div>
    )
}
export default Post 
