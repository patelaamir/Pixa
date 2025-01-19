import { auth, db } from "../firebase"
import { query, collection, where, getDocs } from "firebase/firestore"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react'

function Login() {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth);
    console.log(user)

    useEffect(() => {
        if (!loading && user) {
            navigate("/")
        }
    }, [loading])

    const handleLogin = (e) => {
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const currentUser = userCredential.user;
            getUserProfile(currentUser)
        }).catch((error) => {
            const errorCode = error.code;
        });
    }

    const getUserProfile = async (currentUser) => {
        const q = query(collection(db, "userProfile"), where("email", "==", currentUser.email));
    
        const querySnapshot = await getDocs(q);
        const profile = querySnapshot.docs[0].data()
        localStorage.setItem("profile", JSON.stringify(profile))
        navigate("/")
    }

    return(
        <div className="flex flex-col w-1/4 mx-auto text-center shadow-xl rounded-lg mt-20 p-5">
            <div className="font-semibold text-xl mb-2">
                Login
            </div>
            <div className="text-sm mb-5">
                Enter your detils to login into your account
            </div>
            <div className="space-y-4">
                <input className="border rounded-md py-2 px-4 w-full"
                    type="email" 
                    id="email" 
                    placeholder="Email"/>
                <input className="border rounded-md py-2 px-4 w-full"
                    type="password"
                    id="password"
                    placeholder="Password"/>
                <button 
                    onClick={handleLogin}
                    className="button">
                    Login
                </button>
                <div className="text-sm text-gray-600">
                    Dont have an account?  
                    <a href="/signup" className="text-blue-700"> Create New </a>
                    </div> 
            </div>
        </div>
    )
}

export default Login