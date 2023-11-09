import Header from '../component/Header';
import Arrow from '../assets/arrow.svg';
import { Link } from 'react-router-dom';
import { gsap } from "gsap";
import { useEffect, useRef, useLayoutEffect } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles.css'
import Example from '../assets/example.jpg'
import Example2 from '../assets/example2.jpeg'
const Home = () => {
  const featureRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef(null);
  const pararef = useRef(null);
  const buttonRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    gsap.fromTo(titleRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 0.6, opacity: 1 })
    gsap.fromTo(pararef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 1, opacity: 1 })
    gsap.fromTo(buttonRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 1.2, opacity: 1 })
    gsap.fromTo(featureRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 1.2, opacity: 1, scrollTrigger: featureRef.current })
  }, [])

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
    <div className='App bg-[#6C4BEF]'>
      <div ref={component}>
        <div className='h-[100vh]'>
          <Header />
          <div className='flex flex-col text-white items-center h-[50vh] justify-center'>
            <h1 ref={titleRef} className='text-5xl font-normal font-space'>Sketch Board</h1>
            <h1 ref={pararef} className='text-center text-lg font-normal mt-8 font-space'>Sketch, Annotate, and Explore - Where Your Imagination Meets  Limitless <br /> Possibilities. Draw your thoughts, add notes, undo, redo, and  download<br /> your  creations with ease, all in one powerful web app!</h1>
            <Link to='./draw'>
              <button ref={buttonRef} className='py-3 font-space w-44 bg-yello flex items-center justify-center gap-2 text-lg border text-black rounded-lg mt-8'>Simulator <img className='w-8' src={Arrow} /> </button>
            </Link>
          </div>
        </div>
        <div ref={slider} className="container">
          <div className="description panel">
            <p>jhsdhcbdsjh</p>
          </div>
          <div className="panel">
              <div className=" text-center">
                <h1 className='font-normal text-3xl'>Dashboard</h1>
                <h4 className='anim-text font-medium text-3xl'>Create as many project you want to in the dashboard.</h4>
              </div>
              <div>
                <img src={Example} alt="" className='w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
            </div>
          </div>
          <div className="panel">
              <div className="text-center">
                <h1 className='font-normal text-3xl'>Dashboard</h1>
                <h4 className='font-medium text-3xl'>Create as many project you want to in the dashboard.</h4>
              </div>
              <div>
                <img src={Example2} alt="" className='demo_app_img w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
              </div>
          </div>
          <div className="panel">
              <div className="text-center">
                <h1 className='font-normal  text-3xl'>Dashboard</h1>
                <h4 className='font-medium text-3xl'>Create as many project you want to in the dashboard.</h4>
              </div>
              <div>
                <img src={Example} alt="" className='w-[900px] rounded-xl shadow-[0px 0px 24px #ffca64]' />
            </div>
          </div>
          <div className="lastContainer">Last Container</div>

        </div>
      </div>
    </div>
  )
}

export default Home