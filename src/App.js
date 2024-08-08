import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ProductDashboard from "./components/ProductDashboard/ProductDashboard";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import Cart from "./components/Cart/cart.jsx";
import Checkout from "./components/Checkout/checkout.jsx";
import CCAvenuePayment from "./components/CCAAvenuePayment/CCAAvenuePayment";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home.jsx";
import ProfileComponent from "./components/ProfileComponent/ProfileComponent.jsx";
import "./App.css";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy.js"
import Review from "./components/Review/Review.jsx"
import { Navigate } from "react-router-dom";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8085/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log(data);
      setProducts(data); // Assuming data is an array of products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productId === product.productId
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const incrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity }
          : item
      )
    );
  };

  const checkout = () => {
    console.log("Proceed to checkout");
  };

  const handleCheckout = () => {
    console.log("Order placed", cart);
    setCart([]);
  };

  const updateProductList = () => {
    fetchProducts(); // Call fetchProducts to refresh the product list
  };

  const calculateItemCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const handleUserUpdate = (userData) => {
    setUser(userData);
    navigate('/profile');
  };

  return (
    <div className="app">
      <Navbar cartCount={calculateItemCount()} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup onUserUpdate={handleUserUpdate} />} />
        <Route
          path="/products"
          element={
            <ProductDashboard
              products={products}
              addToCart={addToCart}
              updateProductList={updateProductList}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              checkout={checkout}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
          }
        />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} handleCheckout={handleCheckout} />}
        />
        <Route
          path="/ccavenue-payment"
          element={<CCAvenuePayment cart={cart} />}
        />
        <Route path="/profile" element={user ? <ProfileComponent user={user} /> : <Navigate to="/login" />} />
        <Route path="/privacypolicy" element={PrivacyPolicy}/>
        <Route path="/reviews" element={<Review />} />
      </Routes>
      <Footer />
      {/* <p>Learn React</p> Add this line temporarily */}
    </div>
  );
};

export default App;
