import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import { Line, } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { auth, saveDelivery, fetchDeliveries, updateDelivery, deleteDelivery } from './firebaseFunction';
import AuthComponent from './AuthComponent';
import NavBar from './NavBar'; // Import the NavBar component
import { onAuthStateChanged } from 'firebase/auth';

import './App.css'; // Import custom CSS

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function App() {
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState('');
  const [deliveryList, setDeliveryList] = useState([]);
  const [date, setDate] = useState('');
  const [editModalShow, setEditModalShow] = useState(false);
  const [editDelivery, setEditDelivery] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  // Bar Chart Data

// Bar Chart Options



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the current user in state
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getDeliveries = async () => {
      try {
        const data = await fetchDeliveries();
        setDeliveryList(data || []);
      } catch (e) {
        console.error("Error fetching deliveries:", e.message);
        setError("Error fetching deliveries. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getDeliveries();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!deliveries || deliveries <= 0) {
      setError('Please enter a valid number of deliveries.');
      return;
    }

    const entryDate = date || new Date().toLocaleDateString();
    try {
      await saveDelivery(deliveries, entryDate);
      setDeliveryList([...deliveryList, { deliveries, earnings: deliveries * 20, date: entryDate }]);
      setDeliveries('');
      setDate('');
    } catch (e) {
      console.error("Error saving delivery:", e.message);
      setError("Error saving delivery. Please try again.");
    }
  };

  const handleEditShow = (item) => {
    setEditModalShow(true);
    setEditDelivery(item.deliveries);
    setEditDate(item.date);
    setEditId(item.id);
  };

  const handleEditClose = () => setEditModalShow(false);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDelivery(editId, editDelivery, editDate);
      const updatedList = deliveryList.map((item) =>
        item.id === editId ? { ...item, deliveries: editDelivery, date: editDate, earnings: editDelivery * 20 } : item
      );
      setDeliveryList(updatedList);
      handleEditClose();
    } catch (e) {
      console.error("Error updating delivery:", e.message);
      setError("Error updating delivery. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDelivery(id);
      setDeliveryList(deliveryList.filter(item => item.id !== id));
    } catch (e) {
      console.error("Error deleting delivery:", e.message);
      setError("Error deleting delivery. Please try again.");
    }
  };

  const handleDayOff = async (date) => {
    const dayOffEntry = { deliveries: 0, earnings: 0, date };
    try {
      await saveDelivery(0, date);
      setDeliveryList([...deliveryList, dayOffEntry]);
    } catch (e) {
      console.error("Error saving day off entry:", e.message);
      setError("Error saving day off entry. Please try again.");
    }
  };

  const previousMonthReport = () => {
    const previousMonthData = deliveryList.filter(item => {
      const date = new Date(item.date);
      const currentDate = new Date();
      return date.getMonth() === currentDate.getMonth() - 1 && date.getFullYear() === currentDate.getFullYear();
    });
    return previousMonthData;
  };

  const totalDeliveries = deliveryList.reduce((acc, item) => acc + parseInt(item.deliveries), 0);
  const totalEarnings = deliveryList.reduce((acc, item) => acc + parseInt(item.earnings), 0);

  const chartData = {
    labels: deliveryList.map(item => item.date),
    datasets: [
      {
        label: 'Deliveries',
        data: deliveryList.map(item => item.deliveries),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
      {
        label: 'Earnings',
        data: deliveryList.map(item => item.earnings),
        fill: false,
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.100,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="spinner-border text-primary mx-50 main-loader " role="status">
        
      </div>
    );
  }

  if (!user) {
    // যদি ইউজার লগইন না থাকে, শুধু লগইন ফর্ম দেখাবে
    return (
      <div className="auth-container">
        <AuthComponent /> {/* Login form */}
      </div>
    );
  }

  // যদি ইউজার লগইন থাকে, নেভবার এবং কন্টেন্ট দেখাবে
  return (
    <>
      <NavBar user={user} /> {/* Show Navbar when logged in */}

      <div className="App">
        <h1>Welcome to Delivery Count</h1>

        <div className="container mt-5">
          <h1>Delivery Entry</h1>
        
          <form onSubmit={handleSubmit} className="mb-4">
            {error && <Alert variant="danger">{error}</Alert>}
        
            <label className="form-label">
              Number of Deliveries:
              <input
                type="number"
                className="form-control"
                value={deliveries}
                onChange={(e) => setDeliveries(e.target.value)}
                required
              />
            </label>
          
            <label className="form-label mt-3 mx-3">
              Select Date (Optional):
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          
            <button type="submit" className="btn btn-success mx-2 mb-3">
              Submit
            </button>
          </form>

          <Button variant="secondary" className="mb-4 mx-3" onClick={() => console.log(previousMonthReport())}>
            Show Previous Month Report
          </Button>
          <Button className="day-off-btn mx-3 mb-4 btn-warning" onClick={() => handleDayOff(new Date().toLocaleDateString())}>
            Day Off
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Delivery Count</th>
                <th>Earnings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryList.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.deliveries}</td>
                  <td>{item.earnings} Taka</td>
                  <td>
                    <Button variant="primary" className="mx-2 mt-2" onClick={() => handleEditShow(item)}>
                      Edit
                    </Button>
                    <Button variant="danger" className="mx-2 mt-2" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Line data={chartData} options={chartOptions} />
          // Rendering Bar Chart



          <div className="mt-4">
            <h4>Total Deliveries This Month: {totalDeliveries}</h4>
            <h4>Total Earnings This Month: {totalEarnings} Taka</h4>
          </div>

          <Modal show={editModalShow} onHide={handleEditClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Delivery Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleEditSubmit}>
                <label>
                  Number of Deliveries:<input
                    type="number"
                    className="form-control"
                    value={editDelivery}
                    onChange={(e) => setEditDelivery(e.target.value)}
                  />
                </label>

                <label className="mt-3">
                  Select Date:
                  <input
                    type="date"
                    className="form-control"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </label>

                <button type="submit" className="btn btn-success mt-3">
                  Save Changes
                </button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default App;