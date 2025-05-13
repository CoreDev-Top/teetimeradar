import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase-config'

import FetchGolferData from '../utilities/FetchGolferData'

// Custom hook for handling user authentication and fetching user data
const useAuth = () => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const tkn = await currentUser.getIdToken()
                setToken(tkn)
                localStorage.setItem('jwt', tkn)
                if (tkn) {
                    const fetchedUserData = await FetchGolferData(
                        currentUser.uid,
                        tkn
                    )
                    setUserData(fetchedUserData)
                }
            } else {
                setUserData(null)
            }
            setLoading(false)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return { userData, loading, setUserData, token }
}

export default useAuth
