import React, { useEffect, useState } from 'react'
import PurchasePlan from '../components/PurchasePlan'
import Navbar from '../components/landing-page/Navbar'

import useAuth from '../hooks/useAuth'

const TrialEndPage = () => {
    const { userData, loading } = useAuth()
    const [loggedIn, setLoggedIn] = useState(true)
    useEffect(() => {
        if (loading) return
        if (userData) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [userData, loading])

    return (
        <>
            <Navbar hideLogin={loggedIn} />
            <PurchasePlan afterFreeTrial />
        </>
    )
}

export default TrialEndPage
