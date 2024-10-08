import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlay } from "react-icons/fa6";
import { Editor } from '@monaco-editor/react';
import Loader from '../Loader';
import { AppContext } from '../../context/AppContext';

const CodingProblem = () => {

  const { loading, setLoading, fetchUserDetails, setLoggedIn, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [problem, setProblem] = useState({});
  const { id, contestId } = useParams();
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState(localStorage.getItem('code') || '// Enter your code here');

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  }

  const changeTheme = (e) => {
      setTheme(e.target.value);
  }

  const changeHandler = (e) => {
      setCode(e);
  };

  const [showCustom, setShowCustom] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const fecthProblem = async () => {
    setLoading(true);
    const url = process.env.REACT_APP_BASE_URL + `/getProblem/${id}`;
    const response = await fetch(url);

    const responseData = await response.json();

    if(responseData.success) {
      setLoading(false);
      setProblem(responseData.problem);
      console.log(problem);
    } else {
      setLoading(false);
      toast.error(responseData.message);
    }
    setLoading(false);
  };

  const [loader, setLoader] = useState(false);

  const runCodeHandler = async () => {
    setLoader(true);
    setShowCustom(true);
    const url = process.env.REACT_APP_BASE_URL + '/run';

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lang: language,
          code: code,
          input: input
        })
    });

    const responseData = await response.json();
    if(responseData.success) {
        console.log(responseData.message);
        console.log("Output",responseData.output);
        setOutput(responseData.output);
    } else {
        toast.error(responseData.message);
    }
    setLoader(false);
}

  const [color, setColor] = useState("black");

  const checkProblem = async () => {
    localStorage.setItem('code', code);
    setLoader(true);
    setShowCustom(false);
        const url = process.env.REACT_APP_BASE_URL + `/checkProblem/${problem?.slug}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
              lang: language,
              code: code,
            })
        });

        const responseData = await response.json();
        if(responseData.success) {
          console.log("Problem Accepted");
          
          setSuccess(true);
          setShow(true);
          setUserOutput(responseData.output);
          return problem.difficulty === "Easy" ? 20 : problem?.difficulty === "Medium" ? 30 : 50; 
        } else {
          setColor("red-500");
            const responseCode = responseData.error?.error?.code;
            if(responseCode === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
                setOutput("Time Limit Exceeded");
            }
            else if(responseCode === 3221225477) {
                setOutput("Segmentation Fault");
            } 
            else if(responseCode === 5) {
                setOutput("Access Denied");
            }
            else if(responseCode === 8) {
                setOutput("Memory limit exceeded");
            }
            else if(responseCode === 87) {
                setOutput("Invalid Parameters")
            }
            else if(responseCode === 2147942405) {
                setOutput("E_ACCESSDENIED (HRESULT)")
            }
            else if(responseCode === 2147500037) {
                setOutput("Unspecified error E_FAIL (HRESULT)");
            }
            else if(responseCode === 2147942487) {
                setOutput("E_INVALIDARG (HRESULT)")
            }
            else if(responseCode === 3221225786) {
                setOutput("The application terminated ");
            }
            else {
                setOutput(responseData.error?.stderr);
            }
          setShow(true);
          setSuccess(false);
          setUserOutput(responseData.output)
        }
        setLoader(false);
        return 0;
  };

  const submitHandler = async () => {
    setLoader(true);
    const score = await checkProblem();
    console.log("Score", score);
    
    const url = process.env.REACT_APP_BASE_URL + '/addScore';
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({
            userId: userData?._id,
            contestId,
            score
        })
    });

    const responseData = await response.json();
    if(responseData.success) {
        setLoader(false);
        toast.success("Score updated successfully");
    } else {
        setLoader(false);
        toast.error("Score cannot be updated at the moment");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      setLoggedIn(false);
      navigate('/login');
    } else {
      const fetchData = async () => {
        await fetchUserDetails();
        await fecthProblem();
      }
      fetchData();
      setLoggedIn(true);
    }
    // eslint-disable-next-line
  }, []);

  const [userOutput, setUserOutput] = useState(" ");

  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <>
      {
        loading ? (<div className='h-screen flex items-center justify-center'><Loader /></div>) : (
          <div className='pt-[13vh] pb-10 w-11/12 mx-auto min-h-screen grid grid-cols-2 gap-5 max-ipad:grid-cols-1'>
            {/* prolem statement */}
            <div className='flex-col flex min-h-full gap-y-7 max-ipad:gap-y-5 max-md:gap-y-3'>
              <div className='flex flex-col gap-y-4 max-md:gap-y-3'>
                <h1 className='text-3xl font-bold max-ipad:text-2xl max-md:text-xl max-phone:text-lg'>{problem?.title}</h1>
                <p className={`px-3 py-1 w-fit text-white ${problem?.difficulty === "Easy" ? "bg-green-400" : problem?.difficulty === "Medium" ? "bg-yellow-500" : 'bg-red-800'} rounded-md max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs`}>{problem?.difficulty}</p>
                <p className='max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>{problem?.description}</p>
              </div>

              <div className='flex flex-col gap-y-3'>
                <div className='flex flex-col gap-y-2'>
                  <p className='font-semibold text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Input</p>
                  <pre className='bg-gray-200 p-2 rounded max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>{problem?.input}</pre>
                </div>
                <div className='flex flex-col gap-y-2'>
                  <p className='font-semibold text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Output</p>
                  <pre className='bg-gray-200 p-2 rounded max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>{problem?.output}</pre>
                </div>
              </div>
            </div>  

          {/* editor + input */}
            <div className='flex flex-col h-fit gap-y-7 shadow-lg border-2 py-5 rounded-md justify-between'>
              <div className='flex flex-col gap-y-3'>
                <div className='flex justify-between items-center px-5'>
                  <select name="language"
                      value={language}
                      className='bg-white p-2 rounded outline-none text-black max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'
                      onChange={changeLanguage}
                  >
                      <option value="c++">C++</option>
                      <option value="python">Ptyhon</option>
                  </select>

                  

                  <select name="theme" id="theme"
                      value={theme}
                      className='bg-white p-2 rounded outline-none text-black max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'
                      onChange={changeTheme}
                  >
                      <option value="vs-light">vs-light</option>
                      <option value="vs-dark">vs-dark</option>
                  </select>
              </div>

                <div className=''>
                    <Editor 
                        onChange={changeHandler}
                        value={code}
                        height={'50vh'}
                        theme={theme}
                        language={language}
                        options={{
                            fontSize: "16px",
                            wordWrap: "on"
                        }}
                    />
                </div>

                <div className='w-full flex items-end justify-center gap-x-3 max-phone:flex-col max-phone:gap-y-2 px-5'>
                  <button onClick={runCodeHandler} className='bg-white text-green-400 border border-green-400 px-3 py-2 rounded flex h-full w-fit items-center justify-center gap-x-3 outline-none text-sm max-phone:w-full'><FaPlay /> Run Code</button>
                  <button onClick={submitHandler} className='bg-green-500 text-white text-sm px-3 py-2 rounded flex h-full w-fit items-center justify-center gap-x-3 outline-none max-phone:w-full'>Submit</button>
                </div>
                
              </div>

              <div className='flex flex-col gap-y-3 justify-around h-fit'>

                <div className='flex gap-x-3 px-5'>
                    <button onClick={() => setShowCustom(true)} className={`${showCustom && 'bg-gray-200'} px-4 py-1 rounded max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs max-phone:px-3`}>Custom Test Case</button>
                    <button onClick={() => setShowCustom(false)} className={`${!showCustom && 'bg-gray-200'} px-4 py-1 rounded max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs max-phone:px-3`}>Execute</button>
                </div>

                <div className=''>
                    {
                      loader ? (<Loader />) : (
                          showCustom ? (
                            <div className='flex w-full gap-x-3 items-center h-full px-3 max-ipad:flex-col max-ipad:gap-y-3'>
                                <div className='flex flex-col gap-y-1 bg-[#fff] p-3 h-full w-full rounded'>
                                  <label htmlFor="input" className='font-semibold max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Input</label>
                                  <textarea value={input} onChange={(e) => setInput(e.target.value)} name="input" id="input" className='outline-none resize-none bg-transparent rounded-md border border-black h-full p-2 max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'></textarea>
                                </div>

                                <div className='flex flex-col gap-y-1 bg-[#fff] p-3 h-full w-full rounded'>
                                  <label htmlFor="output" className='font-semibold max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Output</label>
                                  <textarea readOnly value={output} onChange={(e) => setOutput(e.target.value)} name="output" id="output" className={`outline-none border border-black rounded-md bg-transparent resize-none h-full p-2 text-${color} max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs`}></textarea>
                                </div>
                            </div>
                        ) : (
                          <div className='flex h-full flex-col px-5 justify-evenly'>
                            <div className='flex flex-col gap-y-3 items-center justify-between'>
                                <div className='flex flex-col gap-y-2 w-full'>
                                    <p className='max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Your Output</p>
                                    <pre className='p-2 max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs bg-gray-200 text-sm rounded overflow-y-auto'>{userOutput}</pre>
                                </div>

                                <div className='flex flex-col gap-y-2 w-full'>
                                    <p className='max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs'>Desired Output</p>
                                    <pre className='p-2 max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs bg-gray-200 text-sm rounded overflow-y-auto'>{problem?.output}</pre>
                                </div>
                            </div>

                            <div className={`w-full bg-gray-200 ${success ? 'text-green-400' : 'text-red-600'} p-2 text-center text-lg max-ipad:text-[1rem] max-md:text-sm max-phone:text-xs mt-5 font-semibold`}>
                              {
                                !show ? 'Submit your code' : success ? "All test case passed" : "Test Case failed"
                              }
                            </div>
                          </div>
                        )
                      )
                    }
                </div>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}

export default CodingProblem
