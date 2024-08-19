import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaLaptopCode } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { CgMenuLeftAlt } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {

  const { loggedIn, setLoggedIn, userData, fetchUserDetails } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  }

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      fetchUserDetails();
    }
    // eslint-disable-next-line
  }, [fetchUserDetails]);

  return (
    <div className='h-[10vh] bg-[#201E43] fixed w-full z-10'>
      <div className='w-10/12 mx-auto flex justify-between h-full items-center'>
        <Link to="/"><h1 className='text-white text-3xl max-ipad:text-2xl max-md:text-xl max-phone:text-[1rem] font-semibold'>Mythical Code</h1></Link>

        <nav className={`flex items-center max-ipad:absolute max-ipad:bg-white max-ipad:w-full max-ipad:left-0 max-ipad:justify-center max-ipad:p-5 ${showMenu ? 'top-[11vh]' : '-top-[10000px]'} max-ipad:opacity-[0.9] transition-all duration-300 ease-linear max-ipad:flex-col max-ipad:gap-y-4 w-[60%] max-xl:w-[70%] justify-between`}>
            <ul className='flex gap-x-5 text-white max-ipad:text-[#201e43] max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs max-ipad:flex-col max-ipad:items-center max-ipad:font-semibold max-ipad:gap-y-2'>
                <li><NavLink className='flex items-center gap-x-2' to='/codingArena'>Coding Arena <FaLaptopCode className='text-xl' /></NavLink></li>
                <li><NavLink className='flex items-center gap-x-2' to={'/codingBattleground'}>Coding Battleground <LuSwords className='text-xl' /></NavLink></li>
            </ul>

            {
                loggedIn ? (
                  <div  className='flex items-center justify-center gap-x-3 max-phone:gap-x-2'>
                    <p className='text-white max-ipad:text-[#201e43] font-semibold max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>{userData?.name?.split(' ')[0]}</p>
                    <button onClick={handleLogout} className=' text-white border-2 border-white rounded font-semibold text-lg max-ipad:text-[1rem] max-ipad:text-[#201e43] max-ipad:border-[#201e43] max-md:text-sm max-phone:text-xs px-4 py-1 hover:bg-white hover:text-[#201E43] transition-all duration-300 ease-in-out'>Logout</button>
                  </div>
                ) : (
                  <Link to={'/login'} className='flex items-center justify-center'>
                    <button className=' text-white border-2 border-white rounded font-semibold text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs px-4 py-1 hover:bg-white hover:text-[#201E43] transition-all duration-300 ease-in-out'>Login</button>
                  </Link>
                )
            }
        </nav>

        <button onClick={() => setShowMenu(!showMenu)} className='text-2xl ipad:hidden text-white'>
          {
           showMenu ? <RxCross2 /> : <CgMenuLeftAlt />
          }
        </button>
      </div>
    </div>
  )
}

export default Navbar
