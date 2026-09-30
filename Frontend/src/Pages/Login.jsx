import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { storeTokenInLS, API } = useAuth();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const res_data = await response.json();

            if (response.ok) {
                // 1. Token save karo (AuthContext state + localStorage)
                storeTokenInLS(res_data.token);

                // 2. Form clean karo
                setUser({
                    email: "",
                    password: "",
                });

                // 3. Notification dikhao
                toast.success("Login Successfully");

                // 4. Seedha Home page bhejo
                navigate("/");
            } else {
                toast.error(
                    res_data.extraDetails ? res_data.extraDetails : res_data.message
                );
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Login failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="container login-grid">
                <div className="login-logo">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-svg-download-png-7271013.png"
                        alt="login"
                    />
                </div>

                <div className="form">
                    <h1>Login Form</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your Email."
                                value={user.email}
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
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-3 text-sm text-center">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-orange-500 font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from 'react-toastify';

// const Login = () => {
//     const [user, setUser] = useState({
//         email: "",
//         password: "",
//     });
//     const navigate = useNavigate();
//     const { storeTokenInLS, API } = useAuth();

//     const handleInput = (e) => {
//         const { name, value } = e.target;
//         setUser({ ...user, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log(user);
//         // login API call here

//         try {
//             const response = await fetch(`${API}/api/auth/login`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(user),
//             });
//             const res_data = await response.json();
//             console.log("res from server", res_data);
//             if (response.ok) {
//                 // const res_data = await response.json();
//                 // console.log("res from server", res_data);
//                 // localStorage.setItem("token", res_data.token);
//                 storeTokenInLS(res_data.token);
//                 setUser({
//                     email: "",
//                     password: "",
//                 })
//                 toast.success("Login Successfully");
//                 navigate("/");
//             }
//             else {
//                 toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
//                 // console.log("invalied credentials");
//             }
//             console.log(response);
//         } catch (error) {

//         }

//     };


//     return (
//         <section className="section">
//             <div className="container login-grid">

//                 <div className="login-logo">
//                     <img
//                         src="https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-svg-download-png-7271013.png"
//                         alt="login"
//                     />
//                 </div>

//                 <div className="form">
//                     <h1>Login Form</h1>

//                     <form onSubmit={handleSubmit}>
//                         <div className="form-group">
//                             <label>Email</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 placeholder="Enter email"
//                                 value={user.email}
//                                 onChange={handleInput}
//                                 required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label>Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 placeholder="Enter password"
//                                 value={user.password}
//                                 onChange={handleInput}
//                                 required
//                             />
//                         </div>

//                         <button className="btn">Login</button>
//                     </form>
//                 </div>

//             </div>
//         </section>
//     );
// };

// export default Login;
