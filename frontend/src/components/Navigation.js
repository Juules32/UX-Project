import { AppContext } from "../AppContext";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from 'react-router-dom';
import "./Navigation.css";
import Logo from '../resources/logo.png'
import Modal from 'react-bootstrap/Modal';
import './RoomCard.css'
import React, { useState, useContext } from 'react';
import Sorting from './Sorting'

const Navigation = () => {

    const { isMobileView, user, setUser } = useContext(AppContext);

    //Used to handle urls
    const location = useLocation();
    const navigate = useNavigate();

    const [showSortingOptions, setShowSortingOptions] = useState(false);
    const handleCloseSortingOptions = () => setShowSortingOptions(false);
    const handleShowSortingOptions = () => setShowSortingOptions(true);

    //Changes active 'location' in application
    const activeLocation = (tap, location) => {
        if (tap === location.pathname) {
            return "active"
        } else return ""
    }

    //Logs out of system
    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        navigate("/login")
    }

    //Returns a list of navigation buttons styled very differently
    //Depending on whether user is in mobile view
    return (
        <>
            {location.pathname !== "/login" && <>
                {!isMobileView ?
                    <div className="align-content-around d-flex flex-direction-row justify-content-center topmenu shadow-lg bg-white rounded">
                        <img
                            src={Logo}
                            alt="Logo"
                            className="logo"
                        ></img>
                        <Button
                            className={activeLocation("/rooms", location) + " navbutton btn-lg"}
                            href="/rooms"
                        >
                            Rooms
                        </Button>
                        {user != null &&
                            <Button
                                className={activeLocation("/userPage", location) + " navbutton btn-lg"}
                                href="/userPage"
                            >
                                Your Profile
                            </Button>
                        }
                        {user == null ?
                            <Button className=" navbutton btn-lg" href="/login">Login</Button> :
                            <Button className=" navbutton btn-lg" onClick={logout}>Log out</Button>
                        }
                    </div> :
                    <div className="bottom-div">
                        {location.pathname === "/userPage" && <>
                            <Button className="btn-lg bottom-button l-1 shadow" href="/rooms"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                            </svg></Button>
                            <Button className="btn-lg bottom-button l-3 shadow" onClick={logout}>Log out</Button>
                        </>
                        }
                        {(location.pathname === "/rooms" || location.pathname === "/") && (
                            user != null ?
                                <>
                                    <Button className="btn-lg bottom-button l-1 shadow" href="/userPage"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                    </svg></Button>
                                    <Button className="btn-lg bottom-button l-3 shadow" onClick={handleShowSortingOptions}>Sort by</Button>

                                </> :
                                <>
                                    <Button className="btn-lg bottom-button l-1 bigger shadow" href="/login">Login</Button>
                                    <Button className="btn-lg bottom-button l-3 shadow" onClick={handleShowSortingOptions}>Sort by</Button>

                                </>
                        )}
                    </div>
                }
            </>}

            {/* Popup for displaying sorting options */}
            <Modal show={showSortingOptions} onHide={handleCloseSortingOptions}>
                <Modal.Body className='mx-3'>
                    <Sorting type="mobile" />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Navigation;
