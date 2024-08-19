import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import CodingArena from "./components/CodingArena";
import Problem from './components/Problem';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import CodingBattle from './components/CodingBattle';
import ContestPage from './components/ContestPage';
import CodingProblem from './components/CodingProblem';
import CreateContest from './components/CreateContest';

function App() {
  const { setLoggedIn } = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  return (
    <div className="w-full min-h-screen poppins">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/codingArena" element={<CodingArena />} />
        <Route path="/codingArena/:id/:slug" element={<Problem  />} />
        <Route path='/codingBattleground' element={<CodingBattle />} />
        <Route path='/contest/:id' element={<ContestPage />} />
        <Route path='/contest/:contestId/problem/:id' element={<CodingProblem />} />
        <Route path='/createContest/:id' element={<CreateContest />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='*' element={<h1 className='text-3xl font-semibold text-center pt-[13vh] capitalize'>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
