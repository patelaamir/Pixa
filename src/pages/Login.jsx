import { auth, db } from "../firebase"
import { query, collection, where, getDocs } from "firebase/firestore"
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react'
import useScreenSize from "../utils/screenSize";

function Login () {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth);
    const screenSize = useScreenSize()

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.keyCode === 13) {
                handleLogin(event);
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
    
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!loading && user) {
            navigate("/")
        }
    }, [loading])


    const handleLogin = (e) => {
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value

        if (!email || !password) {
            alert("Please enter your Email and Password.")
            return
        }

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

    const triggerForgotPasswordEmail = () => {
        let email = document.getElementById("email").value
        if (!email) {
            alert("Please enter an email")
            return
        }
        sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("If an account with this email exists, we’ve sent a password reset link to your inbox.")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
      
    }

    return(
        <div className={`flex flex-col mx-auto text-center shadow-xl rounded-lg mt-20 p-5 ${screenSize.width < 640 ? 'w-full' : 'w-1/4'}`}>
            <div className="font-semibold text-xl mb-2">
                Login
            </div>
            <div className="text-sm mb-5">
                Enter your detils to login into your account
            </div>
            <form autoComplete="off" className="space-y-4">
                <input className="border rounded-md py-2 px-4 w-full"
                    type="email" 
                    id="email" 
                    placeholder="Email"
                    onTouchStart={(e) => e.preventDefault()}
                />
                <input className="border rounded-md py-2 px-4 w-full"
                    type="password"
                    id="password"
                    placeholder="Password"
                    onTouchStart={(e) => e.preventDefault()}
                />
                <div className="text-sm text-gray-500 font-medium text-right cursor-pointer" onClick={triggerForgotPasswordEmail}>
                    Forgot Password?
                </div>
                <button 
                    onClick={handleLogin}
                    className="button">
                    Login
                </button>
                <div className="text-sm text-gray-600">
                    Dont have an account?  
                    <a href="/signup" className="text-blue-700">
                        Create New 
                    </a>
                </div>
            </form>
        </div>
    )
}

export default Login