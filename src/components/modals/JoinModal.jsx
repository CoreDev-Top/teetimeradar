import React, { useState, useEffect, useRef } from 'react'
import * as yup from 'yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import 'yup-phone'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import useAuth from '../../hooks/useAuth'
import { auth } from '../../firebase-config'

const biggestCities = [
    'Scottsdale, AZ',
    'Orlando, FL',
    'Cincinnati, OH',
    'Las Vegas, NV',
    'San Francisco, CA',
    'Winston-Salem, NC',
    'Los Angeles, CA',
    'Savannah, GA',
    'Augusta, GA',
    'Rochester, NY',
    'San Antonio, TX',
    'Toledo, OH',
    'Atlanta, GA',
    'Birmingham, AL',
    'Tucson, AZ',
    'Pasadena, CA',
    'Houston, TX',
    'Tulsa, OK',
    'Durham, NC',
    'Corona, CA',
    'Phoenix, AZ',
    'Henderson, NV',
    'Charleston, SC',
    'Dallas, TX',
    'Escondido, CA',
    'Lexington, KY',
    'Chandler, AZ',
    'Port St. Lucie, FL',
    'Hollywood, FL',
    'Charlotte, NC',
    'Surprise, AZ',
    'Austin, TX',
    'Frisco, TX',
    'Louisville, KY',
    'Peoria, AZ',
    'Irvine, CA',
    'Alexandria, VA',
    'Carrollton, TX',
    'Knoxville, TN',
    'Virginia Beach, VA',
    'Fullerton, CA',
    'Ontario, CA',
    'Grand Rapids, MI',
    'Roseville, CA',
    'Spokane, WA',
    'Lubbock, TX',
    'Akron, OH',
    'Tampa, FL',
    'Fort Wayne, IN',
    'Salt Lake City, UT',
    'Thornton, CO',
    'Pomona, CA',
    'Chula Vista, CA',
    'Springfield, MO',
    'Kansas City, MO',
    'Lincoln, NE',
    'McKinney, TX',
    'Overland Park, KS',
    'Rockford, IL',
    'Oceanside, CA',
    'Riverside, CA',
    'Reno, NV',
    'San Diego, CA',
    'New York, NY',
    'Indianapolis, IN',
    'Hayward, CA',
    'Olathe, KS',
    'St. Louis, MO',
    'Anaheim, CA',
    'Mesa, AZ',
    'Greensboro, NC',
    'Irving, TX',
    'Santa Rosa, CA',
    'Yonkers, NY',
    'Santa Ana, CA',
    'Fontana, CA',
    'Fort Worth, TX',
    'Miami, FL',
    'Pembroke Pines, FL',
    'Huntington Beach, CA',
    'Murfreesboro, TN',
    'Sioux Falls, SD',
    'Boise City, ID',
    'Arlington, TX',
    'Aurora, CO',
    'Kansas City, KS',
    'Montgomery, AL',
    'Richmond, VA',
    'Long Beach, CA',
    'Tacoma, WA',
    'Jacksonville, FL',
    'Plano, TX',
    'Albuquerque, NM',
    'Aurora, IL',
    'Oxnard, CA',
    'Boston, MA',
    'Oklahoma City, OK',
    'Chesapeake, VA',
    'Columbus, OH',
    'Grand Prairie, TX',
    'Springfield, MA',
    'Colorado Springs, CO',
    'Glendale, AZ',
    'Mobile, AL',
    'Mesquite, TX',
    'Raleigh, NC',
    'Killeen, TX',
    'Madison, WI',
    'Amarillo, TX',
    'Jackson, MS',
    'Macon, GA',
    'Waco, TX',
    'Tempe, AZ',
    'Naperville, IL',
    'Dayton, OH',
    'San Bernardino, CA',
    'Newark, NJ',
    'Stockton, CA',
    'Chattanooga, TN',
    'Tallahassee, FL',
    'Eugene, OR',
    'Palmdale, CA',
    'Pittsburgh, PA',
    'Omaha, NE',
    'Bakersfield, CA',
    'Des Moines, IA',
    'New Orleans, LA',
    'Moreno Valley, CA',
    'St. Paul, MN',
    'Fort Collins, CO',
    'Midland, TX',
    'North Las Vegas, NV',
    'Jersey City, NJ',
    'Shreveport, LA',
    'Salinas, CA',
    'Norfolk, VA',
    'Joliet, IL',
    'Newport News, VA',
    'Glendale, CA',
    'Fayetteville, NC',
    'Hialeah, FL',
    'Wichita, KS',
    'Little Rock, AR',
    'Memphis, TN',
    'St. Petersburg, FL',
    'Garland, TX',
    'Minneapolis, MN',
    'Philadelphia, PA',
    'Portland, OR',
    'Syracuse, NY',
    'Corpus Christi, TX',
    'Rancho Cucamonga, CA',
    'Clarksville, TN',
    'El Paso, TX',
    'McAllen, TX',
    'Cape Coral, FL',
    'Sacramento, CA',
    'Bellevue, WA',
    'Baton Rouge, LA',
    'Chicago, IL',
    'Salem, OR',
    'Denver, CO',
    'San Jose, CA',
    'Oakland, CA',
    'Detroit, MI',
    'Brownsville, TX',
    'Fresno, CA',
    'Nashville, TN',
    'Worcester, MA',
    'Providence, RI',
    'Sunnyvale, CA',
    'Washington, DC',
    'Lakewood, CO',
    'Seattle, WA',
    'Laredo, TX',
    'Torrance, CA',
    'Vancouver, WA',
    'Elk Grove, CA',
    'Baltimore, MD',
    'Columbus, GA',
    'Huntsville, AL',
    'Fort Lauderdale, FL',
    'Milwaukee, WI',
    'Hampton, VA',
    'Modesto, CA',
    'Denton, TX',
    'Buffalo, NY',
    'Anchorage, AK',
    'Cleveland, OH',
    'Lancaster, CA',
    'West Valley City, UT',
    'Fremont, CA',
    'Garden Grove, CA',
    'Orange, CA',
    'Paterson, NJ',
    'Santa Clarita, CA',
    'Miramar, FL',
    'Warren, MI',
    'Bridgeport, CT',
    'Pasadena, TX',
]

