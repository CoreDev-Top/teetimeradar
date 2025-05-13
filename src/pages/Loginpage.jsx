import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase-config'
import useAuth from '../hooks/useAuth'
import Navbar from '../components/landing-page/Navbar'

const LoginPage = () => {
    const navigate = useNavigate()

    const { userData, loading } = useAuth()

    useEffect(() => {
        if (!loading && userData) {
            navigate('/user')
        }
    }, [loading, userData, navigate])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const schema = yup.object().shape({
        email: yup.string().email().required('Email is required'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    })

    const [loginLoading, setLoginLoading] = useState(false)
    const HandleLogin = async () => {
        setLoginLoading(true)
        const user = {
            email,
            password,
            rememberMe,
        }

        const isValid = await schema
            .validate(user)
            .catch((err) => setErrorMessage(err.errors[0]))

        if (!isValid) {
            setLoginLoading(false)
            return
        }
        setErrorMessage('')

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/user')
        } catch (error) {
            console.error(error.message)
            if (error.message === 'Firebase: Error (auth/user-not-found).') {
                setErrorMessage('User not found')
            }
            if (error.message === 'Firebase: Error (auth/invalid-email).') {
                setErrorMessage('Please re-check the e-mail')
            }
            if (error.message === 'Firebase: Error (auth/wrong-password).') {
                setErrorMessage('Wrong password')
            }
            if (
                error.message ===
                'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).'
            ) {
                setErrorMessage(
                    'Access to this account is temporarily disabled'
                )
            }
        } finally {
            setLoginLoading(false)
        }
    }

    const [resetEmail, setResetEmail] = useState('')
    const [resetMessage, setResetMessage] = useState('')
    const [isResetting, setIsResetting] = useState(false)
    const HandlePasswordReset = async () => {
        if (!resetEmail) {
            setResetMessage('Please enter your email address.')
            return
        }

        setIsResetting(true)
        try {
            await sendPasswordResetEmail(auth, resetEmail)
            setResetMessage(
                'Password reset email sent. Please check your inbox.'
            )
        } catch (error) {
            console.error('Error sending password reset email:', error)
            setResetMessage(
                `Error sending password reset email. Please try again later. (${error.message})`
            )
        } finally {
            setIsResetting(false)
        }
    }
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            <Navbar loggedIn={userData} />

            {/* <div className=" bg-gray-900 text-white py-8 px-4 sm:px-10">
                <div
                    className="flex flex-col sm:flex-row items-center justify-between"
                    style={{
                        width: '90%',
                        maxWidth: '700px',
                        margin: 'auto',
                    }}
                >
                    <div className="sm:mr-8 mb-4 sm:mb-0 max-w-lg text-center sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            Cyber Week Sale
                        </h2>
                        <p className="text-lg sm:text-xl">
                            Get{' '}
                            <span className="text-green-300 font-bold">
                                20% OFF
                            </span>{' '}
                            on an annual subscription
                        </p>
                    </div>
                    <button
                        className="text-navy-900 bg-blue-600 hover:bg-green-700 font-bold py-3 px-8 rounded-lg transition ease-in duration-200 text-lg"
                        onClick={() => {
                            navigate('/pricing')
                        }}
                    >
                        Subscribe Now
                    </button>
                </div>
            </div> */}

            <div className="LoginForm" style={{ height: '100vh' }}>
                <div
                    className="block p-6 rounded-lg shadow-lg bg-white max-w-sm m-auto w-[90%] mt-[75px] transition ease-in"
                    style={{
                        opacity: loginLoading || loading ? '0.5' : '1',
                        pointerEvents:
                            loginLoading || loading ? 'none' : 'auto',
                    }}
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                            Login
                        </h1>

                        <div className="form-group mb-6">
                            <label
                                htmlFor="exampleInputEmail2"
                                className="form-label inline-block mb-2 text-gray-700"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInputEmail2"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label
                                htmlFor="exampleInputPassword2"
                                className="form-label inline-block mb-2 text-gray-700"
                            >
                                Password
                            </label>
                            <div
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="exampleInputPassword2"
                                    placeholder="Password"
                                    style={{ paddingRight: '30px' }}
                                />
                                <div
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: 'absolute',
                                        right: '0px',
                                        cursor: 'pointer',
                                        paddingInline: '20px',
                                        color: 'grey',
                                    }}
                                >
                                    {!showPassword ? <FiEyeOff /> : <FiEye />}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="form-group form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                    id="exampleCheck2"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                                <label
                                    className="form-check-label inline-block text-gray-800"
                                    htmlFor="exampleCheck2"
                                >
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="#!"
                                className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal5"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <p className="text-red-500 text-xs text-center mb-1">
                            {errorMessage}
                        </p>
                        <button
                            style={{
                                opacity: loginLoading || loading ? '0.5' : '1',
                                pointerEvents:
                                    loginLoading || loading ? 'none' : 'auto',
                            }}
                            onClick={() => HandleLogin()}
                            className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        >
                            Sign in
                        </button>
                        <p className="text-gray-800 mt-6 text-center">
                            Not a member?{' '}
                            <a
                                href="#!"
                                className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
                                onClick={() => {
                                    navigate('/join')
                                }}
                            >
                                Register
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div
                className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="exampleModal5"
                tabIndex="-1"
                aria-labelledby="exampleModal5Label"
                aria-hidden="true"
            >
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current p-10">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                                Reset your password
                            </h1>

                            <div className="form-group mb-6">
                                <label
                                    htmlFor="exampleInputEmail2"
                                    className="form-label inline-block mb-2 text-gray-700"
                                >
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) =>
                                        setResetEmail(e.target.value)
                                    }
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="exampleInputEmail2"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                />
                            </div>

                            <p className="text-gray-800 text-xs text-center mb-1">
                                {resetMessage}
                            </p>
                            <button
                                style={{ opacity: isResetting ? '0.5' : '1' }}
                                onClick={() => HandlePasswordReset()}
                                className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
