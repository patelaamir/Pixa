import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import { db } from "../firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { IKContext, IKUpload } from "imagekitio-react"

function PostForm({open, handleClose}) {
    const inputFile = useRef(null)
    const [file, setFile] = useState()
    const [caption, setCaption] = useState()
    const URLEndpoint = "https://ik.imagekit.io/pixa/"
    const publicKey = "public_AZOsWS07COGHjErNayUX76zd4Oc="

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

    const openFileSelector = () => {
        inputFile.current.click()
    }

    const updateFile = (response) => {
       console.log(response)
       setFile(response.url)
    }

    const updateCaption = (event) => {
        setCaption(event.target.value)
    }
    const savePost = async (event) => {
        event.preventDefault()
        try {
            const docRef =  await addDoc(collection(db, "posts"), {
                caption: caption,
                imageUrl: file,
                username: JSON.parse(localStorage.getItem("profile")).username,
                createdAt: serverTimestamp()
            }).then(data => {
                handleClose()
            })
        } catch(error) {
            console.log(error)
        }
        
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
                Create a Post
                <button className='text-orange-700 font-semibold' type="submit" onClick={savePost}>
                    Post
                </button>
            </DialogTitle>

            <DialogContent className='h-96'>
                <div className='grid grid-cols-2 gap-10 mt-5'>

                    <IKContext
                        urlEndpoint={URLEndpoint}
                        publicKey={publicKey}
                        authenticator={authenticateImageKit}
                    >
                        {
                            file ?
                            <img src={file} className='h-[50%]' />
                            :
                            <IKUpload
                                onError={(err) => console.log(err)}
                                onSuccess={updateFile}
                            />
                        }
                    </IKContext>
                    
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="caption"
                        label="Caption"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={updateCaption}
                        />
              </div>
               
            </DialogContent>
        </Dialog>
    )
}

export default PostForm