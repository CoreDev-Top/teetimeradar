import React, { useRef, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { AiOutlinePlus } from 'react-icons/ai'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import biggestCities from '../../../constants/biggest-cities'
import useAuth from '../../../hooks/useAuth'

const CourseWaitlistModal = ({ ShowNotification }) => {
    const nameRef = useRef(null)
    const emailRef = useRef(null)

    const [courses, setCourses] = useState([{ courseName: '', courseCity: '' }])

    const handleCityChange = (index, newCity) => {
        const newCourses = [...courses]
        newCourses[index].courseCity = newCity
        setCourses(newCourses)
    }
    const handleNameChange = (index, newName) => {
        const newCourses = [...courses]
        newCourses[index].courseName = newName
        setCourses(newCourses)
    }

    const addCourse = () => {
        setCourses([...courses, { courseName: '', courseCity: '' }])
    }

    const deleteCourse = (index) => {
        const newCourses = [...courses]
        newCourses.splice(index, 1)
        setCourses(newCourses)
    }

    const closeRef = useRef(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const { userData, loading } = useAuth()
    const HandleSubmit = async () => {
        const name = userData?.email
            ? `${userData?.firstName ?? ''} ${userData?.lastName ?? ''}`
            : nameRef?.current?.value ?? ''
        const email = userData?.email
            ? userData.email
            : emailRef?.current?.value ?? ''

        if (
            !name ||
            !email ||
            courses.some((course) => !course.courseName || !course.courseCity)
        ) {
            setSubmitError('Please fill in all the required fields!')
            return
        }

        setSubmitError('')
        setSubmitLoading(true)

        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''

        const submissionPromises = courses.map((course) =>
            fetch(`${global.SERVER_HOST}/api/waitlist_submission`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    waitlist_type: 'course',
                    waitlist_item: course.courseName,
                    submission_date: new Date().toISOString(),
                    extra_details: { city: course.courseCity },
                }),
                headers: {
                    'content-type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${token}`,
                },
            })
        )

        try {
            await Promise.all(submissionPromises)

            if (ShowNotification)
                ShowNotification(
                    'Success! All courses have been added to the waitlist!',
                    'success'
                )
            closeRef?.current.click()
            if (nameRef?.current) nameRef.current.value = ''
            /// emailRef.current.value = ''
            if (emailRef?.current) emailRef.current.value = ''
            setCourses([{ courseName: '', courseCity: '' }])
        } catch (e) {
            console.error(e)
            setSubmitError(
                'An error occurred while submitting one or more courses.'
            )
        } finally {
            setSubmitLoading(false)
        }
    }
    return (
        <div>
            <div
                className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="courseWaitlistModal"
                tabIndex="-1"
                data-bs-backdrop="static"
                aria-hidden="true"
            >
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current w-fit m-auto">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4  border-gray-200 rounded-t-md absolute">
                            <button
                                className="btn-close w-4 h-4 p-1 text-white border-none rounded-none  focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="flex justify-center">
                            {loading ? (
                                // Render the skeleton loader when loading is true
                                <div className="skeleton-loader" />
                            ) : (
                                <div className="rounded-lg shadow-lg bg-white max-w-sm">
                                    <img
                                        className="rounded-t-lg"
                                        src="https://www.maderasgolf.com/wp-content/uploads/2021/09/golf-bg-scaled-1.jpg"
                                        alt=""
                                    />
                                    <div className="p-6">
                                        <h5 className="text-gray-900 text-3xl font-medium mb-4">
                                            Don&lsquo;t see your favorite
                                            course?{' '}
                                        </h5>
                                        <p className="text-gray-700 text-base mb-8">
                                            Add it to the waitlist. We regularly
                                            update our courses based on user
                                            demand!{' '}
                                        </p>
                                        {!userData?.email && (
                                            <div className="form-group mb-6">
                                                <input
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                    id="exampleInput126"
                                                    placeholder="Name"
                                                    ref={nameRef}
                                                />
                                            </div>
                                        )}
                                        {!userData?.email && (
                                            <div className="form-group mb-6">
                                                <input
                                                    type="email"
                                                    ref={emailRef}
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                    id="exampleInput125"
                                                    placeholder="Email address"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <div>
                                                {courses.map(
                                                    (course, index) => (
                                                        <div
                                                            key={index}
                                                            className="course-entry mb-4 p-4 bg-white shadow-md rounded"
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        courses.length >
                                                                        1
                                                                    )
                                                                        deleteCourse(
                                                                            index
                                                                        )
                                                                }}
                                                                style={{
                                                                    display:
                                                                        index ===
                                                                        0
                                                                            ? 'none'
                                                                            : '',
                                                                }}
                                                                className="mb-3 bg-gray-100 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 text-gray-600 font-semibold rounded-lg text-sm p-2 text-center transition duration-300 ease-in-out flex items-center justify-center"
                                                            >
                                                                <MdClose />
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    course.courseName
                                                                }
                                                                onChange={(e) =>
                                                                    handleNameChange(
                                                                        index,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="form-control mb-4 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                                id={`exampleInputName-${index}`}
                                                                placeholder="Course Name"
                                                            />
                                                            <Autocomplete
                                                                disablePortal
                                                                freeSolo
                                                                id={`combo-box-demo-${index}`}
                                                                options={
                                                                    biggestCities
                                                                }
                                                                inputValue={
                                                                    course.courseCity
                                                                }
                                                                onInputChange={(
                                                                    event,
                                                                    newInputValue
                                                                ) => {
                                                                    handleCityChange(
                                                                        index,
                                                                        newInputValue
                                                                    )
                                                                }}
                                                                InputProps={{
                                                                    sx: {
                                                                        height: 40,
                                                                        fontFamily:
                                                                            'Urbanist',
                                                                    },
                                                                }}
                                                                style={{
                                                                    width: '500px',
                                                                    maxWidth:
                                                                        '100%',
                                                                    fontFamily:
                                                                        'Urbanist',
                                                                    fontSize:
                                                                        '10px',
                                                                }}
                                                                // sx={{ height: 10, padding: 0 }}
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={
                                                                            course.courseCity
                                                                                ? ' '
                                                                                : 'City'
                                                                        }
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                            style: {
                                                                                color: '#9ca3af',
                                                                                fontSize:
                                                                                    '15px',
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
                                                                            fontFamily:
                                                                                'Urbanist',
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )
                                                )}
                                                <button
                                                    onClick={addCourse}
                                                    className="my-3 mb-12 w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out"
                                                >
                                                    <AiOutlinePlus className="mr-2" />{' '}
                                                    Add Course
                                                </button>
                                            </div>
                                        </div>
                                        {submitError && (
                                            <p className="text-red-500 text-sm text-center mb-4">
                                                {submitError}
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                HandleSubmit()
                                            }}
                                            className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out" /* data-bs-dismiss="modal" */
                                            style={{
                                                pointerEvents:
                                                    submitLoading && 'none',
                                                opacity: submitLoading
                                                    ? '0.5'
                                                    : '1',
                                            }}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseWaitlistModal
