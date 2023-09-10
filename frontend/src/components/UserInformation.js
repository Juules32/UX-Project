import { useContext } from "react";
import "./UserInformation.css";
import { AppContext } from "../AppContext";
import Card from 'react-bootstrap/Card';

const UserInformation = () => {
    const { user, isMobileView } = useContext(AppContext);

    //If a user exists, return a Card with relevant user information
    return (
        user != null &&
        <Card style={{ width: '20rem', height: '21rem', margin: '10px' }}>
            <Card.Header className="my-112">
                <h2 className="mt-4 fw-bold fs-2 text-center">User information</h2>
            </Card.Header>
            <Card.Body className=''>
                <p>Name: {user.name}</p>
                <p>Mail: {user.mail}</p>
                <p>Password: ●●●●●●●●</p>
                <p>Type: {user.type}</p>
                <p>
                    {user.bookings.length == 0 ?
                        "You have no bookings" :
                        "Your bookings are shown " +
                        (!isMobileView ? "to the right" : "below")
                    }
                </p>
            </Card.Body>
        </Card>
    )
}

export default UserInformation