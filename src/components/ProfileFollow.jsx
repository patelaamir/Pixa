import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ProfileFollow({ open, followList, title, handleClose }) {

    const [listDetails, setListDetails] = useState([])

    useEffect(() => {
        getFollowListDetails()
    }, [followList])

    const getFollowListDetails = async () => {
        if (followList.length <= 0) {
            setListDetails([])
            return
        }
        let field = title == "Followers" ? "follower" : "following"
        let usernames = followList.map(row => row[field])

        const q = query(
            collection(db, "userProfile"),
            where("username", "in", usernames)
        );
            
        const querySnapshot = await getDocs(q);
            
        const followResults = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setListDetails(followResults)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle className='flex justify-between'>
                {title}
            </DialogTitle>

            <DialogContent className='flex flex-col relative'>
                <div className='space-y-5'>
                    {
                        listDetails.length > 0 ?
                        listDetails?.map(row => (
                            <div className='flex space-x-2 cursor-pointer' onClick={() => {
                                window.location.href = `/profile/${row.username}`
                            }}>
                               <img src={row.image} alt={row.fullName} className='size-10 rounded-full object-cover' />
                               <div className='flex flex-col'>
                                    <span>
                                        {row.fullName}
                                    </span>
                                    <span className='text-sm text-gray-700'>
                                        {row.username}
                                    </span>
                                </div>
                            </div>
                        ))
                        :
                        <div className='text-sm text-gray-700'>
                            This profile has no {title?.toLowerCase()}.
                        </div>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProfileFollow