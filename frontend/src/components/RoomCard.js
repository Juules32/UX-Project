import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import './RoomCard.css'
import Aud from '../resources/aud.png'
import Skybox from '../resources/skybox.png'
import Default from '../resources/default.png'
import { AppContext } from '../AppContext';
import React, { useState, useContext, useEffect, useRef } from 'react';
import BookingBar from './BookingBar'

const RoomCard = (props) => {
    const room = props.room
    const { isMobileView, user, setUser } = useContext(AppContext)

    const [bookedByUser, setBookedByUser] = useState(hasBooking(room.roomid))

    //The currently selected start and end hour is set as current hour
    const selectedStartHourRef = useRef(new Date().getHours())
    const selectedEndHourRef = useRef(new Date().getHours() + 1)

    //"More" button visibility false by default
    const [showMore, setShowMore] = useState(false);

    const handleCloseMore = () => setShowMore(false);
    const handleShowMore = () => setShowMore(true);

    //"Confirm Booking" button visibility false by default
    const [showConfirmBooking, setShowConfirmBooking] = useState(false);

    const handleCloseConfirmBooking = () => setShowConfirmBooking(false);
    const handleShowConfirmBooking = () => setShowConfirmBooking(true);

    //Used to add a booking to database
    const handleConfirmBooking = async () => {
        try {
            //Sends a PUT request to the server with user data
            const response = await fetch('http://localhost:8080/user/bookings', {
                method: 'PUT',
                body: JSON.stringify({
                    user: user,
                    roomid: room.roomid,
                    startHour: selectedStartHourRef.current,
                    endHour: selectedEndHourRef.current
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                //Parses the response JSON
                const data = await response.json();

                //Changes current user
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
                setBookedByUser(true)
                console.log('Added Booking Successfully!');
            } else {
                console.error('Error logging in:', response.status);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }

        handleCloseConfirmBooking()
    }

    //"Confirm Booking" button visibility false by default
    const [showConfirmRemoval, setShowConfirmRemoval] = useState(false);

    const handleCloseConfirmRemoval = () => setShowConfirmRemoval(false);
    const handleShowConfirmRemoval = () => setShowConfirmRemoval(true);

    //Used to remove booking from database
    const handleConfirmRemoval = async () => {
        try {
            //Sends a DELETE request to the server with userData
            const response = await fetch('http://localhost:8080/user/bookings', {
                method: 'DELETE',
                body: JSON.stringify({
                    user: user,
                    roomid: room.roomid,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                //Parses the response JSON
                const data = await response.json();

                //Changes current user
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
                setBookedByUser(false)
                console.log('Removed Booking Successfully!');
            } else {
                console.error('Error logging in:', response.status);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }

        handleCloseConfirmRemoval()
    }

    //Determines which image to use for which type of room
    function renderSwitch(param) {
        switch (param) {
            case 'Auditorium':
                return Aud;
            case 'Skybox':
                return Skybox
            default:
                return Default;
        }
    }

    //Used to determine whether currently selected booked interval is valid
    let [validBooking, setValidBooking] = useState(true)

    //Used to determine whether user has already booked a room
    function hasBooking(id) {
        if (user != null) {
            for (let i = 0; i < user.bookings.length; i++) {
                if (user.bookings[i].roomid == id) return true
            }
        }
        return false
    }

    //Reusable snippets of prop information
    const htmlImportantRoomInformation = <>
        <div className="m-0 fs-6 row">
            <p className='mb-2'>Type: {room.type}</p>
            <p className='mb-2'>Capacity: {room.capacity}</p>
        </div>
    </>
    const htmlBonusRoomInformation = <>
        <div className="m-0 fs-6 row">
            <p className='mb-2'>Audio-Video: {room.audioVideo ? "Yes" : "No"}</p>
            <p className='mb-2'>Blackboards: {room.blackboard ? "Yes" : "No"}</p>
        </div>
    </>

    return <>
        {!(props.hideUnbooked && !bookedByUser) && <>
            <Card style={isMobileView ? { width: '20rem', height: '17rem', margin: '10px' } : { width: '20rem', height: '21rem', margin: '10px' }}>
                {/* Nicely styled header with custom img */}
                <Card.Header className=''>
                    <Card.Img
                        src={renderSwitch(room.type)}
                        alt="Card image"
                        className='img-fluid'
                    />
                    <Card.ImgOverlay className='pos'>
                        <p className='mb-1 border-0 fw-bold fs-1 text-center text-light title-shadow'>{room.name}</p>
                    </Card.ImgOverlay>
                </Card.Header>

                <Card.Body className=''>
                    {/* Shows more information if in desktop view */}
                    {!isMobileView && (
                        htmlImportantRoomInformation
                    )}
                    <div className="m-0 row p-0">
                        {user != null ?
                            (bookedByUser ?
                                <p className='mb-2'>Your booking:</p> :
                                <p className='mb-2'>Select your booking:</p>
                            ) :
                            <p className='mb-2'>Availability:</p>
                        }
                    </div>
                    <BookingBar
                        selectedStartHourRef={selectedStartHourRef}
                        selectedEndHourRef={selectedEndHourRef}
                        bookedByUser={bookedByUser}
                        room={room}
                        setValidBooking={setValidBooking}
                    />
                </Card.Body>

                <Card.Footer className='d-flex justify-content-center'>
                    {/* Always shows "More" button displaying more information */}
                    <Button onClick={handleShowMore} variant='outline-dark' className='btn-lg mx-1'>More</Button>
                    {
                        user != null && (
                            //If roomname is already booked by user, displays "Remove Booking" button
                            bookedByUser ?
                                <Button variant='outline-danger' className='btn-lg mx-1' onClick={handleShowConfirmRemoval}>Remove Booking</Button> :

                                //Otherwise, displays "Book" button that is disabled depending on whether current selection is valid
                                validBooking && !(user.type != "Teacher" && room.teacherOnly) ?
                                    <Button variant='outline-success' className='btn-lg mx-1' onClick={handleShowConfirmBooking}>Book</Button> :
                                    <Button disabled={true} variant='outline-dark' className='btn-lg mx-1'>Book</Button>
                        )
                    }
                </Card.Footer>
            </Card>

            {/* Popup displaying more information */}
            <Modal show={showMore} onHide={handleCloseMore}>
                <Modal.Header closeButton>
                    <Modal.Title className='mx-3'>{room.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{htmlImportantRoomInformation} {htmlBonusRoomInformation}</Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="outline-dark" onClick={handleCloseMore}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Popup for confirming booking */}
            <Modal show={showConfirmBooking} onHide={handleCloseConfirmBooking}>
                <Modal.Header closeButton>
                    <Modal.Title className='mx-3'>Confirm Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body className='mx-3'>
                    Are you sure you want to book {room.name} from {selectedStartHourRef.current}:00 to {selectedEndHourRef.current}:00?
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="outline-success" className="btn-lg" onClick={handleConfirmBooking}>Confirm</Button>
                </Modal.Footer>
            </Modal>

            {/* Popup for confirming removal */}
            <Modal show={showConfirmRemoval} onHide={handleCloseConfirmRemoval}>
                <Modal.Header closeButton>
                    <Modal.Title className='mx-3'>Confirm Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body className='mx-3'>
                    Are you sure you want to remove your booking of {room.name}?
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="outline-danger" className="btn-lg" onClick={handleConfirmRemoval}>Remove Booking</Button>
                </Modal.Footer>
            </Modal>
        </>}
    </>
}

export default RoomCard