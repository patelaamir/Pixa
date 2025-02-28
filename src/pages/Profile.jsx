import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, setDoc, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../firebase";
import { User, X } from "lucide-react";


function Profile () {
    const { username } = useParams();
    const [profile, setProfile] = useState({})
    const [posts, setPosts] = useState([])
    const [following, setFollowing] = useState(false)
    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const currentUser = JSON.parse(localStorage.getItem("profile"));
   
    useEffect(() => {
        getProfileData()
        getFollowerCount()
        getFollowingCount()
    }, [username])
    

    const getProfileData = async () => {
        try {
            const q = query(collection(db, "userProfile"), where("username", "==", username));
            const querySnapShot = await getDocs(q)
            querySnapShot.forEach(async doc => {
                let data = await doc.data()
                setProfile(data)
                if (currentUser.username == username) {
                    getPosts()
                } else if (!data.private) {
                    getPosts()
                } else {
                    checkIfFollowing()
                }
                
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

    const getFollowerCount = async () => {
        const snapShot = await getCountFromServer(query(collection(db, "following"), where("following", "==", username)))
        setFollowerCount(snapShot.data().count)
    }

    const getFollowingCount = async () => {
        const snapShot = await getCountFromServer(query(collection(db, "following"), where("follower", "==", username)))
        setFollowingCount(snapShot.data().count)
    }

    const checkIfFollowing = async () => {
        const q = query(collection(db, "following"), where("following", "==", username), where("follower", "==", currentUser.username))
        const querySnapShot = await getDocs(q)
        querySnapShot.forEach(doc => {
            if (doc) {
                setFollowing(doc.id)
                getPosts()
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
                getPosts()
                getFollowerCount()
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
                setPosts([])
                getFollowerCount()
            })
        }
    }

    return (
        <div className="p-5">
            {
                profile.fullName
                ?
                <div className="">
                    <div className="flex flex-col space-y-5">
                    <div className="space-y-4">
                            <div className="text-lg font-semibold">
                                {profile.username}
                            </div>
                            <div className="flex space-x-10">
                                {
                                    profile.image
                                    ?
                                    <img src={profile.image} className="w-20 h-20 object-cover rounded-full"/>
                                    :
                                    <User className="border w-20 h-20 bg-gray-100 rounded-full p-5"/>
                                }
                                <div className="flex items-center space-x-10">
                                    <div className="flex flex-col items-center">
                                        <span>
                                            Posts
                                        </span>
                                        <span className="font-semibold">
                                            { posts.length }
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span>
                                            Followers
                                        </span>
                                        <span className="font-semibold">
                                            { followerCount }
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span>
                                            Following
                                        </span>
                                        <span className="font-semibold">
                                            { followingCount }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div className="font-medium">
                                    {profile.fullName}
                                </div>
                                <div className="text-sm">
                                    {profile.bio}
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-fit">
                            { 
                                currentUser.username == profile.username ? 
                                ""
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
                        <div className="">
                            <div className="text-xl font-semibold mb-5">
                                Posts
                            </div>
                            <div className="grid grid-cols-3 gap-10">
                                {
                                    posts.map(post => {
                                        return (
                                        <a href={`/post/${post.id}`} className="">
                                                <img src={post.imageUrl} className="max-h-96"/>
                                            </a>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {
                            !following && profile.private
                            ?
                            <div className="text-gray-600">
                                This account is Private
                            </div>
                            :
                            ''
                        }
                    </div>
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