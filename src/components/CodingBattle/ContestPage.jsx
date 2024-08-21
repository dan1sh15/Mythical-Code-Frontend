import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../Loader';

const ContestPage = () => {

    const [contest, setContest] = useState({});
    const { loading, setLoading } = useContext(AppContext);
    const [leaderboard, setLeaderBoard] = useState([]);
    const navigate = useNavigate();

    const {id} = useParams();
    const fetchContestDetails = async () => {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + `/goToContest/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "auth-token": localStorage.getItem('token')
            },
        });

        const responseData = await response.json();

        if(responseData.success) {
            setLoading(false);
            setContest(responseData.contest);
        } else {
            toast.error(responseData.message);
        }
    };

    const getLeaderBoard = async () => {
        const url = process.env.REACT_APP_BASE_URL + `/getLeaderboard/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });

        const responseData = await response.json();

        if(responseData.success) {
            console.log("Got leaderboard");
            
            setLeaderBoard(responseData.leaderBoard);
        } else {
            toast.error("Error fetching leaderboard details");
        }
    }

    setInterval(getLeaderBoard, 5 * 60 * 1000);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const fetchData = async () => {
                await fetchContestDetails();
                await getLeaderBoard();
            }
            console.log(leaderboard);
            
            fetchData();
        } else {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, []);

  return (
    <>
        {
            loading ? (<div className='flex h-screen items-center justify-center bg-white'><Loader /></div>) : (
                <div className='min-h-screen w-10/12 mx-auto flex flex-col gap-y-7 pt-[13vh] pb-10 max-phone:w-[95%] max-ipad:w-11/12 max-ipad:gap-y-5 max-md:gap-y-3'>
                    <h1 className='text-center text-3xl max-ipad:text-2xl max-md:text-xl max-phone:text-lg capitalize font-bold'>{contest?.name}</h1>
                    <div className='flex flex-col gap-y-3'>
                        <p className='text-xl font-[500] max-ipad:text-lg max-md:text-[1rem] max-phone:text-sm'>Problemset</p>
                        <div className='flex flex-col w-10/12 max-ipad:w-full mx-auto border-2 border-black'>
                        <div className='flex items-center bg-[#201E43] text-white text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs text-center'>
                            <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1'>No.</p>
                            <p className='w-full p-3 max-md:p-2 max-phone:p-1'>Problem</p>
                            <p className='w-[15%] max-md:w-[20%] max-md:p-2 max-phone:p-1 p-3 text-center max-[350px]:hidden'>Solve It</p>
                        </div>
                            {
                                contest?.problems?.map((problem, idx) => (
                                    <div key={problem._id} className='flex items-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>
                                        <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1 border-r-2 border-r-black text-center'>{idx+1}</p>
                                        <Link to={`/contest/${contest._id}/problem/${problem._id}`} className='w-full p-3 border-r-2 max-[350px]:border-r-0 border-r-black max-md:p-2 max-phone:p-1'>{problem.title}</Link>
                                        <Link to={`/contest/${contest._id}/problem/${problem._id}`} className='w-[15%] text-green-500 max-md:w-[20%] p-3 underline cursor-pointer text-center max-md:p-2 max-phone:p-1 max-[350px]:hidden'>Solve</Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-3'>
                        <h2 className='text-xl font-[500] max-ipad:text-lg max-md:text-[1rem] max-phone:text-sm'>Leaderboard</h2>
                        
                        <div className='flex flex-col w-10/12 max-ipad:w-full mx-auto border-2 border-black'>
                            <div className='flex items-center bg-[#201E43] text-white text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs text-center'>
                                <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1'>No.</p>
                                <p className='w-full p-3 max-md:p-2 max-phone:p-1'>Name</p>
                                <p className='w-[15%] max-md:w-[20%] max-md:p-2 max-phone:p-1 p-3 text-center'>Score</p>
                            </div>
                            {
                                leaderboard?.map((leader, idx) => (
                                    <div key={leader._id} className='flex items-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>
                                        <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1 border-r-2 border-r-black text-center'>{idx+1}</p>
                                        <p className='w-full p-3 border-r-2 border-r-black max-md:p-2 max-phone:p-1'>{leader?.user}</p>
                                        <p className='w-[15%] font-semibold max-md:w-[20%] p-3 cursor-pointer text-center max-md:p-2 max-phone:p-1'>{leader?.score}</p>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>
            )
        }
    </>
  )
}

export default ContestPage
