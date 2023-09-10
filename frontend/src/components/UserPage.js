import { useContext } from "react";
import "./UserPage.css";
import { AppContext } from "../AppContext";
import UserInformation from './UserInformation'
import Rooms from './Rooms'

const UserPage = () => {
    const { isMobileView } = useContext(AppContext)

    //Returns user information and all rooms booked by user
    return (
        <div className={!isMobileView ? "d-flex flex-row justify-content-center mx-5 my-2 pt-2" : "d-flex flex-column justify-content-center my-2 pt-2"}>
            <div style={!isMobileView ? { width: '10rem', margin: '10px' } : { margin: '25px 0px 25px 25px' }} >
                <UserInformation />
            </div>
            <div>
                <Rooms hideUnbooked={true} />
            </div>
        </div>
    )
}

export default UserPage
