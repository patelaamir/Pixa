import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import { db } from "../firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { IKContext, IKUpload } from "imagekitio-react"
import { Filter } from 'bad-words'

function PostForm({open, handleClose}) {
    const inputFile = useRef(null)
    const [file, setFile] = useState()
    const [caption, setCaption] = useState()
    const URLEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
    const filter = new Filter();

    const authenticateImageKit = async () => {
        try {
            const baseURL =
                import.meta.env.PROD
                ? "https://pixa-omega.vercel.app"
                : "http://localhost:3001";

            
          const actualURL = import.meta.env.PROD ? `${baseURL}/api/auth`: `${baseURL}/auth`
          const response = await fetch(actualURL);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
    
            const data = await response.clone().json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    }

    const updateFile = (response) => {
       setFile(response.url)
    }

    const updateCaption = (event) => {
        setCaption(event.target.value)
    }
    const savePost = async (event) => {
        event.preventDefault()
        try {

            if (!file) {
                alert("Please add an image")
            }

            if (filter.isProfane(caption)) {
                alert("Vulgar content is not allowed!");
                return;
            }

            const docRef =  await addDoc(collection(db, "posts"), {
                caption: caption,
                imageUrl: file,
                username: JSON.parse(localStorage.getItem("profile")).username,
                createdAt: serverTimestamp()
            }).then(data => {
                handleClose()
                window.location.href = `/post/${data.id}`
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

            <DialogContent className='h-5/6'>
                <div className=''>

                    <IKContext
                        urlEndpoint={URLEndpoint}
                        publicKey={publicKey}
                        authenticator={authenticateImageKit}
                    >
                        {
                            file ?
                            <div className='border p-5 h-80 flex justify-center items-center '>
                                 <img src={file} className='h-[100%]' />
                            </div>
                            :
                            <div className='border rounded-md p-5 h-80 flex justify-center items-center '>
                                <IKUpload
                                    className='text-sm'
                                    accept='image/*'
                                    onError={(err) => {
                                        console.log(err)
                                    }}
                                    onSuccess={updateFile}
                                />
                            </div>
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