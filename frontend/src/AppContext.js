import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    //Global variables and functions
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([])
    const [visibleRooms, setVisibleRooms] = useState([])

    const handleWindowResize = () => {
        const width = window.innerWidth;
        setIsMobileView(width <= 768); 
    };

    useEffect(() => {
        //Loads user login from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser != null) setUser(JSON.parse(storedUser))

        //Adds resizing event
        window.addEventListener('resize', handleWindowResize);
    }, []);

    return (
        <AppContext.Provider value={{ isMobileView, user, setUser, rooms, setRooms, visibleRooms, setVisibleRooms }}>
            {children}
        </AppContext.Provider>
    );
};