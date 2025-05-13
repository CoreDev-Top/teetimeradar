import React, { useRef } from 'react'
import CreatableSelect from 'react-select/creatable'
import { components } from 'react-select'
import { Tooltip as ReactTooltip } from 'react-tooltip'
// import { FiInfo } from 'react-icons/fi'; // Assuming you're using react-icons

import { FaSearchLocation, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { customStyles } from './select-form-custom-styles'

const truncateString = (str, num) => {
    if (str.length <= num) {
        return str
    }
    return `${str.slice(0, num)}...`
}

const CustomMultiValueLabel = ({ innerProps, data }) => (
    <div {...innerProps} className="p-1">
        <div className="pl-1 flex items-center justify-between">
            <div className="flex items-center">
                <span className="text-sm font-semibold">
                    {truncateString(data.label, 40)}{' '}
                    {/* {data?.course_flagging_reason && <span className='opacity-50 text-xs' > ({data?.course_flagging_reason_tag})</span>} */}
                    {/* Truncate to 40 characters, adjust as needed */}
                </span>
            </div>
        </div>
    </div>
)

const CustomMenuList = ({ children, ...rest }) => (
    <components.MenuList {...rest}>{children}</components.MenuList>
)

const SearchCourses = ({
    zipCode,
    setZipCode,
    searchString,
    setSearchString,
    selectedTypeOfSearch,
    setSelectedTypeOfSearch,
    coursesOptions,
    selectedCourses,
    HandleGettingUserLocation,
    setSelectedCourses,
    preferences,
    searchingCoursesInProgress,
    gettingUserLocationInProgress,
    setPreferences,
}) => {
    const selectRef = useRef(null)
    const invisibleButtonRef = useRef(null)
    const simulateClickOnInvisibleModalButton = () => {
        // Check if the button ref is attached and has a current DOM element
        if (invisibleButtonRef.current) {
            // Stop any default action that might cause navigation or submission
            invisibleButtonRef.current.addEventListener(
                'click',
                (e) => e.preventDefault(),
                { once: true }
            )

            // Programmatically click the button
            invisibleButtonRef.current.click()
        }
    }

    const CustomMenu = ({ children, ...rest }) => (
        <components.Menu {...rest}>
            <div className="custom-scroll-area">{children}</div>
            <div className="sticky-waitlist-item">
                <button
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault()

                        console.log('yooo')
                        simulateClickOnInvisibleModalButton()
                    }}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1E90FF',
                        color: 'white',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'background-color 0.2s',
                        marginTop: '10px',
                    }}
                    data-bs-target="#courseWaitlistModal"
                    data-bs-toggle="modal"
                >
                    {`Don't see your favorite course? Request it now`}
                </button>
            </div>
        </components.Menu>
    )

    return (
        <div className="mb-3">
            <label className="form-label alert-form-select-label inline-block mb-2 text-gray-700 text-md mr-2">
                Search for Courses Near You
            </label>

            <div className="mb-3">
                <div className="search-options flex w-full justify-between border rounded-lg overflow-hidden">
                    <button
                        className={`search-button w-1/3 text-center font-medium py-2 px-1 ${
                            selectedTypeOfSearch === 'zipCode'
                                ? 'text-white bg-blue-600 selected  border-r'
                                : 'text-gray-700'
                        } text-xs md:text-base`} // Apply text-xs for mobile and md:text-base for larger screens
                        onClick={(e) => {
                            e.preventDefault()
                            setSelectedTypeOfSearch('zipCode')
                        }}
                    >
                        <FaEnvelope className="inline-block mr-2" />
                        Zip Code
                    </button>
                    <button
                        className={`search-button w-1/3 text-center font-medium py-2 px-1 ${
                            selectedTypeOfSearch === 'userLocation'
                                ? 'text-white bg-blue-600 selected  border-r border-l'
                                : 'text-gray-700'
                        } text-xs md:text-base`} // Apply text-xs for mobile and md:text-base for larger screens
                        onClick={(e) => {
                            e.preventDefault()
                            setSelectedTypeOfSearch('userLocation')
                            HandleGettingUserLocation()
                            if (selectRef.current) {
                                selectRef.current.focus()
                            }
                        }}
                    >
                        <FaMapMarkerAlt className="inline-block mr-2" />
                        Auto-detect
                    </button>
                    <button
                        className={`search-button w-1/3 text-center font-medium py-2 px-1 ${
                            selectedTypeOfSearch === 'searchString'
                                ? 'text-white bg-blue-600 selected  border-l'
                                : 'text-gray-700'
                        } text-xs md:text-base`} // Apply text-xs for mobile and md:text-base for larger screens
                        onClick={(e) => {
                            e.preventDefault()
                            setSelectedTypeOfSearch('searchString')
                        }}
                    >
                        <FaSearchLocation className="inline-block mr-2" />
                        Search
                    </button>
                </div>
            </div>

            <button
                ref={invisibleButtonRef} // Attach the ref to the button
                style={{
                    position: 'absolute', // Correct 'display' to 'position'
                    opacity: 0, // Correct 'oapcity' to 'opacity' and 'none' to 0
                }}
                data-bs-target="#courseWaitlistModal"
                data-bs-toggle="modal"
                aria-hidden="true" // Hide from accessibility tools
            >
                .
            </button>

            <CreatableSelect
                controlShouldRenderValue={false}
                ref={selectRef}
                components={{
                    MultiValueLabel: CustomMultiValueLabel,
                    Menu: CustomMenu,
                    MenuList: CustomMenuList,
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                        // Check if the input is empty
                        const input = selectRef.current.inputRef
                        if (input && input.value === '') {
                            // Prevent backspace from deleting last selected item
                            e.preventDefault()
                        }
                    }
                }}
                isMulti
                isClearable={false}
                isValidNewOption={() => false} // Disables "create" option
                isLoading={
                    searchingCoursesInProgress || gettingUserLocationInProgress
                }
                loadingMessage={() => 'Loading...'} // Custom loading message
                styles={customStyles}
                options={coursesOptions}
                onChange={(selected) => {
                    if (
                        selected &&
                        selected.find((option) => option.value === 'waitlist')
                    )
                        return

                    setSelectedCourses(selected)

                    const newPreferences = { ...preferences }
                    newPreferences.courses = selected
                        ? selected.map((option) => option.course_name)
                        : []
                    setPreferences(newPreferences)
                }}
                onInputChange={(input, { action }) => {
                    if (action === 'input-change') {
                        if (selectedTypeOfSearch === 'zipCode') {
                            setZipCode(input)
                        } else if (selectedTypeOfSearch === 'searchString') {
                            setSearchString(input)
                        } // No need to set for 'userLocation', as it's auto-detected
                    }
                }}
                formatOptionLabel={(data) => {
                    if (data.value === 'address' && data.label) {
                        return (
                            <div
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    opacity: 0.7,
                                    color: '#03314B',
                                    paddingBottom: '0.25rem',
                                }}
                            >
                                {data.label}
                            </div>
                        )
                    }

                    const distance = (
                        Math.round(data.course_distance * 10) / 10
                    ).toFixed(1)

                    //  const isTooltipEnabled = !!data.course_flagging_reason;

                    const unit = distance === '1.0' ? 'Mile' : 'Miles'
                    return (
                        <div className="pl-1 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-semibold ">
                                    {truncateString(
                                        data.label,
                                        data.course_distance ? 30 : 40
                                    )}{' '}
                                    {data?.course_flagging_reason && (
                                        <span className="">
                                            {' '}
                                            (Temporarily Unavailable)
                                        </span>
                                    )}
                                    {/* Truncate to 40 characters, adjust as needed */}
                                </span>
                                <ReactTooltip id={`tooltip-${data.value}`} />

                                {/* {isTooltipEnabled && (
                                        <FiInfo
                                            className="ml-2 text-gray-500 cursor-pointer"
                                            data-tooltip-id={`tooltip-${data.value}`}
                                            data-tooltip-content={data.course_flagging_reason_explanation}
                                            aria-label="Info"
                                        />
                                )} */}
                            </div>
                            <div>
                                {data.course_distance !== undefined && (
                                    <span className="text-sm font-semibold distance-text">
                                        {distance} {unit}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                }}
                onFocus={() => {
                    const input = selectRef.current.inputRef
                    if (input) {
                        const len = input.value.length
                        input.focus()
                        input.setSelectionRange(len, len)
                    }
                }}
                isOptionDisabled={(option) =>
                    option.value === 'address' ||
                    option.course_flagging_reason_tag
                }
                inputValue={
                    selectedTypeOfSearch === 'zipCode'
                        ? zipCode
                        : selectedTypeOfSearch === 'searchString'
                        ? searchString
                        : 'Auto-detect' // Default text when userLocation is selected
                }
                filterOption={null}
                placeholder={
                    selectedTypeOfSearch === 'zipCode'
                        ? 'Enter Your Zip Code'
                        : selectedTypeOfSearch === 'searchString'
                        ? 'Search by Course Name'
                        : 'Detect Location'
                }
                value={selectedCourses}
            />

            <div className="py-1" />
            <CreatableSelect
                menuIsOpen={false}
                components={{
                    MultiValueLabel: CustomMultiValueLabel,
                    Menu: CustomMenu,
                    MenuList: CustomMenuList,
                    DropdownIndicator: () => null, // This will remove the dropdown arrow
                }}
                isMulti
                isClearable
                isValidNewOption={() => false} // Disables "create" option
                isLoading={
                    searchingCoursesInProgress || gettingUserLocationInProgress
                }
                loadingMessage={() => 'Loading...'} // Custom loading message
                styles={{
                    ...customStyles,
                    input: (provided) => ({
                        ...provided,
                        caretColor: 'transparent', // This will remove the cursor
                    }),
                    control: (base) => ({
                        ...base,
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db87',
                        cursor: 'default',
                        fontSize: '1rem',
                        fontWeight: 'normal',
                        color: '#4B5563',
                        padding: '0.375rem 0.75rem',
                        width: '100%',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: '#d1d5db87',
                        },
                        '&:focus': {
                            borderColor: '#d1d5db87',
                            outline: 'none',
                        },
                    }),
                    placeholder: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                        opacity: 0.5,
                        // add any additional styling needed for alignment
                    }),
                }}
                options={coursesOptions}
                onChange={(selected) => {
                    if (
                        selected &&
                        selected.find((option) => option.value === 'waitlist')
                    ) {
                        return
                    }
                    setSelectedCourses(selected)

                    const newPreferences = { ...preferences }
                    newPreferences.courses = selected
                        ? selected.map((option) => option.course_name)
                        : []
                    setPreferences(newPreferences)
                }}
                formatOptionLabel={(data) => {
                    if (data.value === 'address' && data.label) {
                        return (
                            <div
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    opacity: 0.7,
                                    color: '#03314B',
                                    paddingBottom: '0.25rem',
                                }}
                            >
                                {data.label}
                            </div>
                        )
                    }
                    const distance = (
                        Math.round(data.course_distance * 10) / 10
                    ).toFixed(1)
                    const unit = distance === '1.0' ? 'Mile' : 'Miles'
                    return (
                        <div className="pl-1 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-semibold ">
                                    {truncateString(
                                        data.label,
                                        data.course_distance ? 30 : 40
                                    )}{' '}
                                </span>
                            </div>
                            <div>
                                {data.course_distance !== undefined && (
                                    <span className="text-sm font-semibold distance-text">
                                        {distance} {unit}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                }}
                isOptionDisabled={(option) => option.value === 'address'}
                inputValue=""
                filterOption={null}
                value={selectedCourses}
                placeholder={
                    selectedCourses?.length === 0 ? 'No Courses Selected' : ''
                }
            />
        </div>
    )
}

export default SearchCourses
