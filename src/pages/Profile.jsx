import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"
import { db } from "../firebase";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

function Profile () {
    const { username } = useParams();
    const [profile, setProfile] = useState({})
    const [following, setFollowing] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const currentUser = JSON.parse(localStorage.getItem("profile")).username;
    const inputFile = useRef(null)


    useEffect(() => {
        getProfileData()
    }, [username])

    const getProfileData = async () => {
        try {
            const q = query(collection(db, "userProfile"), where("username", "==", username));
            const querySnapShot = await getDocs(q)
            querySnapShot.forEach(async doc => {
                let data = await doc.data()
                console.log(data, data.fullName)
                setProfile(data)
                checkIfFollowing()
            })
        } catch(err) {
            console.log(err)
        }
    }

    const checkIfFollowing = async () => {
        const q = query(collection(db, "following"), where("following", "==", username), where("follower", "==", currentUser))
        const querySnapShot = await getDocs(q)
        querySnapShot.forEach(doc => {
            if (doc) {
                setFollowing(doc.id)
            }
        })
    }

    const followProfile = async (event) => {
        event.preventDefault()
        try {
            const docRef = await addDoc(collection(db, "following"), {
                "following": username,
                "follower": currentUser,
                "createdAt": serverTimestamp()
            }).then(data => {
                setFollowing(data.id)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const unfollowProfile = async (event) => {
        event.preventDefault()
        if (following) {
            await deleteDoc(doc(db, "following", following)).then(data => {
                setFollowing(false)
            })
        }
    }

    const openEditForm = (event) => {
        event.preventDefault()
        setOpenDialog(true)
    }

    const handleClose = (event) => {
        event.preventDefault()
        setOpenDialog(false)
    }

    const saveProfile = async (event) => {
        event.preventDefault()
        await setDoc(doc(db, "userProfile"))
    } 

    const updateProfile = (event) => {
        let id = event.target.id
        let value = id == "image" ? URL.createObjectURL(event.target.files[0]) : event.target.value
       setProfile(prevState => ({
            ...prevState,
            [id]: value
       }))
    }

    const removeImage = (event) => {
        event.preventDefault();
        setProfile(prevState => ({
           ...prevState,
           "image": null 
        }))
    }

    const openFileSelector = (event) => {
        event.preventDefault()
        inputFile.current.click()
    }

    return (
        <div className="p-5">
            <div className="flex flex-col space-y-4">
                <div className="text-lg font-semibold">
                    {profile.username}
                </div>
                <img src={profile.image} className="w-20 h-20 object-cover rounded-full"/>
                <div className="flex flex-col">
                    <div>
                        {profile.fullName}
                    </div>
                    <div>
                        {profile.bio}
                    </div>
                </div>
                <div className="w-fit">
                    { 
                        currentUser == profile.username ? 
                        <div className="button" onClick={openEditForm}>
                            Edit Profile
                        </div>
                        : following ? 
                        <div className="button" onClick={unfollowProfile}>
                            Unfollow
                        </div> 
                        :
                        <div className="button" onClick={followProfile}>
                            Follow
                        </div>
                    }
                </div>
            </div>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    component: "form",
                }}
            >
                <DialogTitle className='flex justify-between'>
                    Edit Your Profile
                    <button className='text-orange-700 font-semibold' type="submit" onClick={saveProfile}>
                        Save
                    </button>
                </DialogTitle>

                <DialogContent className='h-96 space-y-4'>
                    {
                        profile.image ? 
                        <div className="flex items-center space-x-2">
                            <img src={profile.image} className="w-20 h-20 object-cover rounded-full" />
                            <div className="button w-fit" onClick={removeImage}>
                                Remove Image
                            </div>
                        </div>

                        :
                        <button onClick={openFileSelector} className='text-orange-700 font-semibold'>
                            <input ref={inputFile} type='file' id="image" hidden onChange={updateProfile}/>
                            Select from your device
                        </button>
                    }
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="fullName"
                        name="fullName"
                        label="Full Name"
                        type="text"
                        value={profile.fullName}
                        fullWidth
                        variant="standard"
                        onChange={updateProfile}
                        />

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="bio"
                        name="bio"
                        label="Bio"
                        type="text"
                        value={profile.bio}
                        fullWidth
                        variant="standard"
                        onChange={updateProfile}
                        />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Profile