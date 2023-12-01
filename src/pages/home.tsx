import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from 'react';
import Header from '../component/Header';
import Arrow from '../assets/arrow.svg';
import { Link } from 'react-router-dom';
import Scene from '../component/scene'
import { CiTwitter } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
const Home = () => {
  const titleRef = useRef(null);
  const pararef = useRef(null);
  const buttonRef = useRef(null);
  const headerRef = useRef(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(headerRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 0.6, opacity: 1 })
    gsap.fromTo(titleRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 0.8, opacity: 1 })
    gsap.fromTo(pararef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 1.2, opacity: 1 })
    gsap.fromTo(buttonRef.current, 0.4, { y: 10, opacity: 0 }, { y: 0, delay: 1.4, opacity: 1 })
  }, [])



  return (
    <div className="bg-[#6C4BEF] min-h-screen text-white ">

      <div ref={headerRef} className=" ">
        <Header />
        <div className='flex flex-col text-white items-center h-[70vh] justify-center'>
          <h1 ref={titleRef} className='text-5xl font-normal font-space'>Sketch Board</h1>
          <h1 ref={pararef} className='text-center text-lg font-normal mt-8 font-space'>Sketch, Annotate, and Explore - Where Your Imagination Meets  Limitless <br /> Possibilities. Draw your thoughts, add notes, undo, redo, and  download<br /> your  creations with ease, all in one powerful web app!</h1>
          <Link to='./draw'>
            <button ref={buttonRef} className='py-3 font-space w-44 bg-yello flex items-center justify-center gap-2 text-lg border rounded-lg mt-8'>Simulator <img className='w-8' src={Arrow} /> </button>
          </Link>
        </div>
      </div>
      <Scene />

      <div className='h-[65vh] flex flex-col justify-between pt-6 pb-12'>
        <div className="flex flex-col justify-center text-white items-center" >
          <div className="aw-header">
            <h1 className='text-center text-3xl'>Technology Used</h1>
          </div>
          <div className='flex mt-4'>
            <div className='tech_stack p-5 gap-2 bg-gray-700 rounded-lg font-bold m-2 '>Typescript</div>
            <div className='tech_stack p-5 gap-2 bg-gray-700 rounded-lg font-bold m-2 '>React</div>
            <div className='tech_stack p-5 gap-2 bg-gray-700 rounded-lg font-bold m-2 '>Tailwind css</div>
            <div className='tech_stack p-5 gap-2 bg-gray-700 rounded-lg font-bold m-2 '>Canvas</div>
            <div className='tech_stack p-5 gap-2 bg-gray-700 rounded-lg font-bold m-2 '>Javascript</div>
          </div>
        </div>
        <div className="mt-12">
          <div className="" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div className="">
              <h1 className='text-3xl font-space'>Connect with me</h1>
            </div>
            <div className='text-center'>
              <a href='https://github.com/sanil011' rel="noreferrer" target="_blank">
              <button ref={buttonRef} className='py-3 font-space w-44 bg-yello flex items-center justify-center gap-2 text-lg border rounded-lg mt-8'>Github  <FiGithub className='text-xl' /> </button>
              </a>
            </div>
          </div>
        </div>
        <div className=''>
          <div className="flex items-center justify-between mx-auto w-[80%]">
            <h3>SketchBoard © 2023</h3>
            <div className='flex gap-2 items-center'>
              <a href='https://twitter.com/sanil011' rel="noreferrer" target="_blank">
                <CiTwitter className='text-3xl' />
              </a>
              <a href='https://www.linkedin.com/in/sanil-pal-48370b223/' rel="noreferrer" target="_blank">
                <CiLinkedin className='text-3xl' />
              </a>
              <a href='https://github.com/sanil011' rel="noreferrer" target="_blank">
                <FiGithub className='text-3xl' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home