import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";
import "./Register.css";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { API } = useAuth(); // Yahan se storeTokenInLS hata diya hai

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();

      if (response.ok) {
        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        toast.success("Registration Successful! Please login.");
        // Token save nahi hoga, user seedha login page par jayega
        navigate("/login");
      } else {
        toast.error(
          res_data.extraDetails ? res_data.extraDetails : res_data.message
        );
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Registration failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container login-grid">
        <div className="register-logo">
          <img
            src="https://img.freepik.com/premium-vector/register-now-speech-bubble-collection-iconlabel-sticker-logo-badge-banner-design-template_359398-2303.jpg"
            alt="register"
          />
        </div>

        <div className="form">
          <h1>Register Form</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your Username."
                value={user.username}
                onChange={handleInput}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email."
                value={user.email}
                onChange={handleInput}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your Phone."
                value={user.phone}
                onChange={handleInput}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your Password."
                value={user.password}
                onChange={handleInput}
                required
              />
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-3 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "react-toastify";
// import "./Register.css"

// const Register = () => {
//   const [user, setUser] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const navigate = useNavigate();
//   const { storeTokenInLS, API } = useAuth();

//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // alert("Registation Successfully");
//     console.log(user);
//     // API call here
//     try {
//       const response = await fetch(`${API}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(user),
//       });
//       const res_data = await response.json();
//       console.log("res from server", res_data);

//       if (response.ok) {
//         // const res_data = await response.json();
//         // console.log("res from server", res_data);
//         storeTokenInLS(res_data.token);
//         // localStorage.setItem("token", res_data.token);
//         setUser({
//           username: "",
//           email: "",
//           phone: "",
//           password: "",
//         })
//         toast.success("Registation Successfully");
//         navigate("/login");
//       } else {
//         alert(res_data.extraDetails ? res_data.extraDetails : res_data.message);

//       }
//       // console.log(response);

//     } catch (error) {
//       console.log("register", error)
//     }
//   }




//   return (
//     <section className="section">
//       <div className="container login-grid">

//         <div className="register-logo">
//           <img
//             src="https://img.freepik.com/premium-vector/register-now-speech-bubble-collection-iconlabel-sticker-logo-badge-banner-design-template_359398-2303.jpg"
//             alt="register"
//           />
//         </div>

//         <div className="form">
//           <h1>Register Form</h1>

//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Enter username"
//                 value={user.username}
//                 onChange={handleInput}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter email"
//                 value={user.email}
//                 onChange={handleInput}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Phone</label>
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Enter phone"
//                 value={user.phone}
//                 onChange={handleInput}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 value={user.password}
//                 onChange={handleInput}
//                 required
//               />
//             </div>

//             <button className="btn">Register</button>
//           </form>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Register;
