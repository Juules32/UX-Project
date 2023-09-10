import './BookingBar.css'
import { AppContext } from '../AppContext';
import React, { useContext, useEffect, useRef } from 'react';

const BookingBar = (props) => {
    const room = props.room
    const { user } = useContext(AppContext)

    //First and last hour in range of reservable hours
    const firstHour = 8;
    const lastHour = 18;
    const totalHours = lastHour - firstHour;

    //Updates reference value of currently selected start and end hour
    const setSelectedStartHour = hour => props.selectedStartHourRef.current = hour
    const setSelectedEndHour = hour => props.selectedEndHourRef.current = hour

    //canvas is set up
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        //Constants used for spacing and styling
        const startEndSpace = 14;
        const barlength = canvas.width - 2 * startEndSpace;
        const spaceBetweenHours = barlength / totalHours;
        const barY = canvas.height - 10

        //The hour currently closest to the mouse
        let downClosestHour = -1

        //Whether user is currently selected start or end hour
        let selectingStart = false;
        let selectingEnd = false;

        //Redraws the booking bar
        function redraw() {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //Draws hour marks
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 1
            for (let i = 0; i <= totalHours; i++) {
                ctx.beginPath();
                ctx.moveTo(startEndSpace + i * spaceBetweenHours, barY - 10);
                ctx.lineTo(startEndSpace + i * spaceBetweenHours, barY + 3);
                ctx.stroke();
            }

            //Draws green bar across
            ctx.strokeStyle = "#93e36c"
            ctx.lineWidth = 6
            ctx.beginPath();
            ctx.moveTo(startEndSpace - 1, barY);
            ctx.lineTo(canvas.width - startEndSpace + 1, barY);
            ctx.stroke();

            //Draws occupied hours in red from bookings
            ctx.strokeStyle = "#f26161"
            ctx.lineWidth = 6
            room.bookings.forEach(number => {
                if (number >= firstHour && number < lastHour) {
                    const x = startEndSpace + (number - firstHour) * spaceBetweenHours
                    ctx.beginPath();
                    ctx.moveTo(x, barY);
                    ctx.lineTo(x + spaceBetweenHours, barY);
                    ctx.stroke();
                }

            });

            //Draws yellow occupancy bar and pointers
            if (user != null) {
                if (!props.bookedByUser) {
                    evaluateBooking()
                    drawPointers(props.selectedStartHourRef.current, props.selectedEndHourRef.current)
                }
                else {
                    console.log(user)
                    const foundBooking = user.bookings.find(entry => entry.roomid === room.roomid)
                    drawPointers(foundBooking.start, foundBooking.end)
                }
            }
        }

        //Evaulates whether currently selected booking is valid
        function evaluateBooking() {
            for (let i = props.selectedStartHourRef.current; i < props.selectedEndHourRef.current; i++) {
                if (room.bookings.includes(i)) return props.setValidBooking(false)
            }
            props.setValidBooking(true)
        }

        //Draws the pointers at currently selected interval
        function drawPointers(ref1, ref2) {

            const x1 = startEndSpace + (ref1 - firstHour) * spaceBetweenHours
            const x2 = startEndSpace + (ref2 - firstHour) * spaceBetweenHours

            drawYellowLine(x1, x2)
            drawPointer(ref1)
            drawPointer(ref2)
            ctx.font = "14px Arial";
            ctx.fillText(ref1, x1 - 8, barY - 20);
            ctx.fillText(ref2, x2 - 8, barY - 20);
        }

        function drawPointer(hour) {
            let pointerX = startEndSpace + (hour - firstHour) * spaceBetweenHours;
            let pointerY = barY - 7

            ctx.fillStyle = "#555555"
            ctx.lineWidth = 1
            ctx.beginPath();
            ctx.moveTo(pointerX - 5, pointerY - 10);
            ctx.lineTo(pointerX + 5, pointerY - 10);
            ctx.lineTo(pointerX + 5, pointerY + 5);
            ctx.lineTo(pointerX, pointerY + 10);
            ctx.lineTo(pointerX - 5, pointerY + 5);
            ctx.lineTo(pointerX - 5, pointerY - 10);
            ctx.fill();
        }

        function drawYellowLine(x1, x2) {
            ctx.strokeStyle = "#eefa5e"
            ctx.lineWidth = 6
            ctx.beginPath();
            ctx.moveTo(x1, barY);
            ctx.lineTo(x2, barY);
            ctx.stroke();
        }

        //When pointer is pressed down, updates selecting start or end hour depending on downClosestHour
        canvas.addEventListener('touchstart', (e) => {
            const rect = canvas.getBoundingClientRect()
            const downX = e.touches[0].clientX - rect.left
            handlePointerDown(downX)
        });
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect()
            const downX = e.x - rect.left
            handlePointerDown(downX)
        });
        const handlePointerDown = (downX) => {
            downClosestHour = Math.round((downX - startEndSpace) / spaceBetweenHours) + firstHour
            if (downClosestHour == props.selectedStartHourRef.current) selectingStart = true
            else if (downClosestHour == props.selectedEndHourRef.current) selectingEnd = true
        }

        //When pointer is moved, selected start or end hour updates
        canvas.addEventListener('touchmove', (e) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.touches[0].clientX - rect.left
            handlePointerMove(x)
        });
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.x - rect.left
            handlePointerMove(x)
        });
        const handlePointerMove = (x) => {
            downClosestHour = Math.round((x - startEndSpace) / spaceBetweenHours) + firstHour
            if (selectingStart && downClosestHour < props.selectedEndHourRef.current && downClosestHour >= firstHour) {
                setSelectedStartHour(downClosestHour)
            }
            else if (selectingEnd && downClosestHour > props.selectedStartHourRef.current && downClosestHour <= lastHour) {
                setSelectedEndHour(downClosestHour)
            }
            redraw()
        }

        //When pointer is lifted, values are reset
        window.addEventListener('touchend', (e) => {
            handlePointerLift()
        });
        window.addEventListener('mouseup', (e) => {
            handlePointerLift()
        });
        const handlePointerLift = () => {
            downClosestHour = -1
            selectingStart = false
            selectingEnd = false
        }

        redraw()
    }, [props.bookedByUser]);

    //Returns canvas to be displayed in room card
    return (<canvas className="my-n20" ref={canvasRef} width='286' height='40' />)
}

export default BookingBar