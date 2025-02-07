import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from "dayjs/esm/plugin/relativeTime"

function CommentsSection({open, post, handleClose}) {

    const [newComment, setNewComment] = useState(null)
    const [comments, setComments] = useState([])
    const currentUser = JSON.parse(localStorage.getItem("profile"))
    dayjs.extend(relativeTime)

    useEffect(() => {
        getComments()
    }, post)

    const getComments = async () => {
        try {
            const commentsQuerySnapshot = await getDocs(query(collection(db, "comments"), where("postID", "==", post), orderBy("createdAt", "desc")))
            const commentsResult = commentsQuerySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            setComments(commentsResult)
            
        } catch (err) {
            console.log(err);
        }
    }

    const updateNewComment = (event) => {
        setNewComment(event.target.value)
    }

    const postComment = async () => {
        await addDoc(collection(db, "comments"), {
            "postID": post,
            "username": currentUser.username,
            "comment": newComment,
            "createdAt": serverTimestamp()
        }).then(data => {
            setComments(prevComments => {
                return [{
                    "post": post,
                    "username": currentUser.username,
                    "comment": newComment,
                    "createdAt": new Date()
                }, ...prevComments]
            })
            document.getElementById("newComment").value = null
        })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className='flex justify-between'>
                Comments
            </DialogTitle>

            <DialogContent className='flex flex-col h-96'>
                <div className='space-y-4'>
                    {
                        comments.map(comment => (
                            <div key={comment.id} className='flex flex-col space-y-1'>
                                <div className='flex items-center space-x-2'>
                                    <div className='font-semibold'>
                                        {comment.username}
                                    </div>
                                    <div className='text-xs text-gray-600'>
                                    {comment.createdAt 
                                        ? dayjs(comment.createdAt instanceof Date 
                                            ? comment.createdAt 
                                            : comment.createdAt.toDate()
                                        ).fromNow()
                                        : "Just now"}
                                    </div>
                                </div>
                                <div>
                                    {comment.comment}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='flex space-x-4 mt-auto'>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newComment"
                        name="newComment"
                        placeholder="Comment"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={updateNewComment}
                        />
                    <button className='button' onClick={postComment}>
                        Post
                    </button>
              </div>
               
            </DialogContent>
        </Dialog>
    )
}

export default CommentsSection