import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import AddProblem from './AddProblem';
import { AppContext } from '../context/AppContext';
import Loader from './Loader';
import { IoCaretBackSharp } from "react-icons/io5";
import { IoCaretForwardSharp } from "react-icons/io5";

const CodingArena = () => {

  const [problems, setProblems] = useState([]);
  const { loading, setLoading } = useContext(AppContext);

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

  useEffect(() => {
    async function fetchData() {
      await fetchProblems();
    }
    
    fetchData();
    // eslint-disable-next-line
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const startIdx = page * itemsPerPage;

  const dispayPrblms = problems.slice(startIdx, startIdx + itemsPerPage);

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrev = () => {
    if(page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <>
      {
        loading ? (<Loader />) : (
          <div className={`pt-[13vh] pb-10 min-h-screen w-10/12 max-phone:w-[95%] max-ipad:w-11/12 mx-auto flex flex-col gap-y-7 ${showModal && 'opacity-[0.65]'} max-ipad:gap-y-5 max-md:gap-y-3`}>
            <h1 className='text-4xl max-ipad:text-3xl max-md:text-2xl max-phone:text-xl font-bold text-center drop-shadow-lg capitalize'>Welcome to the Coding Arena</h1>

            <div className='w-full flex items-center justify-end'>
              <button onClick={() => setShowModal(true)} className='flex gap-x-2 items-center text-xl max-ipad:text-lg max-md:text-[1rem] max-phone:text-sm px-5 max-ipad:px-4 max-md:py-1  py-2 rounded-md bg-green-500 text-white hover:scale-[1.03] transition-all duration-300 ease-in-out'>
                Add <FaPlus />
              </button>
            </div>


            <div className='flex items-center justify-between'>
              <button onClick={handlePrev} disabled={page === 0} className='bg-[#201e43] px-5 py-2 text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs text-white max-ipad:px-4 max-md:py-1 rounded-md disabled:opacity-[0.65] flex items-center gap-x-1 justify-center'><IoCaretBackSharp />Prev</button>
              <button onClick={handleNext} disabled={((page + 1) * itemsPerPage) >= problems.length} className='bg-[#201e43] px-5 py-2 text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs text-white max-ipad:px-4 max-md:py-1 rounded-md disabled:opacity-[0.65] flex items-center gap-x-1 justify-center'>Next<IoCaretForwardSharp /></button>
            </div>

            <div className='flex flex-col w-full border-2 border-black'>
              <div className='flex items-center bg-[#201E43] text-white text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs text-center'>
                <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1'>No.</p>
                <p className='w-full p-3 max-md:p-2 max-phone:p-1'>Problem</p>
                <p className='w-[15%] max-md:w-[20%] max-md:p-2 max-phone:p-1 p-3 text-center max-[350px]:hidden'>Solve It</p>
              </div>

              {
                dispayPrblms?.map((problem, idx) => (
                  <div key={problem._id} className='flex items-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>
                    <p className='w-[10%] max-md:w-[15%] p-3 max-md:p-2 max-phone:p-1 border-r-2 border-r-black text-center'>{idx+1}</p>
                    <Link to={`/codingArena/${problem._id}/${problem.slug}`} className='w-full p-3 border-r-2 max-[350px]:border-r-0 border-r-black max-md:p-2 max-phone:p-1'>
                      <p>{problem.title}</p>
                    </Link>
                    <Link to={`/codingArena/${problem._id}/${problem.slug}`} className='w-[15%] text-green-500 max-md:w-[20%] p-3 underline cursor-pointer text-center max-md:p-2 max-phone:p-1 max-[350px]:hidden'>Solve</Link>
                  </div>
                ))
              }

            </div>

          </div>
        )
      }
      <AddProblem showModal={showModal} setShowModal={setShowModal} fetchProblems={fetchProblems} from="Arena" />
    </>
  )
}

export default CodingArena
