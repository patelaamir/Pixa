import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, setDoc, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../firebase";
import { User, X } from "lucide-react";
import useScreenSize from "../utils/screenSize"
import ProfileFollow from "../components/ProfileFollow";

function Profile () {
    const { username } = useParams();
    const [profile, setProfile] = useState({})
    const [posts, setPosts] = useState([])
    const [following, setFollowing] = useState(false)
    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [openFollowList, setOpenFollowList] = useState(false)
    const [followListTitle, setFollowListTitle] = useState(null)
    const [followerList, setFollowerList] = useState([])
    const [followingList, setFollowingList] = useState([])
    const [currentFollowList, setCurrentFollowList] = useState([])
    const currentUser = JSON.parse(localStorage.getItem("profile"));
    const screenSize = useScreenSize()
   
    useEffect(() => {
        getProfileData()
        getFollowers()
        getFollowings()
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

    const getFollowers = async () => {
        const q = query(collection(db, "following"), where("following", "==", username))
        const snapShot = await getDocs(q)
        const followResult = snapShot.docs.map(doc => doc.data())
        setFollowerList(followResult)
        setFollowerCount(snapShot.docs.length)
    }

    const getFollowings = async () => {
        const q = query(collection(db, "following"), where("follower", "==", username))
        const snapShot = await getDocs(q)
        const followResult = snapShot.docs.map(doc => doc.data())
        setFollowingList(followResult)
        setFollowingCount(snapShot.docs.length)
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
                getFollowers()
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
                getFollowers()
            })
        }
    }

    const showFollowList = (title) => {
        title == "Followers" ? setCurrentFollowList(followerList) : setCurrentFollowList(followingList)
        setOpenFollowList(true)
        setFollowListTitle(title)
    }

    const hideFollowList = () => {
        setOpenFollowList(false)
        setCurrentFollowList(null)
        setFollowListTitle(null)
    }

    return (
        <div className="py-5">
            {
                profile.fullName
                ?
                <div className="">
                    <div className="flex flex-col space-y-5">
                    <div className="space-y-4">
                            <div className="text-lg font-semibold">
                                {profile.username}
                            </div>
                            <div className={`flex ${screenSize.width < 640 ? 'space-x-5' : 'space-x-10'}`}>
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
                                    <div className="flex flex-col items-center cursor-pointer" onClick={() => showFollowList("Followers")}>
                                        <span>
                                            Followers
                                        </span>
                                        <span className="font-semibold">
                                            { followerCount }
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center cursor-pointer" onClick={() => showFollowList("Following")}>
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
                            <div className="grid grid-cols-3 gap-2">
                                {
                                    posts.map(post => {
                                        return (
                                        <a href={`/post/${post.id}`} className="">
                                                <img src={post.imageUrl} className="w-full h-full object-cover" style={{
                                                    'aspectRatio': '1/1'
                                                }}/>
                                            </a>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {
                            profile.username != currentUser.username && !following && profile.private
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
                    <img src="/loading.gif" className="size-5"/>
                    <span>
                    Loading
                </span>
            </div>
            }
            <ProfileFollow open={openFollowList} followList={currentFollowList} title={followListTitle} handleClose={hideFollowList} />
        </div>
    )
}

export default Profile