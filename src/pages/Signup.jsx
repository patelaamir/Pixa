import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from 'react'
import useScreenSize from "../utils/screenSize";

function Signup() {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth);
    const screenSize = useScreenSize()

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.keyCode === 13) {
                handleSignup(event);
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

    const handleSignup = (e) => {
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        let fullName = document.getElementById("fullName").value

        if (!email || !password || !fullName) {
            alert("Please enter your Full Name, Email and Password")
        }

        createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            const user = userCredentials.user
            createUserProfile(email)
        }).catch((error) => {
            console.log(error.code)
        })
    }

    const createUserProfile = async(email) => {
        let fullName = document.getElementById("fullName").value
        let username = createUsername(email)
        let profile = {
            fullName: fullName,
            username: username,
            email: email,
            private: true
        }
        await setDoc(doc(db, "userProfile", email), profile);
        localStorage.setItem("profile", JSON.stringify(profile))
        navigate("/")
    }

    const createUsername = (email) => {
        return email.split("@")[0]
    }

    return (
        <div className={`flex flex-col mx-auto text-center shadow-xl rounded-lg mt-20 p-5 ${screenSize.width < 640 ? 'w-full' : 'w-1/4'}`}>
            <div className="font-semibold text-xl mb-2">
                Sign Up
            </div>
            <div className="text-sm mb-5">
                Hey, Enter your details to create your account
            </div>

            <div className="space-y-4">
                <input 
                    className="border rounded-md py-2 px-4 w-full" 
                    id="fullName" 
                    placeholder="Full Name"/>
                     onFocus={(e) => e.target.setAttribute("autocomplete", "off")}

                <input 
                    className="border rounded-md py-2 px-4 w-full" 
                    type="email" 
                    id="email" 
                    placeholder="Email" />
                     onFocus={(e) => e.target.setAttribute("autocomplete", "off")}

                <input 
                    className="border rounded-md py-2 px-4 w-full" 
                    type="password" 
                    id="password" 
                    placeholder="Password" /> 
                     onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
                <button
                    onClick={handleSignup}
                    className="button">
                    Sign Up
                </button>
                <div className="text-sm text-gray-600">
                    Already have an account? 
                <a href="/login" className="text-blue-700"> Log In </a>
                </div>


            </div>
        </div>
    )
}

export default Signup