import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import { NavLink } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import axios from './api/axios';

import './Register.css';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/user/connect", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                username: user,
                password: pwd
                }),
                withCredentials: true
            });
            /*
            const response = await axios.post("http://localhost:3000/api/user/connect",
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );*/
            const responseData = await response.json(); // Wait for the JSON Promise to resolve
            console.log("response data:", responseData);
            /*
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            */
            if (response.ok && responseData.jwtToken && responseData.userId) {
                // Storing the JWT and username in session storage
                sessionStorage.setItem('accessToken', responseData.jwtToken);
                sessionStorage.setItem('userId', responseData.userId);
    
                setUser('');
                setPwd('');
                setSuccess(true);
            } else {
                throw new Error('Login Failed');
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return  (
        <>
            {success ? (
                <Navigate to="/" replace /> // Redirect to the HomePage
            ) : (
                <section className="user-section">
                    <p ref={errRef} className={errMsg ? "user-errmsg" : "user-offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className="user-title">Sign In</h1>
                    <form onSubmit={handleSubmit} className="user-form">
                        <label htmlFor="username" className="user-label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            className="user-input"
                        />

                        <label htmlFor ="password" className="user-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            className="user-input"
                        />
                        <button className="user-button">Sign In</button>
                    </form>
                    <p className="user-account-query">
                        Need an Account?<br />
                        <span className="user-line">
                            <NavLink to="/register">Sign Up</NavLink>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login