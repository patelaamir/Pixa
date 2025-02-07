import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../firebase";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { User, X } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react"


function Profile () {
    const { username } = useParams();
    const [profile, setProfile] = useState({})
    const [posts, setPosts] = useState([])
    const [following, setFollowing] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const currentUser = JSON.parse(localStorage.getItem("profile"));
    const URLEndpoint = "https://ik.imagekit.io/pixa/"
    const publicKey = "public_AZOsWS07COGHjErNayUX76zd4Oc="


    useEffect(() => {
        getProfileData()
        getPosts()
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

    const getPosts = async () => {
        let postsSnapshot = await getDocs(query(collection(db, "posts"), where("username", "==", username)))
        let postResult = postsSnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        setPosts(postResult)
    }

    const authenticateImageKit = async () => {
        try {
          const response = await fetch('http://localhost:3001/auth');
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
    
            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    }

    const checkIfFollowing = async () => {
        const q = query(collection(db, "following"), where("following", "==", username), where("follower", "==", currentUser.username))
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
                "follower": currentUser.username,
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

    const handleClose = () => {
        setOpenDialog(false)
    }

    const saveProfile = async (event) => {
        event.preventDefault()
        await setDoc(doc(db, "userProfile", currentUser.email), profile).then(data => {
            handleClose()
        })
    } 

    const updateProfile = (event) => {
        let id = event.target.id
        let value = id == "image" ? URL.createObjectURL(event.target.files[0]) : event.target.value
       setProfile(prevState => ({
            ...prevState,
            [id]: value
       }))
    }

    const updateImage = (response) => {
        setProfile(prevState => ({
            ...prevState,
            image: response.url
        }))
    }

    const removeImage = (event) => {
        event.preventDefault();
        setProfile(prevState => ({
           ...prevState,
           "image": null 
        }))
    }

    return (
        <div className="p-5">
            {
                profile.fullName
                ?
                <div className="">
                    <div className="flex flex-col space-y-10">
                        <div className="space-y-4">
                            <div className="text-lg font-semibold">
                                {profile.username}
                            </div>
                            {
                                profile.image
                                ?
                                <img src={profile.image} className="w-20 h-20 object-cover rounded-full"/>
                                :
                                <User className="border w-20 h-20 bg-gray-100 rounded-full p-5"/>
                            }
                            <div className="flex flex-col">
                                <div>
                                    {profile.fullName}
                                </div>
                                <div>
                                    {profile.bio}
                                </div>
                            </div>
                        </div>
                        <div className="w-fit">
                            { 
                                currentUser.username == profile.username ? 
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
                        <div className="grid grid-cols-3 gap-10">
                            {
                                posts.map(post => {
                                    return (
                                       <a href={`/post/${post.id}`} className="h-[100%]">
                                            <img src={post.imageUrl} />
                                        </a>
                                    )
                                })
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
                            <IKContext
                                urlEndpoint={URLEndpoint}
                                publicKey={publicKey}
                                authenticator={authenticateImageKit}
                            >
                                {
                                    profile.image ?
                                    <div className="flex items-center space-x-5">
                                        <img src={profile.image} className='w-20 h-20' />
                                        <X className="size-5 bg-gray-100 p-1 rounded-full cursor-pointer" onClick={removeImage}/>
                                    </div>
                                    :
                                    <IKUpload
                                        onError={(err) => console.log(err)}
                                        onSuccess={updateImage}
                                    />
                                }
                            </IKContext>

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
                :
                <div className="flex flex-col items-center justify-center space-y-2 mt-60 text-gray-500">
                    <img src="../public/loading.gif" className="size-5"/>
                    <span>
                    Loading
                </span>
            </div>
            }
        </div>
    )
}

export default Profile