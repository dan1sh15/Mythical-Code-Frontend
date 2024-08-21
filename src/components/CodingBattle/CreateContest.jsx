import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import AddProblem from '../Problems/AddProblem';
import { IoCaretBackSharp } from "react-icons/io5";
import { IoCaretForwardSharp } from "react-icons/io5";
import Loader from '../Loader';

const CreateContest = () => {

    const [contest, setContest] = useState({});
    const { loading, setLoading } = useContext(AppContext);
    const navigate = useNavigate(); 
    const { id } = useParams();

    const [problems, setProblems] = useState([]);
    const [currPage, setCurrPage] = useState(0);
    const itemsPerPage = 5;

    const fetchProblems = async () => {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + '/getAllProblems';
        const response = await fetch(url);
        const responseData = await response.json();

        if(responseData.success) {
            setLoading(false);
            setProblems(responseData.data);
            
        } else {
            setLoading(false);
            toast.error(responseData.message);
        }
    };

    const handleNextPage = () => {
        setCurrPage(currPage + 1);
        console.log(problems);

    };
    
    const handlePrevPage = () => {
        if(currPage > 0) {
            setCurrPage(currPage - 1);
        }
    };

    useEffect(() => {
        async function fetchData() {
            await fetchProblems();
        }
        
        fetchData();
        // eslint-disable-next-line
    }, []);

    const startIdx = currPage * itemsPerPage;
    const currProblems = problems.slice(startIdx, startIdx + itemsPerPage);

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

    const addProblemToContest = async (problemId) => {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + '/addProblemToContest';
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                problemId: problemId,
                contestId: id,
            }),
        });

        const responseData = await response.json();

        if(responseData.success) {
            toast.success(responseData.message);
            await fetchContestDetails();
        } else {
            toast.error(responseData.message);
        }
        setLoading(false);
    };

    const removeProblem = async (problemId) => {
        setLoading(true);
        const url = process.env.REACT_APP_BASE_URL + '/removeProblem';
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                problemId,
                contestId: id,
            })
        });

        const responseData = await response.json();

        if(responseData.success) {
            toast.success(responseData.message);
            await fetchContestDetails();
        } else {
            toast.error(responseData.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const fetchData = async () => {
                await fetchContestDetails();
            }
            fetchData();
        } else {
            navigate('/login');
        }
    // eslint-disable-next-line
    }, []);

    const [showModal, setShowModal] = useState(false);


  return (
    <>
        {
            loading ? (<div className='h-screen'><Loader /></div>) : (
                <div className='w-10/12 mx-auto min-h-screen flex flex-col gap-y-10 pt-[13vh] pb-10'>
                    <h1 className='text-3xl font-bold capitalize text-center'>{contest?.name}</h1>

                    <div className='flex flex-col gap-y-3'>
                        <div className='flex flex-col w-10/12 mx-auto rounded border-2 border-black'>
                            <div className='flex items-center bg-[#201E43] text-white text-lg text-center'>
                                <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1'>No.</p>
                                <p className='w-full p-3 max-md:p-2 max-phone:p-1'>Problem</p>
                                <p className='w-[15%] max-md:w-[20%] max-md:p-2 max-phone:p-1 p-3 text-center max-[350px]:hidden'>Delete</p>
                            </div>

                            {
                                contest?.problems?.map((problem,idx) => (
                                    <div key={problem._id} className='flex items-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>
                                        <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1 border-r-2 border-r-black text-center'>{idx+1}</p>
                                        <p className='w-full p-3 border-r-2 max-[350px]:border-r-0 border-r-black max-md:p-2 max-phone:p-1'>{problem.title}</p>
                                        <p onClick={() => removeProblem(problem._id)} className='w-[15%] text-red-500 max-md:w-[20%] p-3 underline cursor-pointer text-center max-md:p-2 max-phone:p-1 max-[350px]:hidden'>Delete</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <button onClick={() => setShowModal(true)} className='w-fit text-lg mx-auto rounded-md text-white bg-green-400 px-5 py-2'>Add Problem</button>

                    <p className='text-xl font-semibold w-10/12 mx-auto'>Add from existing problems</p>

                        <div className='w-10/12 mx-auto flex gap-x-3 items-center justify-end text-xl'>
                            <button onClick={handlePrevPage} disabled={currPage === 0} className='flex items-center gap-x-1 bg-[#201e43] text-white px-3 py-1 justify-center rounded'><IoCaretBackSharp />Prev</button>
                            <button onClick={handleNextPage} disabled={(currPage + 1) * itemsPerPage >= problems.length} className='flex items-center gap-x-1 bg-[#201e43] text-white px-3 py-1 rounded'>Next<IoCaretForwardSharp /></button>
                        </div>

                    <div className='flex flex-col border-2 border-black w-10/12 mx-auto'>
                        <div className='flex items-center bg-[#201E43] text-white text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs text-center'>
                            <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1'>No.</p>
                            <p className='w-full p-3 max-md:p-2 max-phone:p-1'>Problem</p>
                            <p className='w-[15%] max-md:w-[20%] max-md:p-2 max-phone:p-1 p-3 text-center max-[350px]:hidden'>Solve It</p>
                        </div>

                        {
                            currProblems?.map((problem, idx) => (
                                <div key={problem._id} className='flex items-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>
                                    <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1 border-r-2 border-r-black text-center'>{idx+1}</p>
                                    <Link to={`/codingArena/${problem._id}/${problem.slug}`} className='w-full p-3 border-r-2 max-[350px]:border-r-0 border-r-black max-md:p-2 max-phone:p-1'>
                                        <p>{problem.title}</p>
                                    </Link>
                                    <button onClick={() => addProblemToContest(problem._id)} className='w-[15%] text-green-500 max-md:w-[20%] p-3 underline cursor-pointer text-center max-md:p-2 max-phone:p-1 max-[350px]:hidden'>Add</button>
                                </div>
                        ))
                        }

                    </div>

                    <AddProblem fetchContestDetails={fetchContestDetails} showModal={showModal} setShowModal={setShowModal} from="Contest" contestId={contest._id} />
                    </div>
            )
        }
    </>
  )
}

export default CreateContest
