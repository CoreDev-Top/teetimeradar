/**
 * Custom styles for react-select npm library.
 */
export const customStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: 'white',
        border: '1px solid #D1D5DB',
        borderRadius: '0.70rem',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'normal',
        color: '#4B5563',
        padding: '0.375rem 0.75rem',
        width: '100%',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#9CA3AF',
        },
        '&:focus': {
            borderColor: '#2563EB',
            outline: 'none',
        },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: 'white',
        borderRadius: '0.35rem',
        marginTop: 0,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 11px',
        zIndex: '1000',
    }),
    menuList: (base) => ({
        ...base,
        zIndex: '1000',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor:
            state.data.value === 'waitlist' || state.data.value === 'address'
                ? 'white'
                : state.isFocused
                ? '#1E90FF'
                : state.isDisabled
                ? '#f2f2f2'
                : 'white', // Light gray for disabled, but more visible
        color: state.isFocused
            ? 'white'
            : state.isDisabled
            ? '#6c757d'
            : '#4B5563', // Darker gray for disabled text for better visibility
        cursor: state.isDisabled
            ? 'not-allowed'
            : state.data.value === 'zipCodeData'
            ? 'default'
            : 'pointer',
        padding: '0.375rem 0.75rem',
        fontSize: '1rem',
        '& .distance-text': {
            color: state.isFocused
                ? 'white'
                : state.isDisabled
                ? '#6c757d'
                : 'rgb(22 163 74)',
        },
        opacity: state.isDisabled ? 0.7 : 1, // Slightly reduced opacity for disabled state
    }),

    singleValue: (base) => ({
        ...base,
        color: '#4B5563',
    }),

    indicatorSeparator: (base) => ({
        ...base,
        display: 'none',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: '#4B5563',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0px',
    }),
    input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
        // add any additional styling needed for alignment
    }),
    placeholder: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
        // add any additional styling needed for alignment
    }),
}

export const customOptionStyles = {
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
}
