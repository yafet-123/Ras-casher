import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useRef, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import Cookies from 'universal-cookie';
import Image from "next/image"
import {useAuth} from './context/AuthContext'
import api from './components/api.js'

export default function Login() {
    // we will create the context
    const router = useRouter()
    const {currentUser} = useAuth()
    const [error ,seterror] = useState("")
    useEffect(()=>{
        if(currentUser){
            router.push('/')
        }
    },[currentUser, router])
    const cookies = new Cookies();
    const userRef = useRef(); // to set the focus in the first input when the component first load
    const errRef = useRef(); // to set the focus on the error specially for screen reader
    // in the first input we put the userRef and errmsg in the second
    // useRef returns a mutable ref object whose .current property is initialized to the passed argument 
    // (initialValue). The returned object will persist for the full lifetime of the component.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError,setLoginError] = useState('')
    const [isLoginStarted, setIsLoginStarted] = useState(false)
    // we have two useEffect the first used to set useRef to the first input when it is first load
    useEffect(() => {
        userRef.current.focus();
    }, [])
    // the second is to set the error to null when ever the user input new username and password or 
    // change the username and password

    useEffect(() => {
      if (router.query.error) {
        setLoginError(router.query.error)
        setUsername(router.query.username)
      }
    }, [router])
    const handleLogin = async (e) => {
        e.preventDefault()
        await axios.post(`${api}/auth/login`,
            {
              password: password,
              username: username 
            }).then(function (response) {
                cookies.set('token', response.data.token, { path: '/' });
                cookies.set('user', response.data.user,{path:'/'})
                cookies.set('role', response.data.role,{path:'/'})
                router.push('/')
            }).catch(function (error) {
                seterror('Invalid Username or Password')
            });
    }
    return (
        <div className="w-100 h-100 bg-light">
            <form onSubmit={handleLogin} className="position-absolute top-50 start-50 translate-middle border rounded px-5 pt-2 pb-5">
                <Image
                            alt="Mountains"
                            src="/images/logo.png"
                            width = {320}
                            height= {200}
                            className="mx-auto"
                            quality={100}
                        />
                <p className="text-danger fs-5">{error}</p>
                <FloatingLabel controlId="floatingInput" label="Username" className="my-3">
                    <Form.Control 
                        type="text" 
                        ref={userRef}
                        placeholder="username"
                        required 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </FloatingLabel>
            
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        value={password}
                    />
                </FloatingLabel>
                <button type="submit" className="btn btn-primary mt-3 w-100">Login</button>
            </form>
        </div>
    );
}
