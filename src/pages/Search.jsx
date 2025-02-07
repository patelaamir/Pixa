import { TextField } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react"
import { db } from '../firebase';
import { User } from "lucide-react"
import { useNavigate } from "react-router-dom";


function Search() {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        if (search != "")
            searchUserProfile()
        else
            setSearchResults([])
    }, [search])

    const getAllUsers = async () => {
        try {
            const querySnapShot = await getDocs(collection(db, "userProfile"))
            let results = querySnapShot.docs?.map(doc => doc.data())
            setUsers(results)
        } catch (err) {
            console.log(err)
        }
    }

    const searchUserProfile = () => {
        let results = users.filter(user => {
            return user.username.toLowerCase().includes(search.toLowerCase()) || user.fullName.toLowerCase().includes(search.toLowerCase())
        })
        setSearchResults(results)
        console.log(searchResults);
        
    }
   
    return (
        <div>
            <TextField
                autoFocus
                margin="dense"
                id="search"
                name="search"
                label="Search"
                type="text"
                fullWidth
                variant="standard"
                value={search}
                onChange={(event) => setSearch(event.target.value) }
                />

                <div className='space-y-4 mt-5'>
                    {
                        searchResults.map((profile, index) => (
                        <a className='flex items-center space-x-2 text-sm' href={`/profile/${profile.username}`}>
                            {
                                profile.image
                                ?
                                <img src={profile.image} className='w-8 h-8 rounded-full'/>
                                :
                                <User className='w-8 h-8 p-1 bg-gray-100 rounded-full stroke-1'/>
                            }
                            <div>
                                <div>
                                    {profile.fullName}
                                </div>
                                <div className='text-xs'>
                                    {profile.username}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
        </div>
    )
}

export default Search