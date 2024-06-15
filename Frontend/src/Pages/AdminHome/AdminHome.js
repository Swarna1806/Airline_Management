import React, { useState, useEffect } from 'react';
import AdminFlightCard from "../../components/AdminFlightCard/AdminFlightCard"
import axios from 'axios';
import './AdminHome.css';
import FlightFormModal from '../FlightFormModal/FlightFormModal';

const AllFlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = JSON.parse(localStorage.getItem('authorization'));
  console.log(token);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch all flights from the backend API
    axios
     .get('https://https://airline-4.onrender.com/api/flight/getAllflights', {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
     .then((response) => {
        console.log(response.data.flights);
        setFlights(response.data.flights);
      })
     .catch((error) => console.error('Error fetching flights:', error));
  }, [token]); // Add token to the dependency array

  const handleDeleteFlight = async (flightId) => {
    // Send DELETE request to the backend to delete the flight by its ID
    console.log("token:",token)
    const response  = await axios.get(`https://airline-2-z147.onrender.com/api/flight/deleteflight/${flightId}`, {
        headers: {
          Authorization: token,
        },
      })
      console.log(response);
      alert('Flight deleted. Please reload the page again')
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Send the new flight data to the backend
      const response = await axios.post('https://airline-2-z147.onrender.com/api/flight/createflight', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      
      // If the request is successful, update the list of flights in the state
      const newFlight = response.data;
      setFlights((prevFlights) => [...prevFlights, newFlight]);
      alert('Added successfully');
    } catch (error) {
      console.error('Error creating flight:', error);
    }
  };

  return (
    <div className="all-flights">
      <div>
        <span>
          <h1 className="page-title">All Flights</h1>
          <button onClick={handleModalOpen}>Add New Flight</button>
          <FlightFormModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleFormSubmit}/>
        </span>
      </div>
      
      <div className="flight-cards-container">
        <div>
          {flights.map((flight, index) => (
            <AdminFlightCard key={index} flight={flight} onDelete={() => handleDeleteFlight(flight._id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFlightsPage;
