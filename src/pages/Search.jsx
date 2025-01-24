import { TextField } from '@mui/material';
import { collection, getDocs, where } from 'firebase/firestore';
import { useEffect, useState } from "react"
import { db } from '../firebase';


function Search() {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        console.log(search)
        if (search != "")
            searchUserProfile()
        else
            setSearchResults([])
    }, [search])

    const searchUserProfile = async () => {
        try {
            const querySnapShot = await getDocs(collection(db, "userProfile"), where("username", ">=", search), where("username", "<=", search + "\uf8ff"))
            let results = querySnapShot.docs?.map(doc => doc.data())
            console.log(results)
            setSearchResults(results)
            console.log(searchResults)
        } catch(err) {
            console.log(err)
        }
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

        </div>
    )
}

export default Search