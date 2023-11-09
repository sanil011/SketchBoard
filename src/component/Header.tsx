
import { Link } from 'react-router-dom'
const Header = () => {
  return (
      <div className='w-[80%] mx-auto flex justify-between items-center h-24'>
          <p className='text-xl'>Sketch Board</p>
          <div className='flex gap-4 items-center'>
              <Link to='/draw'>
              <p className='text-lg'>Simulator</p>
              </Link>

              <a href='https://github.com/sanil011/SketchBoard' target="_blank" rel="noopener noreferrer">
              <p className='text-lg'>Contribute</p>
              </a>
          </div>
    </div>
  )
}

export default Header