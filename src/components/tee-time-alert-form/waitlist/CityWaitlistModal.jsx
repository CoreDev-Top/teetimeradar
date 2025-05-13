import React, { useRef, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

const CityWaitlistModal = () => {
    // creating function to load ip address from the API
    const closeRef = useRef(null)

    const [city, setCity] = useState('')
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const cityRef = useRef(null)

    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const HandleSubmit = async () => {
        if (!nameRef?.current?.value || !emailRef?.current?.value || !city) {
            setSubmitError('Please fill all fields!')
            return
        }
        setSubmitError('')
        setSubmitLoading(true)

        try {
            const token = localStorage.getItem('jwt')
                ? localStorage.getItem('jwt')
                : ''

            const response = await fetch(
                `${global.SERVER_HOST}/api/waitlist_submission`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name: nameRef?.current?.value,
                        email: emailRef?.current?.value,
                        waitlist_type: 'city',
                        waitlist_item: city,
                        submission_date: new Date().toISOString(),
                    }),
                    headers: {
                        'content-type': 'application/json; charset=UTF-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Network response was not ok')
            } else {
                closeRef?.current.click()
            }

            setSubmitLoading(false)
        } catch (e) {
            setSubmitError(e.message)
            setSubmitLoading(false)
            console.error(e.message)
        }
    }
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

    useEffect(() => {
        if (cityRef?.current?.value === 'Other') {
            setCity('')
        }
    }, [cityRef?.current?.value])

    return (
        <div>
            <div
                className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="cityWaitlistModal"
                tabIndex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-hidden="true"
            >
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current w-fit m-auto">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4  border-gray-200 rounded-t-md absolute">
                            <button
                                type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-white border-none rounded-none  focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>

                        <div className="flex justify-center">
                            <div className="rounded-lg shadow-lg bg-white max-w-sm">
                                <img
                                    className="rounded-t-lg"
                                    src="https://teetimealerts.nyc3.cdn.digitaloceanspaces.com/SanDiegoCA.jpg"
                                    alt=""
                                />
                                <div className="p-6">
                                    <h5 className="text-gray-900 text-3xl font-medium mb-4">
                                        Don&lsquo;t see your city?
                                    </h5>
                                    <p className="text-gray-700 text-base mb-8">
                                        Excited about our service? Help us get
                                        to you faster by joining your
                                        city&lsquo;s waitlist!
                                    </p>
                                    <div className="form-group mb-6">
                                        <input
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="exampleInput126"
                                            placeholder="Name"
                                            ref={nameRef}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <input
                                            type="email"
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="exampleInput125"
                                            placeholder="Email address"
                                            ref={emailRef}
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
                                                            fontFamily:
                                                                'Urbanist',
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
                                    {submitError && (
                                        <p className="text-red-500 text-sm text-center mb-4">
                                            {submitError}
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={HandleSubmit}
                                        style={{
                                            pointerEvents:
                                                submitLoading && 'none',
                                            opacity: submitLoading
                                                ? '0.5'
                                                : '1',
                                        }}
                                        className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        ref={closeRef}
                                        className="px-6 py-2.5 mx-4 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out opacity-80"
                                        data-bs-dismiss="modal"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CityWaitlistModal
