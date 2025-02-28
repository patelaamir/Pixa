import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import useScreenSize from "../utils/screenSize"

function PostDetail( ) {
    const { postID } = useParams();
    const [post, setPost] = useState(null)
    const screenSize = useScreenSize()

    useEffect(() => {
        getPost()
    }, [postID])

    const getPost = async () => {
        try {
            let snapShot = await getDoc(doc(db, "posts", postID))
            if (snapShot.exists()) {
                setPost({
                    id: snapShot.id,
                    ...snapShot.data()
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={`mt-5 ${screenSize.width < 640 ? 'w-full' : 'w-1/3'}`}>
           {
            post
            ?
            <Post post={post} />
            :
            <div className="flex flex-col items-center justify-center space-y-2 mt-80 text-gray-500">
            <img src="../public/loading.gif" className="size-5"/>
            <span>
            Loading
            </span>
        </div>
           }
        </div>
    )    
}

export default PostDetail