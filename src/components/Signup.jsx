import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate()

    const handleSignup = (e) => {
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        console.log(email, password)
        createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            const user = userCredentials.user
            console.log(user)
            createUserProfile(email)
            console.log(auth)
        }).catch((error) => {
            console.log(error.code)
        })
    }

    const createUserProfile = async(email) => {
        let fullName = document.getElementById("fullName").value
        let username = createUsername(email)

        await setDoc(doc(db, "userProfile", email), {
            fullName: fullName,
            username: username,
            email: email
        });

        navigate("/")
    }

    const createUsername = (email) => {
        return email.split("@")[0]
    }

    return (
        <div className="flex flex-col w-1/4 mx-auto text-center shadow-xl rounded-lg mt-20 p-5">
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

                <input 
                    className="border rounded-md py-2 px-4 w-full" 
                    type="email" 
                    id="email" 
                    placeholder="Email" />

                <input 
                    className="border rounded-md py-2 px-4 w-full" 
                    type="password" 
                    id="password" 
                    placeholder="Password" /> 
                <button
                    onClick={handleSignup}
                    className="py-2 px-4 rounded-md font-semibold text-orange-900 bg-orange-400">
                    Sign Up
                </button>


            </div>
        </div>
    )
}

export default Signup