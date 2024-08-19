import React, { useContext, useState } from 'react';
import { VscEye,VscEyeClosed } from "react-icons/vsc";
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const Login = () => {

    const { setLoading, setUserData, loading,setLoggedIn } = useContext(AppContext);
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setData(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + '/login';
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...data})
        });
        const responseData = await response.json();

        if(responseData.success) {
            localStorage.setItem('token', responseData.token);
            setUserData(responseData.user);
            setLoggedIn(true);
            toast.success(responseData.message);
            navigate('/');
        } else {
            toast.error(responseData.message);
            setData({
                email :"",
                password: "",
            });
        }
        setLoading(false);
    }

  return (
    <>
    <div className='w-full min-h-[110vh] flex items-center justify-center py-[12vh]'>
        <div className='w-[35%] max-ipad:w-[45%] max-md:w-[60%] max-phone:w-[80%] max-ipad:p-5 max-phone:p-4 p-7 flex flex-col gap-y-7 max-ipad:gap-y-5 max-phone:gap-y-2 rounded-md shadow-xl bg-[#201E43] text-white'>
            <h1 className='uppercase font-semibold text-3xl max-ipad:text-2xl max-md:text-xl max-phone:text-lg text-center w-full'>Login</h1>
            <form onSubmit={submitHandler} className='flex flex-col gap-y-5 max-phone:gap-y-2'>

                <div className='flex flex-col gap-y-1'>
                    <fieldset className='w-full border-2 border-white px-3 py-1 max-ipad:py-0 max-phone:border rounded'>
                        <legend className='text-lg font-semibold max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Email Address</legend>
                        <div className='w-full flex items-center justify-between'>
                            <input 
                                type="email" 
                                name='email'
                                className='border-none bg-transparent outline-none w-full text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'
                                onChange={changeHandler}
                                value={data.email}
                                required
                            />
                        </div>
                    </fieldset>
                </div>

                <div className='flex flex-col gap-y-1'>
                    <fieldset className='w-full border-2 border-white px-3 py-1 rounded max-ipad:py-0 max-phone:border'>
                        <legend className='text-lg font-semibold max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Password</legend>
                        <div className='w-full flex items-center justify-between'>
                            <input 
                                type={`${showPassword ? 'text' : 'password'}`} 
                                name='password'
                                className='border-none bg-transparent outline-none w-full text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'
                                value={data.password}
                                onChange={changeHandler}
                                required
                            />
                            {
                                showPassword ? (<VscEyeClosed onClick={() => {
                                    setShowPassword(false);
                                }} className='text-2xl max-ipad:text-xl max-md:text-lg max-phone:text-[1rem] text-white cursor-pointer' />) : (<VscEye onClick={() => {
                                    setShowPassword(true);
                                }} className='text-2xl max-ipad:text-xl max-md:text-lg max-phone:text-[1rem] text-white cursor-pointer' />)
                            }
                            
                        </div>
                    </fieldset>
                </div>

                <button disabled={loading} className='bg-[#134B70] text-lg text-white py-2 rounded-lg font-semibold uppercase hover:bg-[#2e719d] transition-all duration-300 ease-in-out max-ipad:text-[1rem] disabled:opacity-[0.65] max-md:text-sm max-phone:text-xs'>
                    {
                        loading ? (<Loader />) : "Log In"
                    }
                </button>
            </form>

            <p className='text-sm max-phone:text-xs text-center'>Don't have a account? <Link to={'/signup'} className='font-semibold'>Sign Up</Link></p>
        </div>
    </div>
    </>
  )
}

export default Login;