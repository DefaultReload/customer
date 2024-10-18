import React, { useEffect, useState } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import Header from './Header';
import { db } from './firebaseConfig';

const MenuScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Fetch menu items from Firebase
  useEffect(() => {
    const menuRef = ref(db, 'Menu/');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formattedData = Object.entries(data).flatMap(([category, items]) =>
        Object.entries(items).map(([key, item]) => ({ ...item, key }))
      );
      console.log('Fetched menu items:', formattedData); // Debug log
      setMenuItems(formattedData);
    });
  }, []);

  // Fetch the cart count from Firebase
  useEffect(() => {
    const cartRef = ref(db, 'Carts/userId'); // Update 'userId' with the actual user ID logic
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCartCount(data ? Object.keys(data).length : 0);
    });
  }, []);

  // Handle Add to Cart functionality
  const handleAddToCart = (item) => {
    const cartRef = ref(db, 'Carts/userId'); // Update 'userId' with the actual user ID logic
    const existingItemRef = ref(db, `Carts/userId/${item.key}`);

    onValue(existingItemRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newQuantity = data.quantity + 1;
        const newTotalPrice = newQuantity * data.price;

        update(existingItemRef, {
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        }).catch((error) => console.error('Failed to update item in the cart:', error));
      } else {
        push(cartRef, {
          itemName: item.item,
          price: item.price,
          quantity: 1,
          totalPrice: item.price,
        }).catch((error) => console.error('Failed to add item to the cart:', error));
      }
    }, { onlyOnce: true });
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter menu items with a safety check
  const filteredItems = menuItems.filter(item => 
    item.item && item.item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container">
      <Header navigation={navigation} cartCount={cartCount} />

      <input
        type="text"
        className="search-input"
        placeholder="Search items..."
        value={searchText}
        onChange={handleSearch}
      />

      <div className="menu-items">
        {filteredItems.map(item => (
          <div key={item.key} className="menu-item">
            <h4>{item.item}</h4>
            <p>R {item.price}</p>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuScreen;
