import React, { useContext, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { IoClose } from "react-icons/io5";

const CodingBattle = () => {
    const { setLoading, userData, fetchUserDetails, loading } = useContext(AppContext);
    const [contests, setContests] = useState([]);
    const navigate = useNavigate();

    const fetchContest = async () => {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + '/getContests';

        const response = await fetch(url);
        const responseData = await response.json();

        if(responseData.success) {
            setLoading(false);
            setContests(responseData.contests);
        } else {
            toast.error(responseData.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchContest();
            await fetchUserDetails();
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    const handleParticipate = async (contestId) => {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + '/addUser';
        console.log("USER ID", userData._id);
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                contestId,
                userId: userData?._id
            })
        });

        const responseData = await response.json();
        console.log(responseData);
        

        if(responseData.success) {
            // console.log("REdirecting from creating a new user");
            navigate(`/contest/${contestId}`);
        }
        else if(responseData?.message === "User is already registered") {
            // console.log("REdirecting from user already exist");
            
            navigate(`/contest/${contestId}`);
        } 
        else {
            toast.error(responseData.message);
        }
        setLoading(false);
    };

    const [contestDetails, setContestDetails] = useState({
        name: "",
        expiresIn: ""
    });
    const [showContestModal, setShowContestModal] = useState(false);

    const handleChange = (e) => {
        setContestDetails(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowContestModal(false);
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + `/createContest`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({...contestDetails})
        });

        const responseData = await response.json();

        if(responseData.success) {
            toast.success(responseData.message);
            setLoading(false);
            navigate(`/createContest/${responseData?.contest?._id}`);
        } else {
            setLoading(false);
            toast.error(responseData.message);
        }
        setContestDetails({
            name: "",
            expiresIn: ""
        });
    }

  return (
    <>
        {
            loading ? (<div className='min-h-screen bg-white flex items-center justify-center'><Loader /></div>) : (
                <div className='min-h-screen w-10/12 mx-auto flex flex-col gap-y-10 pt-[13vh] pb-10 max-phone:w-[95%] max-ipad:w-11/12 max-ipad:gap-y-5 max-md:gap-y-3'>
                    <div className='flex flex-col gap-y-3'>
                        <h1 className='text-4xl font-bold max-ipad:text-3xl max-md:text-2xl max-phone:text-xl'>Welcome to Coding Battleground</h1>
                        <p className='text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs max-[300px]:text-[0.65rem] text-[#797979]'>Coding Battleground is a place where you can create your own contest along with the functionality to participate in the ongoing contest and standout among all the users in the leaderboard.</p>
                    </div>

                    <div className='flex max-md:flex-col max-md:gap-y-2  w-full items-center justify-between'>
                        <div className='flex gap-x-1 items-center justify-between border-2 rounded-md px-5 w-[30%] max-md:w-full' >
                            <input type="text" placeholder='Search' className='outline-none bg-transparent w-full h-full py-2 max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs' />
                            <FaSearch className='text-[#c1c1c1]' />
                        </div>

                        <button onClick={() => setShowContestModal(true)} className='flex gap-x-2 items-center text-xl px-5 py-2 rounded-md bg-green-500 text-white hover:scale-[1.03] transition-all duration-300 ease-in-out max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs max-md:mx-auto'> 
                            Create Contest
                        </button>

                        {/* Contest Modal */}
                        <div className={`min-h-screen w-full absolute top-0 left-0 flex items-center justify-center ${showContestModal ? 'scale-[1]' : 'scale-0'} transition-all duration-300 ease-linear`}>
                            <div className='w-[35%] max-ipad:w-[40%] max-md:w-[50%] max-sm:w-[70%] max-phone:w-[80%] relative flex flex-col gap-y-6 bg-white p-5 shadow-lg border-2 max-ipad:gap-y-5 max-md:gap-y-4 max-phone:gap-y-3'>
                                <span onClick={() => setShowContestModal(false)} className='absolute top-3 right-3 text-xl max-ipad:text-lg max-md:text-[1rem] cursor-pointer'><IoClose /></span>
                                <h1 className='text-xl max-ipad:text-lg max-md:text-[1rem] max-phone:text-sm font-semibold text-center'>Enter Contest details</h1>
                                <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 max-md:gap-y-3'>
                                    <div className="flex flex-col gap-y-1">
                                        <label htmlFor="name" className='max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Contest Name</label>
                                        <input 
                                            type="text"
                                            id='name'
                                            name='name'
                                            className='border outline-none px-4 py-2 text-sm rounded-sm w-full max-sm:text-xs'
                                            value={contestDetails.name}
                                            onChange={handleChange}
                                         />
                                    </div>

                                    <div className='flex flex-col gap-y-1'>
                                        <label htmlFor="duration" className='max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Duration</label>
                                        <input 
                                            type="number" 
                                            id='duration'
                                            name='expiresIn'
                                            className='border outline-none px-4 py-2 text-sm rounded-sm w-full max-sm:text-xs'
                                            value={contestDetails.expiresIn}
                                            onChange={handleChange}

                                        />
                                    </div>

                                    <button className='flex gap-x-2 items-center px-4 py-1 rounded w-full bg-green-500 text-white hover:scale-[1.02] transition-all duration-300 ease-in-out text-center justify-center max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Create</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className='flex w-full flex-col gap-y-5'>
                        <h2 className='text-3xl font-semibold max-ipad:text-2xl max-md:text-xl max-phone:text-lg'>Ongoing Contests</h2>
                        {
                            contests ? (
                                <div className='flex flex-col w-full mx-auto rounded border-2 border-black'>
                                    <div className='flex items-center bg-[#201E43] text-white text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs  text-center'>
                                        <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1'>No.</p>
                                        <p className='w-full p-3 max-md:p-2 max-phone:p-1'>Contest Name</p>
                                        <p className='w-[15%] max-md:w-[20%] max-md:p-2 max-phone:p-1 p-3 text-center max-[350px]:hidden'>Participate</p>
                                    </div>

                                    {
                                        contests.map((contest, idx) => (
                                            <div key={contest?._id} className='flex items-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>
                                                <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1 border-r-2 border-r-black text-center'>{idx+1}</p>
                                                <p onClick={() => handleParticipate(contest._id)} className='w-full p-3 border-r-2 max-[350px]:border-r-0 border-r-black max-md:p-2 max-phone:p-1'>{contest?.name}</p>
                                                <div onClick={() => handleParticipate(contest._id)} className='w-[15%] text-green-500 max-md:w-[20%] p-3 underline cursor-pointer text-center max-md:p-2 max-phone:p-1 max-[350px]:hidden'>Participate</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : "No Ongoing contest"
                        }
                    </div>
                </div>
            )
        }
    </>
  )
}

export default CodingBattle
