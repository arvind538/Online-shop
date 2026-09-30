import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HeaderUp from "./components/HeaderUp/HeaderUp";
import Hero from "./components/Hero/Hero";

import TopProducts from "./components/TopProducts/TopProducts";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import Promotion from "./components/Navbar/Promotion";
import Brand from "./components/Footer/Brand";
import BoxtoBox from "./components/BoxtoBox/BoxtoBox";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorPage from "./Pages/Error";
import Contact from "./Pages/Contact";
import Logout from "./Pages/Logout";
import AdminLayout from "./components/Layouts/Admin-Layout";
import AdminUsers from "./Pages/Admin-Users";
import AdminContacts from "./Pages/Admin-Contacts";
import AdminUpdate from "./Pages/Admin-Update";

import NewProducts from "./Pages/NewProducts";
import Process from "./Pages/Process";
import Electronics from "./Pages/Electronic";
import Service from "./Pages/Service";
import Cart from "./Pages/Cart";
import Cloths from "./Pages/Cloths";
import Mens from "./Pages/Mens";
import Girls from "./Pages/Girls";
import ClaimNow from "./Pages/ClaimNow";
import OrderSuccess from "./Pages/OrderSuccess";
import MyOrders from "./Pages/MyOrders";

import Blog from "./Pages/UsefulLinks/Blog";
import Privacy from "./Pages/UsefulLinks/Privacy";
import Terms from "./Pages/UsefulLinks/Terms";
import Faqs from "./Pages/UsefulLinks/Faqs";
import Security from "./Pages/UsefulLinks/Security";
import Returns from "./Pages/UsefulLinks/Returns";

import ProductsList from "./components/Products/ProductsList";
import Banner from "./components/Banner/Banner";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import Collection from "./Pages/Collection";

// Home Page
const HomePage = () => (
  <>
    <Hero />
    <ProductsList />
    <TopProducts />
    <Banner />
    <Subscribe />
    <BoxtoBox />
    <Testimonials />
    <Promotion />
  </>
);

// Dashboard layout: Header, Navbar, Footer sirf login ke baad dikhenge
const MainLayout = () => (
  <>
    <HeaderUp />
    <Navbar />
    <Outlet />
    <Brand />
    <Footer />
    <Popup />
  </>
);

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 sm:max-w-full">
      <Routes>
        {/* ========== LOGIN / REGISTER (bina login, koi Navbar nahi) ========== */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ========== DASHBOARD (sirf login ke baad) ========== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<NewProducts />} />
            <Route path="/girls" element={<Girls />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/mens" element={<Mens />} />
            <Route path="/cloths" element={<Cloths />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/process" element={<Process />} />
            <Route path="/service" element={<Service />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/claim-now" element={<ClaimNow />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/security" element={<Security />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/collection" element={<Collection />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="users/:id/edit" element={<AdminUpdate />} />
            </Route>

            {/* 404 (bina login wale ko login pe hi bhejega) */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar/Navbar";
// import HeaderUp from "./components/HeaderUp/HeaderUp";
// import Hero from "./components/Hero/Hero";
// import Products from "./components/Products/Products";
// import TopProducts from "./components/TopProducts/TopProducts";
// import Banner from "./components/Banner/Banner";
// import Subscribe from "./components/Subscribe/Subscribe";
// import Testimonials from "./components/Testimonials/Testimonials";
// import Footer from "./components/Footer/Footer";
// import Popup from "./components/Popup/Popup";
// import Promotion from "./components/Navbar/Promotion";
// import Brand from "./components/Footer/Brand";
// import BoxtoBox from "./components/BoxtoBox/BoxtoBox";
// import Login from "./Pages/Login";
// import Register from "./Pages/Register";
// import Error from "./Pages/Error";
// import Contact from "./Pages/Contact";
// import Logout from "./Pages/Logout";
// import AdminLayout from "./components/Layouts/Admin-Layout";
// import AdminUsers from "./Pages/Admin-Users";
// import AdminContacts from "./Pages/Admin-Contacts";
// import AdminUpdate from "./Pages/Admin-Update";

// import AOS from "aos";
// import "aos/dist/aos.css";
// import "./App.css";
// import NewProducts from "./Pages/NewProducts";
// import Process from "./Pages/Process";
// import Electronics from "./Pages/Electronic";
// import Service from "./Pages/Service";
// import Cart from "./Pages/Cart";
// import Cloths from "./Pages/Cloths";
// import Mens from "./Pages/Mens";
// import Girls from "./Pages/Girls";
// import ClaimNow from "./Pages/ClaimNow";



// const App = () => {
//   // const [orderPopup, setOrderPopup] = React.useState(false);

//   // React.useEffect(() => {
//   //   AOS.init({
//   //     offset: 100,
//   //     duration: 800,
//   //     easing: "ease-in-sine",
//   //     delay: 100,
//   //   });
//   //   AOS.refresh();
//   // }, []);

//   return (
//     <div className="bg-white dark:bg-gray-900 dark:text-white duration-200  sm:max-w-full">
//       <HeaderUp />
//       <Navbar />

//       {/* Routes START */}
//       <Routes>

//         {/* Home Page */}
//         <Route
//           path="/"
//           element={
//             <>
//               <Hero />
//               <Products />
//               <TopProducts />
//               <Banner />
//               <Subscribe />
//               <BoxtoBox />
//               <Testimonials />
//               <Promotion />
//             </>
//           }
//         />

//         {/* Login Page */}
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/service" element={<Service />} />
//         <Route path="/products" element={<NewProducts />} />
//         <Route path="/process" element={<Process />} />
//         <Route path="/electronics" element={<Electronics />} />
//         <Route path="/cloths" element={<Cloths />} />
//         <Route path="/mens" element={<Mens />} />
//         <Route path="/girls" element={<Girls />} />
//         <Route path="/claim-now" element={<ClaimNow />} />
//         <Route path="/cart" element={<Cart/>} />
       


//         <Route path="*" element={<Error />} />

//         {/* Admin Routes */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route path="users" element={<AdminUsers />} />
//           <Route path="contacts" element={<AdminContacts />} />
//           <Route path="users/:id/edit" element={<AdminUpdate />} />
//         </Route>

//       </Routes>

//       {/* Routes END */}
//       <Brand />
//       <Footer />
//       <Popup />
//     </div>
//   );
// };

// export default App;
