import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

function PostDetail( ) {
    const { postID } = useParams();
    const [post, setPost] = useState(null)

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
        <div className="w-1/3 mx-auto mt-10">
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