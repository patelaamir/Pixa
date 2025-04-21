import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../firebase';

function Likes({open, post, handleClose}) {
    const [likes, setLikes] = useState([])

    useEffect(() => {
        getLikes()
    }, [post])

    const getLikes = async () => {
        let likeUsernames = post?.likes?.map(like => like.username)

        const q = query(
            collection(db, "userProfile"),
            where("username", "in", likeUsernames)
        );
          
        const querySnapshot = await getDocs(q);
          
        const likesResult = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setLikes(likesResult)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className='flex justify-between'>
                Liked By
            </DialogTitle>

            <DialogContent className='flex flex-col relative'>
                <div className='space-y-5'>
                    {
                        likes?.map(like => (
                            <div className='flex space-x-2 cursor-pointer' onClick={() => {
                                window.location.href = `/profile/${like.username}`
                            }}>
                                <img className='size-10 object-cover rounded-full' src={like.image} />
                                <div className='flex flex-col'>
                                    <span>
                                        {like.fullName}
                                    </span>
                                    <span className='text-sm text-gray-700'>
                                        {like.username}
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Likes