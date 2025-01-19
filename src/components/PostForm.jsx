import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import { db } from "../firebase"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"; 


function PostForm({open, handleClose}) {
    const inputFile = useRef(null)
    const [file, setFile] = useState()
    const [caption, setCaption] = useState()

    const openFileSelector = () => {
        inputFile.current.click()
    }

    const updateFile = (event) => {
        setFile(URL.createObjectURL(event.target.files[0]))
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
                <div className='grid grid-cols-2 gap-10 mt-20'>
                    {
                        file ? 
                        <img src={file} />
                        :
                        <button onClick={openFileSelector} className='text-orange-700 font-semibold'>
                            <input ref={inputFile} type='file' hidden onChange={updateFile}/>
                            Select from your device
                        </button>
                    }
                    
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