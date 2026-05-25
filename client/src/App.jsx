import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [orders, setOrders] = useState([]);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedRole, setSelectedRole] = useState("user");

  const [userRole, setUserRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    customerEmail: "",
    contactNumber: "",
    paymentMode: "Cash on Delivery",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {

    fetchProducts();

    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

    const role = localStorage.getItem("role");

    if (role) {
      setUserRole(role);
    }

  }, []);

  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "https://e-commerce-application-ix89.onrender.com/api/products"
      );

      setProducts(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  const addToCart = (product) => {

    setCart([...cart, product]);

    alert(`${product.name} added to cart`);
  };

  const removeFromCart = (index) => {

    const updatedCart = [...cart];

    updatedCart.splice(index, 1);

    setCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckoutChange = (e) => {

    setCheckoutData({
      ...checkoutData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewProductChange = (e) => {

    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const addNewProduct = async () => {

    try {

      await axios.post(
        "https://e-commerce-application-ix89.onrender.com/api/products/add",
        newProduct
      );

      alert("Product Added Successfully");

      fetchProducts();

      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: "",
      });

    } catch (error) {

      console.log(error);

      alert("Failed to add product");
    }
  };

  const handleRegister = async () => {

    try {

      await axios.post(
        "https://e-commerce-application-ix89.onrender.com/api/auth/register",
        {
          ...formData,
          role: selectedRole,
        }
      );

      alert("Registration Successful");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setIsLogin(true);

    } catch (error) {

      alert(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "https://e-commerce-application-ix89.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (res.data.user.role !== selectedRole) {

        alert(
          `This account is registered as ${res.data.user.role}`
        );

        return;
      }

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.user.role);

      setUserRole(res.data.user.role);

      alert("Login Successful");

      setIsLoggedIn(true);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {

      alert(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    setIsLoggedIn(false);

    setCart([]);

    setShowCart(false);
    setShowDashboard(false);
    setShowCheckout(false);

    alert("Logged Out");
  };

  const placeOrder = () => {

    const deliveryDate = new Date();

    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const newOrder = {
      items: [...cart],
      total: totalPrice,
      customer: checkoutData.customerName,
      deliveryDate: deliveryDate.toDateString(),
      paymentMode: checkoutData.paymentMode,
    };

    setOrders([...orders, newOrder]);

    alert(
      `Order Placed Successfully!

Estimated Delivery Date:
${deliveryDate.toDateString()}`
    );

    setCart([]);

    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-black text-white p-4 flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          E-Commerce Store
        </h1>

        <div className="flex gap-4">

          {!isLoggedIn ? null : (

            <>
              <button
                onClick={() => {

                  setShowDashboard(!showDashboard);

                  setShowCart(false);

                  setShowCheckout(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
              >
                Logout
              </button>
            </>
          )}

          {userRole === "user" && (

            <button
              onClick={() => {

                setShowCart(!showCart);

                setShowDashboard(false);

                setShowCheckout(false);
              }}
              className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
            >
              Cart ({cart.length})
            </button>
          )}

        </div>

      </nav>

      {!isLoggedIn ? (

        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">

          <h2 className="text-3xl font-bold text-center mb-6">

            {isLogin ? "Login" : "Register"}

          </h2>

          <div className="flex bg-gray-200 rounded-full p-1 mb-6">

            <button
              onClick={() => setSelectedRole("user")}
              className={`flex-1 py-2 rounded-full font-semibold transition-all ${
                selectedRole === "user"
                  ? "bg-black text-white"
                  : "text-black"
              }`}
            >
              User
            </button>

            <button
              onClick={() => setSelectedRole("admin")}
              className={`flex-1 py-2 rounded-full font-semibold transition-all ${
                selectedRole === "admin"
                  ? "bg-black text-white"
                  : "text-black"
              }`}
            >
              Admin
            </button>

          </div>

          {!isLogin && (

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              className="w-full border p-3 rounded mb-3"
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            className="w-full border p-3 rounded mb-3"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            className="w-full border p-3 rounded mb-3"
            onChange={handleChange}
          />

          <button
            onClick={isLogin ? handleLogin : handleRegister}
            className="bg-black text-white w-full py-3 rounded-lg mt-2"
          >
            {isLogin ? `Login as ${selectedRole}` : "Register"}
          </button>

          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-center mt-4 cursor-pointer text-blue-600"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>

        </div>

      ) : (

        <>
          {showDashboard && (

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow mt-6">

              <h2 className="text-3xl font-bold mb-6">
                Dashboard
              </h2>

              {userRole === "admin" && (

                <div className="bg-gray-100 p-6 rounded-xl mb-6">

                  <h3 className="text-2xl font-bold mb-4">
                    Admin Panel
                  </h3>

                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    className="w-full border p-3 rounded mb-3"
                    onChange={handleNewProductChange}
                  />

                  <input
                    type="number"
                    name="price"
                    placeholder="Product Price"
                    value={newProduct.price}
                    className="w-full border p-3 rounded mb-3"
                    onChange={handleNewProductChange}
                  />

                  <input
                    type="text"
                    name="description"
                    placeholder="Product Description"
                    value={newProduct.description}
                    className="w-full border p-3 rounded mb-3"
                    onChange={handleNewProductChange}
                  />

                  <input
                    type="text"
                    name="image"
                    placeholder="Product Image URL"
                    value={newProduct.image}
                    className="w-full border p-3 rounded mb-3"
                    onChange={handleNewProductChange}
                  />

                  <button
                    onClick={addNewProduct}
                    className="bg-black text-white px-6 py-3 rounded"
                  >
                    Add Product
                  </button>

                </div>
              )}

              <h3 className="text-2xl font-semibold mb-4">
                Order History
              </h3>

              {orders.length === 0 ? (

                <p>No orders placed yet.</p>

              ) : (

                orders.map((order, index) => (

                  <div
                    key={index}
                    className="border rounded p-4 mb-4"
                  >

                    <h4 className="font-bold text-lg">
                      Order #{index + 1}
                    </h4>

                    <p>
                      Customer: {order.customer}
                    </p>

                    <p>
                      Payment Mode: {order.paymentMode}
                    </p>

                    <p>
                      Delivery Date: {order.deliveryDate}
                    </p>

                    <p className="font-bold">
                      Total: ₹{order.total}
                    </p>

                  </div>
                ))
              )}

            </div>
          )}

          {showCart && userRole === "user" && (

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-6">

              <h2 className="text-3xl font-bold mb-6">
                Shopping Cart
              </h2>

              {cart.length === 0 ? (

                <p>Your cart is empty</p>

              ) : (

                <>
                  {cart.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-4"
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />

                        <div>

                          <h3 className="font-bold text-lg">
                            {item.name}
                          </h3>

                          <p>₹{item.price}</p>

                        </div>

                      </div>

                      <button
                        onClick={() => removeFromCart(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                  <div className="mt-6">

                    <h3 className="text-2xl font-bold">
                      Total: ₹{totalPrice}
                    </h3>

                    <button
                      onClick={() => {

                        setShowCheckout(true);

                        setShowDashboard(false);
                      }}
                      className="bg-green-600 text-white px-6 py-3 rounded mt-4"
                    >
                      Proceed to Checkout
                    </button>

                  </div>
                </>
              )}

            </div>

          )}

          {showCheckout && userRole === "user" && (

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-6">

              <h2 className="text-3xl font-bold mb-6">
                Checkout
              </h2>

              <input
                type="text"
                name="customerName"
                placeholder="Enter Name"
                className="w-full border p-3 rounded mb-4"
                onChange={handleCheckoutChange}
              />

              <input
                type="email"
                name="customerEmail"
                placeholder="Enter Email"
                className="w-full border p-3 rounded mb-4"
                onChange={handleCheckoutChange}
              />

              <input
                type="text"
                name="contactNumber"
                placeholder="Enter Contact Number"
                className="w-full border p-3 rounded mb-4"
                onChange={handleCheckoutChange}
              />

              <label className="font-bold">
                Payment Mode
              </label>

              <select
                name="paymentMode"
                className="w-full border p-3 rounded mt-2 mb-4"
                onChange={handleCheckoutChange}
              >

                <option>
                  Cash on Delivery
                </option>

                <option>
                  UPI
                </option>

                <option>
                  Credit Card
                </option>

              </select>

              <button
                onClick={placeOrder}
                className="bg-black text-white px-6 py-3 rounded w-full"
              >
                Place Order
              </button>

            </div>

          )}

          {userRole === "user" && (

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {products.map((product) => (

                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-4">

                    <h2 className="text-xl font-bold">
                      {product.name}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {product.description}
                    </p>

                    <p className="text-2xl font-bold text-green-600 mt-2">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black text-white w-full py-2 rounded mt-4 hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

          {userRole === "admin" && (

            <div className="max-w-6xl mx-auto p-8">

              <h2 className="text-4xl font-bold mb-8 text-center">
                Admin Product Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {products.map((product) => (

                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-4">

                      <h2 className="text-xl font-bold">
                        {product.name}
                      </h2>

                      <p className="text-gray-600 mt-2">
                        {product.description}
                      </p>

                      <p className="text-2xl font-bold text-green-600 mt-2">
                        ₹{product.price}
                      </p>

                      <div className="flex gap-3 mt-4">

                        <button
                          onClick={() => {

                            const updatedName = prompt(
                              "Enter new product name",
                              product.name
                            );

                            const updatedPrice = prompt(
                              "Enter new product price",
                              product.price
                            );

                            const updatedDescription = prompt(
                              "Enter new product description",
                              product.description
                            );

                            const updatedImage = prompt(
                              "Enter new product image URL",
                              product.image
                            );

                            if (
                              updatedName &&
                              updatedPrice &&
                              updatedDescription &&
                              updatedImage
                            ) {

                              const updatedProducts = products.map((p) =>

                                p._id === product._id
                                  ? {
                                      ...p,
                                      name: updatedName,
                                      price: updatedPrice,
                                      description: updatedDescription,
                                      image: updatedImage,
                                    }
                                  : p
                              );

                              setProducts(updatedProducts);

                              alert("Product Updated Successfully");
                            }
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {

                            const filteredProducts = products.filter(
                              (p) => p._id !== product._id
                            );

                            setProducts(filteredProducts);

                            alert("Product Deleted Successfully");
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded w-full"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
}

export default App;