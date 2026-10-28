import { auth, db } from "../firebase"
import { query, collection, where, getDocs } from "firebase/firestore"
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from 'react'
import useScreenSize from "../utils/screenSize";

function Login () {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth);
    const screenSize = useScreenSize()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            navigate("/")
        }
    }, [user, loading, navigate])

    const handleLogin = async (e) => {
        if (e) e.preventDefault()
        setErrorMsg("")
        setSuccessMsg("")

        const cleanEmail = email.trim()
        const cleanPassword = password.trim()

        if (!cleanEmail || !cleanPassword) {
            setErrorMsg("Please enter your Email and Password.")
            return
        }

        try {
            setIsSubmitting(true)
            const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword)
            const currentUser = userCredential.user
            await getUserProfile(currentUser)
        } catch (error) {
            console.error("Login error:", error)
            let msg = "Invalid email or password."
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                msg = "Invalid email or password. Please try again."
            } else if (error.code === "auth/invalid-email") {
                msg = "Please enter a valid email address."
            } else if (error.code === "auth/too-many-requests") {
                msg = "Too many failed attempts. Please reset your password or try again later."
            } else if (error.message) {
                msg = error.message
            }
            setErrorMsg(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getUserProfile = async (currentUser) => {
        try {
            const q = query(collection(db, "userProfile"), where("email", "==", currentUser.email))
            const querySnapshot = await getDocs(q)
            
            let profile
            if (!querySnapshot.empty) {
                profile = querySnapshot.docs[0].data()
            } else {
                profile = {
                    email: currentUser.email,
                    username: currentUser.email.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9_]/g, ""),
                    fullName: currentUser.displayName || currentUser.email.split("@")[0],
                    image: "",
                    bio: "",
                    private: false
                }
            }
            localStorage.setItem("profile", JSON.stringify(profile))
            navigate("/")
        } catch (err) {
            console.error("Error fetching user profile:", err)
            const fallbackProfile = {
                email: currentUser.email,
                username: currentUser.email.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9_]/g, ""),
                fullName: currentUser.email.split("@")[0],
                image: "",
                bio: "",
                private: false
            }
            localStorage.setItem("profile", JSON.stringify(fallbackProfile))
            navigate("/")
        }
    }

    const triggerForgotPasswordEmail = async (e) => {
        if (e) e.preventDefault()
        setErrorMsg("")
        setSuccessMsg("")

        const cleanEmail = email.trim()
        if (!cleanEmail) {
            setErrorMsg("Please enter your email address in the Email field above first.")
            return
        }

        try {
            setIsResetting(true)
            await sendPasswordResetEmail(auth, cleanEmail)
            setSuccessMsg(`A password reset link has been sent to ${cleanEmail}. Check your inbox (and spam folder)!`)
        } catch (error) {
            console.error("Forgot password error:", error)
            let msg = "Failed to send password reset email."
            if (error.code === "auth/user-not-found") {
                msg = "No account found with this email address. Please sign up."
            } else if (error.code === "auth/invalid-email") {
                msg = "Please enter a valid email address."
            } else if (error.code === "auth/too-many-requests") {
                msg = "Too many requests. Please wait a few minutes before requesting another reset email."
            } else if (error.code === "auth/unauthorized-domain") {
                msg = "Firebase error: This domain is not authorized for OAuth/Email operations in Firebase Console."
            } else if (error.message) {
                msg = error.message
            }
            setErrorMsg(msg)
        } finally {
            setIsResetting(false)
        }
    }

    return (
        <div className={`flex flex-col mx-auto text-center shadow-xl rounded-lg mt-20 p-5 ${screenSize.width < 640 ? 'w-full' : 'w-1/4'}`}>
            <div className="font-semibold text-xl mb-2">
                Login
            </div>
            <div className="text-sm mb-5 text-gray-600">
                Enter your details to log in to your account
            </div>

            {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-2 rounded-md mb-3 text-left">
                    {errorMsg}
                </div>
            )}

            {successMsg && (
                <div className="bg-green-50 text-green-700 border border-green-200 text-sm p-2 rounded-md mb-3 text-left">
                    {successMsg}
                </div>
            )}

            <form autoComplete="off" className="space-y-4" onSubmit={handleLogin}>
                <input 
                    className="border rounded-md py-2 px-4 w-full"
                    type="email" 
                    id="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    className="border rounded-md py-2 px-4 w-full"
                    type="password" 
                    id="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="flex justify-end">
                    <button 
                        type="button"
                        disabled={isResetting}
                        className="text-sm text-gray-500 font-medium hover:underline cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
                        onClick={triggerForgotPasswordEmail}>
                        {isResetting ? "Sending reset email..." : "Forgot Password?"}
                    </button>
                </div>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="button w-full disabled:opacity-50">
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <div className="text-sm text-gray-600">
                    Don&apos;t have an account?  
                    <Link to="/signup" className="text-blue-700 ml-1">
                        Create New 
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Login