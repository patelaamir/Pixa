import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        console.log(email, password)
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
            navigate("/")
        }).catch((error) => {
            const errorCode = error.code;
        });
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
                    className="py-2 px-4 rounded-md font-semibold text-orange-900 bg-orange-400">
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login