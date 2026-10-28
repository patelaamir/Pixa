import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from 'react'
import useScreenSize from "../utils/screenSize";

function Signup() {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth);
    const screenSize = useScreenSize()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            navigate("/")
        }
    }, [user, loading, navigate])

    const handleSignup = async (e) => {
        if (e) e.preventDefault()
        setErrorMsg("")

        const cleanEmail = email.trim()
        const cleanPassword = password.trim()
        const cleanFullName = fullName.trim()

        if (!cleanEmail || !cleanPassword || !cleanFullName) {
            setErrorMsg("Please enter your Full Name, Email, and Password.")
            return
        }

        if (cleanPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.")
            return
        }

        try {
            setIsSubmitting(true)
            const userCredentials = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword)
            const createdUser = userCredentials.user
            await createUserProfile(createdUser, cleanFullName)
        } catch (error) {
            console.error("Signup error:", error)
            let msg = "Failed to sign up. Please try again."
            if (error.code === "auth/email-already-in-use") {
                msg = "This email is already registered. Please log in instead."
            } else if (error.code === "auth/invalid-email") {
                msg = "Please enter a valid email address."
            } else if (error.code === "auth/weak-password") {
                msg = "Password is too weak. Please use at least 6 characters."
            } else if (error.code === "auth/operation-not-allowed") {
                msg = "Email/Password sign-up is not enabled in Firebase Console."
            } else if (error.message) {
                msg = error.message
            }
            setErrorMsg(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    const createUserProfile = async (createdUser, name) => {
        const username = createUsername(createdUser.email)
        const profile = {
            fullName: name,
            username: username,
            email: createdUser.email,
            image: "",
            bio: "",
            private: false
        }
        await setDoc(doc(db, "userProfile", createdUser.email), profile)
        localStorage.setItem("profile", JSON.stringify(profile))
        navigate("/")
    }

    const createUsername = (userEmail) => {
        return userEmail.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9_]/g, "")
    }

    return (
        <div className={`flex flex-col mx-auto text-center shadow-xl rounded-lg mt-20 p-5 ${screenSize.width < 640 ? 'w-full' : 'w-1/4'}`}>
            <div className="font-semibold text-xl mb-2">
                Sign Up
            </div>
            <div className="text-sm mb-5 text-gray-600">
                Hey, enter your details to create your account
            </div>

            {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-2 rounded-md mb-3">
                    {errorMsg}
                </div>
            )}

            <form className="space-y-4" autoComplete="off" onSubmit={handleSignup}>
                <input 
                    className="border rounded-md py-2 px-4 w-full" 
                    id="fullName" 
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

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
                    placeholder="Password (min 6 characters)" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button w-full disabled:opacity-50">
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
                <div className="text-sm text-gray-600">
                    Already have an account? 
                    <Link to="/login" className="text-blue-700 ml-1"> Log In </Link>
                </div>
            </form>
        </div>
    )
}

export default Signup