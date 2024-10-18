import React, { useState, useEffect } from 'react';
import { getDatabase, ref, child, get } from 'firebase/database';
import { Home, MessageCircle, User } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import './OrderHistory.css';
import { db } from './firebaseConfig';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = "tanakagnyabanga@gmail.com"; 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const dbRef = ref(getDatabase());
      try {
        const snapshot = await get(child(dbRef, 'History/'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Fetched data:", data);
          const orderList = Object.entries(data)
            .map(([id, order]) => ({
              id, 
              ...order
            }))
            .filter(order => order.email === email);
          setOrders(orderList);
        } else {
          console.log("No order history found.");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <p>Loading order history...</p>;
  }

  const handleReview = (id) => {
    navigate(`/reviews/${id}`);
  };

  const handleRefund = (id) => {
    navigate(`/refund/${id}`);
  };

  return (
    <div className="order-history-container">
      <header className="header">
        <h1>Order History</h1>
      </header>

      <div className="history-content">
        <h2>ORDER HISTORY</h2>
        <div className="orders-container">
          <h3>History</h3>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="order-item">
                <div className="order-details">
                  <img src={order.image} alt={order.Name} className="order-image" />
                  <div>
                    <p>{order.Name}</p>
                    <p>Time: {order.Time}</p>
                  </div>
                </div>
                <div className="order-actions">
                  <button 
                    className="refund-button" 
                    onClick={() => handleRefund(order.id)}
                    disabled={order.Refund === true} 
                  >
                    {order.Refund ? "Pending" : "REFUND"} 
                  </button>
                  <button
                    className="review-button"
                    onClick={() => handleReview(order.id)} 
                    disabled={order.Reviews === true} 
                  >
                    {order.Reviews ? "Reviewed" : "REVIEW"} 
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
          <p>You can only leave a review on your existing purchases.</p>
        </div>
        <button className="back-button">BACK</button>
      </div>

      <footer className="footer">
        <Home />
        <MessageCircle />
        <User />
      </footer>
    </div>
  );
};

export default OrderHistory;
