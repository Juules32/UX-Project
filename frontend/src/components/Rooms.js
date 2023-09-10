import { useEffect, useContext } from "react";
import RoomCard from "./RoomCard";
import { AppContext } from '../AppContext';
import './Rooms.css'

const Rooms = (props) => {

    const { user, isMobileView, setRooms, visibleRooms, setVisibleRooms } = useContext(AppContext)

    //Used to fetch all rooms with a GET request to the database
    async function fetchRooms(url) {
        const response = await fetch(url, {
            method: "GET",
        });
        return await response.json()
    }

    //Upon page load, set room and visible rooms to data found in database
    useEffect(() => {
        fetchRooms("http://localhost:8080/rooms").then(data => {
            setRooms(data)
            setVisibleRooms(data)
        })
    }, [])

    //Returns a flex-box list of rooms
    return (
        <div>
            <div className={!isMobileView ?
                "d-flex flex-wrap justify-content-center pt-2 ml-200" :
                "d-flex flex-wrap justify-content-center pt-2"
            }>
                {visibleRooms.map(room => <RoomCard
                    hideUnbooked={props.hideUnbooked}
                    key={room.roomid}
                    user={user}
                    room={room}
                />)}
            </div>
        </div>
    );
}

export default Rooms