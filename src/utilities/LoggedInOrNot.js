import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase-config'

const LoggedInOrNot = async () => {
    let isUserLoggedIn = false
    const checkIfUserIsLoggedIn = async () => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                isUserLoggedIn = true

                localStorage.setItem('isUserLoggedIn', JSON.stringify(true))
            } else {
                isUserLoggedIn = false
                localStorage.setItem('isUserLoggedIn', JSON.stringify(false))
            }
        })
    }

    const storedValue = localStorage.getItem('isUserLoggedIn')
    if (storedValue && storedValue !== 'undefined') {
        isUserLoggedIn = JSON.parse(storedValue)
    } else {
        await checkIfUserIsLoggedIn()
    }

    return isUserLoggedIn
}

export default LoggedInOrNot