const JoinModal = ({ joinModalOpenRef, loginModalOpenRef }) => {
    const { setUserData } = useAuth()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const userSchema = yup.object().shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().email().required('Email is required'),
        city: yup.string().required('City is required'),
        phoneNumber: yup
            .string()
            .matches(/^[0-9]{10}$/, 'Please enter a valid phone number')
            .required('Phone number is required'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    })

    const [joinLoading, setJoinLoading] = useState(false)
    const HandleJoin = async () => {
        setJoinLoading(true)

        const user = {
            firstName,
            lastName,
            email,
            city,
            phoneNumber,
            password,
            rememberMe,
        }

        // console.log(user)

        const isValid = await userSchema
            .validate(user)
            .catch((err) => setErrorMessage(err.errors[0]))

        if (!isValid) {
            setJoinLoading(false)
            return
        }
        setErrorMessage('')

        console.log('user is valid, creating account...')

        // add user to firebase
        try {
            const response = await fetch(
                `${global.SERVER_HOST}/api/golfer/new`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        golfer_first_name: firstName,
                        golfer_last_name: lastName,
                        golfer_email: email,
                        golfer_phone: phoneNumber,
                        golfer_city: city,
                        golfer_password: password,
                    }),
                }
            )

            if (!response.ok) {
                throw await response.json() // Throw the error response as an exception
            }

            const data = await response.json()
            console.log('User created:', data.golfer)

            // Add the track event with the uid from the server response
            if (!global.DEV)
                window.fbq(
                    'track',
                    'CompleteRegistration',
                    {},
                    { eventID: data.uid }
                )

            const signInUserResponse = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            console.log(`${signInUserResponse.user.uid}  logged in `)
            localStorage.setItem('isUserLoggedIn', JSON.stringify(true))
            setUserData(data.golfer)

            joinModalOpenRef.current.click()

            // after login, do something
        } catch (error) {
            console.log(error.message)
            setJoinLoading(false)

            // Check if the response includes an error message
            setErrorMessage(error.message)
        } finally {
            setJoinLoading(false)
        }
    }

    const cityRef = useRef(null)
    useEffect(() => {
        if (cityRef?.current?.value === 'Other') {
            setCity('')
        }
    }, [cityRef?.current?.value])

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            <button
                type="button"
                className="btn btn-primary hidden "
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                ref={joinModalOpenRef}
            >
                OPEN MODAL{' '}
            </button>

            <div
                className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="exampleModal2"
                tabIndex="-1"
                aria-labelledby="exampleModal2Label"
                aria-hidden="true"
            >
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current p-10">
                        <div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                                    Sign up
                                </h1>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group mb-6">
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="exampleInput123"
                                            aria-describedby="emailHelp123"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="exampleInput124"
                                            aria-describedby="emailHelp124"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-6">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleInput125"
                                        placeholder="Email address"
                                    />
                                </div>

                                <div className="form-group mb-6 flex items-center">
                                    <Autocomplete
                                        disablePortal
                                        freeSolo
                                        id="combo-box-demo"
                                        options={biggestCities}
                                        inputValue={city}
                                        onInputChange={(
                                            event,
                                            newInputValue
                                        ) => {
                                            setCity(newInputValue)
                                        }}
                                        InputProps={{
                                            sx: {
                                                height: 40,
                                                fontFamily: 'Urbanist',
                                            },
                                        }}
                                        style={{
                                            width: '500px',
                                            maxWidth: '100%',
                                            fontFamily: 'Urbanist',
                                            fontSize: '10px',
                                        }}
                                        // sx={{ height: 10, padding: 0 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={city ? ' ' : 'City'}
                                                InputLabelProps={{
                                                    shrink: false,
                                                    style: {
                                                        color: '#9ca3af',
                                                        fontSize: '15px',
                                                        fontFamily: 'Urbanist',
                                                    },
                                                }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: {
                                                        fontFamily:
                                                            'Urbanist !important',
                                                    },
                                                }}
                                                size="small"
                                                style={{
                                                    fontFamily: 'Urbanist',
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group mb-6 flex items-center">
                                    <div className="mr-2 text-gray-500">+1</div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(
                                                e.target.value?.replace(
                                                    /[^0-9]/g,
                                                    ''
                                                )
                                            )
                                        }
                                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="exampleInput125"
                                        placeholder="Phone Number"
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
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
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
                                            {!showPassword ? (
                                                <FiEyeOff />
                                            ) : (
                                                <FiEye />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group form-check text-left mb-6">
                                    <input
                                        type="checkbox"
                                        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer"
                                        id="exampleCheck25"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                    />
                                    <label
                                        className="form-check-label inline-block text-gray-800 text-left"
                                        htmlFor="exampleCheck25"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <p className="text-red-500 text-xs text-center mb-1">
                                    {errorMessage}
                                </p>
                                <button
                                    style={{
                                        opacity: joinLoading ? '0.5' : '1',
                                    }}
                                    onClick={() => {
                                        HandleJoin()
                                    }}
                                    className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                >
                                    Sign up
                                </button>
                                <p className="text-gray-800 mt-6 text-center">
                                    Already a member?{' '}
                                    <a
                                        className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out cursor-pointer"
                                        onClick={() => {
                                            loginModalOpenRef?.current?.click()
                                        }}
                                    >
                                        Login
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinModal
