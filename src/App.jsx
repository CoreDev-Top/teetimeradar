import React, { Suspense } from 'react'

// eslint-disable-next-line import/no-unresolved
import { Toaster } from 'sonner'

import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import lazy from 'react-lazy-with-preload'
import 'animate.css'
import UnsubscribePage from './pages/UnsubscribePage'

const HomePage = lazy(() => import('./pages/Homepage'))
const Alerts = lazy(() => import('./pages/Alerts'))
const LoginPage = lazy(() => import('./pages/Loginpage'))
const JoinPage = lazy(() => import('./pages/Joinpage'))
const LandingPage = lazy(() => import('./pages/Landingpage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const TrialEndPage = lazy(() => import('./pages/TrialEndPage'))

global.DEV = false
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode')
    console.log(process.env.REACT_APP_ENV)
    if (process.env.REACT_APP_ENV && process.env.REACT_APP_ENV === 'local') {
        global.DEV = true
        console.log('Using local server')
    }
}

global.SERVER_HOST = global.DEV
    ? 'http://localhost:8080'
    : 'https://api.teetimealerts.io'
// global.SERVER_HOST = 'https://api.teetimealerts.io'

const App = () => (
    <div className="App">
        <BrowserRouter>
            <Suspense
                fallback={
                    <div
                        style={{
                            height: '100vh',
                            overflowY: 'hidden',
                            width: '100%',
                        }}
                    >
                        <img
                            src=""
                            alt="hello"
                            style={{
                                filter: 'hue-rotate(212deg)',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                transform: 'scale(0.5)',
                                maxWidth: '800px',
                                margin: 'auto',
                            }}
                        />
                    </div>
                }
            >
                <div className="pages">
                    <Routes>
                        <Route exact path="/" element={<LandingPage />} />
                        <Route
                            exact
                            path="/welcome"
                            element={<LandingPage />}
                        />
                        <Route exact path="/login" element={<LoginPage />} />
                        <Route exact path="/join" element={<JoinPage />} />
                        <Route exact path="/user" element={<HomePage />} />
                        <Route exact path="/alerts" element={<Alerts />} />
                        <Route
                            exact
                            path="/action"
                            element={<UnsubscribePage />}
                        />
                        <Route
                            exact
                            path="/dashboard"
                            element={<DashboardPage />}
                        />
                        <Route
                            exact
                            path="/pricing"
                            element={<PricingPage />}
                        />
                        <Route
                            exact
                            path="/trial-end"
                            element={<TrialEndPage />}
                        />
                    </Routes>
                </div>
            </Suspense>
        </BrowserRouter>
        <Toaster closeButton richColors />
    </div>
)

export default App
