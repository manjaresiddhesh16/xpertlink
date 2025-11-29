import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser') || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const fetchProducts = async () => {
    try {
      const url = 'http://localhost:8080/products';
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If backend returns 204 No Content
      if (response.status === 204) {
        console.log('No products (204 from server)');
        setProducts([]);
        return;
      }

      const result = await response.json();
      console.log('Products API result:', result);

      // Try common shapes: [ ... ] or { products: [...] } or { data: [...] }
      const list =
        Array.isArray(result) ? result :
        Array.isArray(result.products) ? result.products :
        Array.isArray(result.data) ? result.data :
        [];

      setProducts(list);
    } catch (err) {
      console.error('Products fetch error:', err);
      handleError(err.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome {loggedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>

      <div style={{ marginTop: '20px' }}>
        {products.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          products.map((item, index) => (
            <ul key={index}>
              <span>{item.name} : {item.price}</span>
            </ul>
          ))
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
