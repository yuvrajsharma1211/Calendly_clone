import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';


import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import EventTypes from './pages/EventTypes';
import Availability from './pages/Availability';
import Meetings from './pages/Meetings';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <EventTypes />
            </Layout>
          }
        />
        <Route
          path="/availability"
          element={
            <Layout>
              <Availability />
            </Layout>
          }
        />
        <Route
          path="/meetings"
          element={
            <Layout>
              <Meetings />
            </Layout>
          }
        />

        {/* Public / External Booking Page Flows (No Sidebar Sidebar Layout) */}
        <Route path="/book/:slug" element={<BookingPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
