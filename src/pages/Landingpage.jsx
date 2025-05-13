import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateAlertDemoSection from "../components/landing-page/CreateAlertDemoSection";
import Footer from "../components/landing-page/Footer";
import GuideSection from "../components/landing-page/GuideSection";
import HeroSection from "../components/landing-page/HeroSection";
import InsightsSection from "../components/landing-page/InsightsSection";
import Navbar from "../components/landing-page/Navbar";
import TestimonialsSection from "../components/landing-page/TestimonialsSection";
import TipsSection from "../components/landing-page/TipsSection";
import useAuth from "../hooks/useAuth";

const Landingpage = () => {
  const navigate = useNavigate();

  const { userData, loading } = useAuth();

  useEffect(() => {
    if (window.location.pathname.includes("welcome")) return;

    if (!loading && userData) {
      navigate("/user");
    }
  }, [loading, userData, navigate]);

  return (
    <div style={{ background: "#F5F8FD" }}>
      {/* {((!loading && !userData) ||
                userData?.subscriptionStatus === 'free_trial' ||
                userData?.subscriptionStatus === 'free_trial_over' ||
                userData?.subscriptionStatus === 'canceled') && (
                <div className=" bg-gray-900 text-white py-8 px-4 sm:px-10">
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
                </div>
            )} */}
      <Navbar loggedIn={!!(!loading && userData)} />
      <div id="Home" />

      <HeroSection />

      <div style={{ marginBlock: "100px" }} />
      <CreateAlertDemoSection />

      <div id="How It Works" style={{ marginBlock: "100px" }} />
      <GuideSection />
      <div id="Quick Tips" style={{ marginBlock: "100px" }} />
      <TipsSection />
      <div id="Testimonials" style={{ marginBlock: "100px" }} />
      <TestimonialsSection />

      <div id="Featured Course" />

      <InsightsSection />

      <div style={{ marginBlock: "100px" }} />
      <Footer />
    </div>
  );
};

export default Landingpage;
