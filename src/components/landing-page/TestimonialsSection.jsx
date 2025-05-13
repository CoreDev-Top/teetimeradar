import React, { useEffect, useState, useRef } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useDraggable } from 'react-use-draggable-scroll'

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Charlie K',
            description:
                '“I can’t stop using this tool. With so many people canceling tee times, I have my ‘pick of the litter’ on when and where I want to play. Just have to act fast:“',
            image: 'https://teetimealerts.nyc3.cdn.digitaloceanspaces.com/testimonial-2.png',
        },
        {
            name: 'George P',
            description: `“As someone who plans everything only a few days out, I found myself never golfing due to the fact that every non twilight tee time was always booked. Tee Time Alerts lets me get out at my favorite courses with much less planning“`,
            image: 'https://teetimealerts.nyc3.cdn.digitaloceanspaces.com/testimonial-1.png',
        },
        {
            name: 'John W',
            description: `“Torrey Pines has always been extremely difficult to get a tee time but now I can snag tee times no problem using this tool. Absolute game changer“`,
            image: 'https://teetimealerts.nyc3.cdn.digitaloceanspaces.com/testimonial-3.png',
        },
    ]

    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2
        if (t < 1) return (c / 2) * t * t + b
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
    }

    const animateScroll = (
        element,
        property,
        startValue,
        endValue,
        duration
    ) => {
        const startTime = performance.now()

        const animationLoop = (currentTime) => {
            const timeElapsed = currentTime - startTime

            if (timeElapsed >= duration) {
                element[property] = endValue
                return
            }

            const easing = easeInOutQuad(
                timeElapsed,
                startValue,
                endValue - startValue,
                duration
            )
            element[property] = easing

            requestAnimationFrame(animationLoop)
        }

        requestAnimationFrame(animationLoop)
    }

    const ref = useRef() // We will use React useRef hook to reference the wrapping div:
    const { events } = useDraggable(ref, {
        applyRubberBandEffect: true,
    }) // Now we pass the reference to the useDraggable hook:

    useEffect(() => {
        if (ref.current) {
            const container = ref.current
            container.scrollLeft =
                container.scrollWidth / 2 - container.clientWidth / 2
        }
    }, [])
    const handleScrollLeft = () => {
        if (ref.current) {
            const container = ref.current
            const targetScrollLeft =
                container.scrollLeft - container.clientWidth
            const duration = 500 // 500 milliseconds

            animateScroll(
                container,
                'scrollLeft',
                container.scrollLeft,
                targetScrollLeft,
                duration
            )
        }
    }

    const handleScrollRight = () => {
        if (ref.current) {
            const container = ref.current
            const targetScrollLeft =
                container.scrollLeft + container.clientWidth
            const duration = 500 // 500 milliseconds

            animateScroll(
                container,
                'scrollLeft',
                container.scrollLeft,
                targetScrollLeft,
                duration
            )
        }
    }

    const handleScrollMiddle = () => {
        if (ref.current) {
            const container = ref.current
            const targetScrollLeft =
                container.scrollWidth / 2 - container.clientWidth / 2
            const duration = 500 // 500 milliseconds

            animateScroll(
                container,
                'scrollLeft',
                container.scrollLeft,
                targetScrollLeft,
                duration
            )
        }
    }

    const [selectedTestimonialCard, setSelectedTestimonialCard] = useState(1)

    return (
        <div>
            {' '}
            <div
                style={{
                    height: '50px',
                    background: 'rgb(30 37 41)',
                    borderTopRightRadius: '100%',
                    borderTopLeftRadius: '100%',
                }}
            />
            <div className="testimonials">
                <div
                    className=" alert-title "
                    style={{
                        color: 'white',
                        width: 'fit-content',
                        margin: 'auto',
                        paddingBlock: '75px',
                    }}
                >
                    {' '}
                    What Golfers Are Saying{' '}
                </div>
                <div
                    id="carousel-wrapper"
                    className="carousel-wrapper transition duration-500 ease-in-out scrollbar-hide"
                    style={{ display: 'flex' }}
                    {...events}
                    ref={ref}
                >
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded shadow-lg
             transition duration-500 ease-in-out  testimonial-card-drag
            "
                            onMouseDown={() => {
                                setSelectedTestimonialCard(index)
                                if (index === 0) handleScrollLeft()
                                else if (index === 1) handleScrollMiddle()
                                else if (index === 2) handleScrollRight()
                            }}
                            style={{
                                background:
                                    index === selectedTestimonialCard
                                        ? 'white'
                                        : '#a7b4bd',
                            }}
                        >
                            <div className="testimonial-description">
                                {testimonial.description}
                            </div>
                            <div className="testimonial-name w-fit m-auto mt-[15px]">
                                {testimonial.name}
                            </div>
                            <img
                                src={testimonial.image}
                                style={{
                                    filter:
                                        index === selectedTestimonialCard
                                            ? 'brightness(1)'
                                            : 'brightness(0.5)',
                                }}
                                alt="testimonial"
                                className="rounded-full border-2 border-green-500 ml-auto testimonial-image "
                                width="60"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TestimonialsSection
