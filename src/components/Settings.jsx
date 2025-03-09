import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { IKContext, IKUpload } from "imagekitio-react"
import { useEffect, useState } from 'react';
import { query, collection, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { X } from "lucide-react"

function Settings({ open, handleClose }) {
    const URLEndpoint = "https://ik.imagekit.io/pixa/"
    const publicKey = "public_AZOsWS07COGHjErNayUX76zd4Oc="
    const [profile, setProfile] = useState({})
    const currentUser = JSON.parse(localStorage.getItem("profile"))

    useEffect(() => {
        getProfileData()
    }, [])

    const getProfileData = async () => {
        try {
            const q = query(collection(db, "userProfile"), where("username", "==", currentUser.username));
            const querySnapShot = await getDocs(q)
            querySnapShot.forEach(async doc => {
                let data = await doc.data()
                console.log(data, data.fullName)
                setProfile(data)
            })
        } catch(err) {
            console.log(err)
        }
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
    
    const saveProfile = async (event) => {
        event.preventDefault()
        console.log(profile)
        await setDoc(doc(db, "userProfile", currentUser.email), profile).then(data => {
            handleClose()
        })
    } 

    const updateProfile = (event) => {
        let id = event.target.id
        let value = id == "image" ? URL.createObjectURL(event.target.files[0]) : id == "private" ? event.target.checked : event.target.value
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
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                component: "form",
            }}
        >
            <DialogTitle className='flex justify-between'>
                Settings
                <button className='text-orange-700 font-semibold' type="submit" onClick={saveProfile}>
                    Save
                </button>
            </DialogTitle>
            <DialogContent className='flex flex-col space-y-5 h-96'>
                <IKContext
                    urlEndpoint={URLEndpoint}
                    publicKey={publicKey}
                    authenticator={authenticateImageKit}
                >
                    {
                        profile.image ?
                        <div className="flex items-center space-x-5">
                            <img src={profile.image} className='w-20 h-20 object-cover rounded-full' />
                            <X className="size-5 bg-gray-100 p-1 rounded-full cursor-pointer" onClick={removeImage}/>
                        </div>
                        :
                        <IKUpload
                            onError={(err) => {
                                console.log(err)
                                alert(JSON.parse(err))
                            }}
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
                <FormControlLabel control={<Checkbox size="medium" id='private' onChange={updateProfile} checked={profile.private} />} label="Private" />
                
                {/* <button className='text-red-600 font-semibold w-fit rounded-md'>
                    Delete Account
                </button> */}
            </DialogContent>
        </Dialog>
    )
}

export default Settings