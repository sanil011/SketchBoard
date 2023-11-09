import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
// import "../styles.css";
import Example from '../assets/example.jpg'
import Example2 from '../assets/example2.jpeg'
gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
    const component = useRef<HTMLDivElement>(null);
    const slider = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            let panels = gsap.utils.toArray(".panel");
            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: slider.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => "+=" + slider.current?.offsetWidth,
                    markers: true
                }
            });
        }, component);
        return () => ctx.revert();
    });

    return (
        <div className="App" ref={component}>
            {/* <div className="firstContainer">
                <h1>Testing horizontal scrolling w/ three sections</h1>
                <h2>First Container</h2>
            </div> */}
            <div ref={slider} className="container w-[600wv] h-[100vh] flex flex-wrap">
                <div className="description panel h-[100vh] w-[100vw] blue">
                    <div className="ap-wrapper">
                        <p>shjvdcvsdgc</p>
                        <div className="aw-header text-center">
                            <h1 className='anim-text font-normal  text-3xl'>Simulator</h1>
                            <h4 className='anim-text font-medium text-3xl'>This is a demo flowchart for checking weather a number is even or odd.</h4>
                        </div>
                        <div>
                            <img src={Example2} alt="" className='demo_app_img w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
                        </div>
                    </div>
                </div>
                <div className="panel h-[100vh] w-[100vw] red">
                    <div className="ap-wrapper">
                        <p>shjvdcvsdgc</p>
                        <div className="aw-header text-center">
                            <h1 className='anim-text font-normal  text-3xl'>Dashboard</h1>
                            <h4 className='anim-text font-medium text-3xl'>Create as many project you want to in the dashboard.</h4>
                        </div>
                        <div>
                            <img src={Example} alt="" className='demo_app_img w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
                        </div>
                    </div>
                </div>
                <div className="panel h-[100vh] w-[100vw] red">
                    <div className="ap-wrapper">
                        <p>shjvdcvsdgc</p>
                        <div className="aw-header text-center">
                            <h1 className='anim-text font-normal  text-3xl'>Dashboard</h1>
                            <h4 className='anim-text font-medium text-3xl'>Create as many project you want to in the dashboard.</h4>
                        </div>
                        <div>
                            <img src={Example} alt="" className='demo_app_img w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
                        </div>
                    </div>
                </div>
                <div className="panel h-[100vh] w-[100vw] red">
                    <div className="ap-wrapper">
                        <p>shjvdcvsdgc</p>
                        <div className="aw-header text-center">
                            <h1 className='anim-text font-normal  text-3xl'>Dashboard</h1>
                            <h4 className='anim-text font-medium text-3xl'>Create as many project you want to in the dashboard.</h4>
                        </div>
                        <div>
                            <img src={Example} alt="" className='demo_app_img w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
                        </div>
                    </div>
                </div>
            </div>
            <div className="lastContainer">Last Container</div>
        </div>
    );
}
