import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

function AppContextProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        const url = process.env.REACT_APP_BASE_URL + '/getUser';
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });

        const responseData = await response.json();
        
        if(responseData.success) {
            setUserData(responseData.user);
        }
        else if(responseData.message === "Invalid token") {
            localStorage.removeItem('token');
            setLoggedIn(false);
            navigate('/login');
        } 
        else {
            console.log(responseData.message);
        }
    };

    const value = {
        loading, setLoading, userData, setUserData, loggedIn, setLoggedIn, fetchUserDetails
    };

    return <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
}

export default AppContextProvider;