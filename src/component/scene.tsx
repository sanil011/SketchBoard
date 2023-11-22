import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import First from '../assets/first.png';
import Second from "../assets/second.png";

function Scene() {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const featureRef = useRef(null);

    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
        gsap.fromTo(featureRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 1.4, opacity: 1 })

        const pin = gsap.fromTo(
            sectionRef.current,
            {
                translateX: 0,
            },
            {
                translateX: "-100vw",
                ease: "none",
                duration: 1,
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "2000 top",
                    scrub: 0.6,
                    pin: true,
                },
            }
        );
        return () => {
            {/* A return function for killing the animation on component unmount */ }
            pin.kill();
        };
    }, []);

    return (
        <section className="scroll-section-outer">
            {/* The section up act just as a wrapper. If the trigger (below) is the
      first jsx element in the component, you get an error on route change */}

            {/* The div below act just as a trigger. As the doc suggests, the trigger and 
      the animation should alway be two separated refs */}
            <div ref={triggerRef}>
                <h1 ref={featureRef} className="text-center text-5xl font-normal font-space mt-8 text-white">Features</h1>
                <div ref={sectionRef} className="scroll-section-inner">
                    <div className="scroll-section">
                        <section className="text-center w-[60%] mx-auto">
                            <h1 className="text-white text-3xl mb-12">You can sketch your thought, erase and download as a Image.</h1>
                            <div className="w-full shadow-4xl">
                                <img src={First} className="w-full h-full object-contain" />
                            </div>
                        </section>
                    </div>
                    <div className="scroll-section">
                        <section className="text-center w-[60%]  mx-auto">
                            <h1 className="text-white text-3xl mb-12">You can upload a Image, Notes, Undo and Redo.</h1>
                            <div className="w-full shadow-4xl">
                                <img src={Second} className="w-full h-full object-contain" />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Scene;
