import { TextField } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react"
import { db } from '../firebase';
import { User } from "lucide-react"
import { Link } from "react-router-dom";

function Search() {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        if (search.trim() !== "") {
            searchUserProfile()
        } else {
            setSearchResults([])
        }
    }, [search, users])

    const getAllUsers = async () => {
        try {
            setLoading(true)
            const querySnapShot = await getDocs(collection(db, "userProfile"))
            let results = querySnapShot.docs?.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) || []
            setUsers(results)
        } catch (err) {
            console.error("Error fetching users:", err)
        } finally {
            setLoading(false)
        }
    }

    const searchUserProfile = () => {
        const query = search.trim().toLowerCase()
        let results = users.filter(user => {
            const username = (user.username || "").toLowerCase()
            const fullName = (user.fullName || "").toLowerCase()
            return username.includes(query) || fullName.includes(query)
        })
        setSearchResults(results)
    }
   
    return (
        <div className='mt-10'>
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
                        loading ? (
                            <div className='text-sm text-gray-500'>Loading users...</div>
                        ) : search.trim() !== "" && searchResults.length === 0 ? (
                            <div className='text-sm text-gray-500'>No users found matching &quot;{search}&quot;.</div>
                        ) : (
                            searchResults.map((profile) => (
                                <Link key={profile.id || profile.username || profile.email} className='flex items-center space-x-2 text-sm hover:bg-gray-50 p-2 rounded-md transition-colors' to={`/profile/${profile.username}`}>
                                    {
                                        profile.image
                                        ?
                                        <img src={profile.image} alt={profile.username} className='w-8 h-8 rounded-full object-cover'/>
                                        :
                                        <User className='w-8 h-8 p-1 bg-gray-100 rounded-full stroke-1'/>
                                    }
                                    <div>
                                        <div className='font-medium text-gray-900'>
                                            {profile.fullName || profile.username}
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                            @{profile.username}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )
                    }
                </div>
        </div>
    )
}

export default Search