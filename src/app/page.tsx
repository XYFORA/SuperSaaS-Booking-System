"use client";
import { useEffect, useRef, useState } from "react";
import SuperSaaSWidget from "@/components/Widget";

type Booking = {
    id: number;
    start: string;
    finish: string;
    full_name: string;
    email: string;
};

const App = () => {

    const scheduleUrl = "https://www.supersaas.nl/schedule/Ahmed_Saleem_Shaikh/Testing_Schedule_Appointment";

    const popupRef = useRef<Window | null>(null);

    const [bookings, setBookings] = useState<Booking[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                const res = await fetch("/api/schedules", { cache: "no-store" });

                const data = await res.json();

                setBookings(data[0]?.bookings || []);

            } catch (error) {

                console.error("Failed To Load Bookings", error);

            } finally {

                setLoading(false);

            }

        };

        fetchBookings();

    }, []);

    const openBookingWidget = () => {

        const width = 600;

        const height = 800;

        const left = (window.innerWidth - width) / 2;

        const top = (window.innerHeight - height) / 2;

        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.focus();
            return;
        }

        popupRef.current = window.open(
            scheduleUrl,
            "BookingWidget",
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
        );

    };

    return (
        <div className="flex flex-col items-center gap-8 min-h-screen p-8">
            <h2 className="text-2xl font-bold">Book Testing Appointment</h2>

            <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition shadow-lg"
                onClick={openBookingWidget}
            >
                Select Appointment
            </button>

            <SuperSaaSWidget />

            <div className="w-full max-w-4xl">
                <h3 className="text-xl font-semibold mb-4">
                    Booked Appointments
                </h3>

                {loading ? (<p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p>No Bookings Found</p>
                ) : (
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-neutral-900 text-white">
                            <tr>
                                <th className="border px-4 py-2 text-left">
                                    Name
                                </th>

                                <th className="border px-4 py-2 text-left">
                                    Email
                                </th>

                                <th className="border px-4 py-2 text-left">
                                    Start
                                </th>

                                <th className="border px-4 py-2 text-left">
                                    End
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="border px-4 py-2">
                                        {booking.full_name}
                                    </td>

                                    <td className="border px-4 py-2">
                                        {booking.email}
                                    </td>

                                    <td className="border px-4 py-2">
                                        {new Date(booking.start).toLocaleString()}
                                    </td>

                                    <td className="border px-4 py-2">
                                        {new Date(booking.finish).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default App;