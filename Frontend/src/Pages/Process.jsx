import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import {
  FaCreditCard, FaMoneyBillWave, FaWallet, FaMobileAlt, FaTag, FaLock,
  FaCheckCircle, FaTimes, FaMapMarkerAlt, FaHome, FaBriefcase, FaShoppingBag,
} from "react-icons/fa";
import { toast } from "react-toastify";

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: <FaCreditCard className="text-blue-500 text-xl" />, desc: "Visa, Mastercard, RuPay" },
  { id: "upi", label: "UPI Payment", icon: <FaMobileAlt className="text-green-500 text-xl" />, desc: "GPay, PhonePe, Paytm, BHIM" },
  { id: "wallet", label: "Wallet", icon: <FaWallet className="text-purple-500 text-xl" />, desc: "Paytm, Amazon Pay, Mobikwik" },
  { id: "cod", label: "Cash on Delivery", icon: <FaMoneyBillWave className="text-orange-500 text-xl" />, desc: "Pay when delivered" },
];

const upiApps = [
  { id: "gpay", name: "Google Pay", color: "bg-blue-500" },
  { id: "phonepe", name: "PhonePe", color: "bg-purple-600" },
  { id: "paytm", name: "Paytm", color: "bg-sky-500" },
];

const wallets = [
  { id: "paytm", name: "Paytm Wallet", color: "bg-sky-500" },
  { id: "amazonpay", name: "Amazon Pay", color: "bg-yellow-500" },
  { id: "mobikwik", name: "Mobikwik", color: "bg-blue-700" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const ADDRESS_TYPES = [
  { id: "Home", icon: <FaHome /> },
  { id: "Work", icon: <FaBriefcase /> },
  { id: "Other", icon: <FaMapMarkerAlt /> },
];

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  postalCode: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
  addressType: "Home",
};

const EMPTY_CARD = { number: "", name: "", expiry: "", cvv: "" };

const REQUIRED_FIELDS = ["fullName", "phone", "postalCode", "address", "city", "state"];

const validateField = (name, value) => {
  const v = String(value || "").trim();
  switch (name) {
    case "fullName":
      if (v.length < 3) return "Please enter your full name (at least 3 characters)";
      if (!/^[A-Za-z .'-]+$/.test(v)) return "Name can only contain letters";
      return "";
    case "phone":
      return /^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number";
    case "postalCode":
      return /^[1-9]\d{5}$/.test(v) ? "" : "Enter a valid 6-digit pincode";
    case "address":
      return v.length >= 5 ? "" : "Please enter your house no., street and area";
    case "city":
      return v.length >= 2 ? "" : "Please enter your city";
    case "state":
      return v ? "" : "Please select your state";
    default:
      return "";
  }
};

// Label + error wrapper (defined outside so inputs don't lose focus while typing)
const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    ) : (
      hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>
    )}
  </div>
);

const Process = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: globalCart, token, clearCart, API } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [paying, setPaying] = useState(false);

  // Address form (always starts empty, and is cleared again after a successful order)
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pinLoading, setPinLoading] = useState(false);
  const fieldRefs = useRef({});

  // Test gateway modal
  const [showModal, setShowModal] = useState(false); // mounted
  const [modalVisible, setModalVisible] = useState(false); // drives the animation
  const [step, setStep] = useState("form"); // form | processing
  const [modalError, setModalError] = useState("");
  const [card, setCard] = useState(EMPTY_CARD);
  const [upiApp, setUpiApp] = useState("");
  const [upiId, setUpiId] = useState("");
  const [wallet, setWallet] = useState("");

  const closeTimer = useRef(null);
  const mounted = useRef(true);

  const cart = location.state && location.state.length > 0 ? location.state : globalCart;

  // ---- Price calculation ----
  const subtotal = cart?.reduce((t, i) => t + i.price * (i.quantity || 1), 0) || 0;
  const discount = subtotal > 499 ? 49 : 0;
  const totalPrice = subtotal - discount;
  const totalItems = cart?.reduce((t, i) => t + (i.quantity || 1), 0) || 0;
  const amountForDiscount = Math.ceil(500 - subtotal);

  // ---- Lifecycle helpers ----
  useEffect(() => {
    mounted.current = true;
    // old versions saved the address in localStorage; clear it so the form is always fresh
    try {
      localStorage.removeItem("shippingAddress");
    } catch {
      /* ignore storage errors */
    }
    return () => {
      mounted.current = false;
      clearTimeout(closeTimer.current);
    };
  }, []);

  // Esc closes the gateway, and the page behind it doesn't scroll while it is open
  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && step !== "processing") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, step]);

  // ---- Modal open / close (smooth) ----
  const openModal = () => {
    clearTimeout(closeTimer.current);
    setModalError("");
    setStep("form");
    setShowModal(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  };

  const hideModal = () => {
    setModalVisible(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShowModal(false), 200);
  };

  const closeModal = () => {
    if (step === "processing") return;
    hideModal();
    toast.info("Payment cancelled");
  };

  // ---- Reset everything after a successful order ----
  const resetCheckout = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setCard(EMPTY_CARD);
    setUpiApp("");
    setUpiId("");
    setWallet("");
    setModalError("");
    setSelectedMethod("upi");
  };

  // ---- Address form handlers ----
  const lookupPincode = async (pin) => {
    setPinLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const office = data?.[0]?.PostOffice?.[0];

      if (data?.[0]?.Status === "Success" && office) {
        setForm((prev) => ({
          ...prev,
          city: office.District || prev.city,
          state: INDIAN_STATES.includes(office.State) ? office.State : prev.state,
        }));
        setErrors((prev) => ({ ...prev, postalCode: "", city: "", state: "" }));
      } else {
        setErrors((prev) => ({ ...prev, postalCode: "Pincode not found. Please check and try again" }));
      }
    } catch {
      // Network issue: user can fill city and state manually
    } finally {
      if (mounted.current) setPinLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "phone") value = value.replace(/\D/g, "").slice(0, 10);
    if (name === "postalCode") value = value.replace(/\D/g, "").slice(0, 6);

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "postalCode" && value.length === 6) lookupPincode(value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!REQUIRED_FIELDS.includes(name)) return;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAddress = () => {
    const e = {};
    REQUIRED_FIELDS.forEach((f) => {
      const msg = validateField(f, form[f]);
      if (msg) e[f] = msg;
    });
    setErrors(e);

    const firstError = REQUIRED_FIELDS.find((f) => e[f]);
    if (firstError) fieldRefs.current[firstError]?.focus();

    return !firstError;
  };

  const inputClass = (name) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 ${errors[name]
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-200 dark:border-gray-700 focus:ring-orange-400"
    }`;

  // ---- Save order to backend ----
  const saveOrder = async (paymentLabel) => {
    const orderItems = cart.map((item) => ({
      name: item.title || item.name,
      qty: item.quantity || 1,
      image: item.image || item.img || "",
      price: item.price,
    }));

    const shippingAddress = {
      fullName: form.fullName.trim(),
      phone: form.phone,
      address: form.address.trim(),
      landmark: form.landmark.trim(),
      city: form.city.trim(),
      state: form.state,
      postalCode: form.postalCode,
      addressType: form.addressType,
    };

    const res = await fetch(`${API}/api/orders/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderItems,
        shippingAddress,
        paymentMethod: paymentLabel,
        totalPrice, // amount after discount
        itemsPrice: subtotal,
        discount,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not place the order");
    return data;
  };

  const finishSuccess = (msg) => {
    toast.success(msg);
    resetCheckout(); // form + payment fields go back to empty
    setModalVisible(false);
    setShowModal(false);
    if (clearCart) clearCart();
    navigate("/myorders", { replace: true });
  };

  // ---- Pay button ----
  const handlePayment = async () => {
    if (paying) return;

    if (!token) {
      toast.error("Please log in to place an order!");
      navigate("/login");
      return;
    }
    if (!validateAddress()) {
      toast.error("Please fill in the delivery address correctly");
      return;
    }

    // COD: place the order directly
    if (selectedMethod === "cod") {
      setPaying(true);
      try {
        await saveOrder("Cash on Delivery");
        finishSuccess("Order placed! Cash on Delivery");
      } catch (err) {
        console.error("COD Error:", err);
        toast.error(err.message || "Server connection failed!");
      } finally {
        if (mounted.current) setPaying(false);
      }
      return;
    }

    // Online methods: open the test gateway
    openModal();
  };

  // ---- Test gateway: validate + process ----
  const validateCard = () => {
    const num = card.number.replace(/\s/g, "");
    if (num.length !== 16) return "Enter a 16-digit card number";
    if (card.name.trim().length < 3) return "Enter the name on the card";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return "Enter expiry in MM/YY format";
    const [mm, yy] = card.expiry.split("/").map(Number);
    const now = new Date();
    const curYY = now.getFullYear() % 100;
    if (yy < curYY || (yy === curYY && mm < now.getMonth() + 1)) return "This card has expired";
    if (!/^\d{3}$/.test(card.cvv)) return "Enter a 3-digit CVV";
    return "";
  };

  const validateUpi = () => {
    if (!upiApp && !upiId.trim()) return "Select a UPI app or enter a UPI ID";
    if (upiId.trim() && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim()))
      return "Enter a valid UPI ID (e.g. name@okhdfc)";
    return "";
  };

  const confirmFakePayment = () => {
    let err = "";
    let label = "";
    let shouldFail = false;

    if (selectedMethod === "card") {
      err = validateCard();
      label = "Credit / Debit Card (Test)";
      shouldFail = card.number.replace(/\s/g, "") === "4000000000000002";
    } else if (selectedMethod === "upi") {
      err = validateUpi();
      const appName = upiApps.find((a) => a.id === upiApp)?.name;
      label = `UPI${appName ? ` - ${appName}` : ""} (Test)`;
      shouldFail = upiId.trim().toLowerCase() === "failure@razorpay";
    } else if (selectedMethod === "wallet") {
      if (!wallet) err = "Select a wallet";
      label = `Wallet - ${wallets.find((w) => w.id === wallet)?.name || ""} (Test)`;
    }

    if (err) {
      setModalError(err);
      return;
    }

    setModalError("");
    setStep("processing");

    // Simulate waiting for the bank's response
    setTimeout(async () => {
      if (!mounted.current) return;

      if (shouldFail) {
        setStep("form");
        setModalError("Payment failed. Your bank declined the transaction. Please try again.");
        return;
      }
      try {
        await saveOrder(label);
        finishSuccess("Payment successful! Order placed");
      } catch (error) {
        console.error("Save Order Error:", error);
        if (!mounted.current) return;
        setStep("form");
        setModalError(error.message || "Order could not be saved. Please check the backend.");
      }
    }, upiApp && !upiId ? 3500 : 2000);
  };

  // ---- Card input formatters ----
  const onCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCard((prev) => ({ ...prev, number: digits.replace(/(.{4})/g, "$1 ").trim() }));
    setModalError("");
  };
  const onExpiry = (e) => {
    let d = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (d.length >= 3) d = d.slice(0, 2) + "/" + d.slice(2);
    setCard((prev) => ({ ...prev, expiry: d }));
    setModalError("");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">No Products in Cart</h2>
        <button onClick={() => navigate("/")} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
          Continue Shopping
        </button>
      </div>
    );
  }

  const modalInput =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-400";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header: title on the left, Continue Shopping on the right */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Confirm details</h2>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
            <FaLock className="text-xs" /> Complete your order securely
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-sm font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
        >
          <FaShoppingBag /> Continue shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-5 flex items-center justify-between">
              My Orders <span className="text-sm font-normal text-gray-400">{totalItems} items</span>
            </h3>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {cart.map((item, index) => (
                <div key={item._id || item.id || index} className="flex items-center gap-3 border-b dark:border-gray-700 pb-3">
                  {item.image && <img src={item.image} alt="product" className="w-14 h-14 object-cover rounded-xl shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{item.title || item.name}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-400">Qty: {item.quantity}</p>}
                  </div>
                  <p className="font-semibold text-orange-500 shrink-0 text-sm">₹{item.price * (item.quantity || 1)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1"><FaTag className="text-xs" /> Discount (above ₹499)</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-800 dark:text-white">
                <span>Total</span>
                <span className="text-orange-500">₹{totalPrice}</span>
              </div>
            </div>

            {discount > 0 ? (
              <p className="mt-4 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg px-3 py-2">
                🎉 Congratulations! You saved ₹{discount} on this order.
              </p>
            ) : (
              <p className="mt-4 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg px-3 py-2">
                Add items worth ₹{amountForDiscount} more to get ₹49 off.
              </p>
            )}
          </div>

          {/* ============ DELIVERY ADDRESS ============ */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt className="text-orange-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Delivery Address</h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">Fields marked with * are required</p>

            <div className="space-y-4">
              <Field label="Full Name" required error={errors.fullName}>
                <input
                  ref={(el) => (fieldRefs.current.fullName = el)}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Arvind Kumar"
                  autoComplete="name"
                  className={inputClass("fullName")}
                />
              </Field>

              <Field label="Mobile Number" required error={errors.phone} hint="We'll send order updates on this number">
                <div className="flex">
                  <span className="px-3 flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl">
                    +91
                  </span>
                  <input
                    ref={(el) => (fieldRefs.current.phone = el)}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className={`${inputClass("phone")} !rounded-l-none`}
                  />
                </div>
              </Field>

              <Field label="Pincode" required error={errors.postalCode} hint="City and state will be filled in automatically">
                <div className="relative">
                  <input
                    ref={(el) => (fieldRefs.current.postalCode = el)}
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className={inputClass("postalCode")}
                  />
                  {pinLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </Field>

              <Field label="Address (House No., Building, Street, Area)" required error={errors.address}>
                <textarea
                  ref={(el) => (fieldRefs.current.address = el)}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 12, Shanti Nagar, Near City Mall"
                  rows={2}
                  autoComplete="street-address"
                  className={inputClass("address")}
                />
              </Field>

              <Field label="Landmark (optional)">
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Opposite City Hospital"
                  className={inputClass("landmark")}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City / District" required error={errors.city}>
                  <input
                    ref={(el) => (fieldRefs.current.city = el)}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="City"
                    autoComplete="address-level2"
                    className={inputClass("city")}
                  />
                </Field>

                <Field label="State" required error={errors.state}>
                  <select
                    ref={(el) => (fieldRefs.current.state = el)}
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="address-level1"
                    className={inputClass("state")}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Address type */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Address Type</p>
                <div className="flex gap-3">
                  {ADDRESS_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, addressType: t.id }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${form.addressType === t.id
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                    >
                      {t.icon} {t.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedMethod === method.id
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="accent-orange-500 w-4 h-4 shrink-0"
                  />
                  <span className="shrink-0">{method.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedMethod !== "cod" && (
              <p className="text-xs text-gray-400 mt-4">🧪 Test mode: no real money will be charged</p>
            )}
          </div>

          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white py-4 rounded-2xl text-lg font-bold transition-colors"
          >
            {paying ? "Processing..." : selectedMethod === "cod" ? `Place Order ₹${totalPrice}` : `Pay ₹${totalPrice}`}
          </button>
        </div>
      </div>

      {/* ============ TEST PAYMENT GATEWAY MODAL ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            onClick={closeModal}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${modalVisible ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Payment"
            className={`relative bg-white dark:bg-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all duration-200 ease-out motion-reduce:transition-none ${modalVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
              }`}
          >
            {/* Header */}
            <div className="bg-orange-500 text-white px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <p className="font-bold">Online Shop</p>
                <p className="text-xs opacity-90">Test Payment Gateway</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <p className="text-lg font-bold">₹{totalPrice}</p>
                {step !== "processing" && (
                  <button onClick={closeModal} aria-label="Close"><FaTimes /></button>
                )}
              </div>
            </div>

            <div className="p-5">
              {step === "processing" ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  {selectedMethod === "upi" && upiApp && !upiId ? (
                    <>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        Request sent to {upiApps.find((a) => a.id === upiApp)?.name}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">Please approve the payment on your phone...</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-800 dark:text-white">Processing your payment...</p>
                      <p className="text-sm text-gray-400 mt-1">Please do not close this page</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* CARD */}
                  {selectedMethod === "card" && (
                    <div className="space-y-3">
                      <input value={card.number} onChange={onCardNumber} placeholder="Card Number" inputMode="numeric" className={modalInput} />
                      <input
                        value={card.name}
                        onChange={(e) => { setCard((prev) => ({ ...prev, name: e.target.value })); setModalError(""); }}
                        placeholder="Name on Card"
                        className={modalInput}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={card.expiry} onChange={onExpiry} placeholder="MM/YY" inputMode="numeric" className={modalInput} />
                        <input
                          value={card.cvv}
                          onChange={(e) => {
                            setCard((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }));
                            setModalError("");
                          }}
                          placeholder="CVV"
                          type="password"
                          inputMode="numeric"
                          className={modalInput}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Success: 4111 1111 1111 1111 | Fail: 4000 0000 0000 0002 (any future expiry, any 3-digit CVV)
                      </p>
                    </div>
                  )}

                  {/* UPI */}
                  {selectedMethod === "upi" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Select a UPI app</p>
                        <div className="grid grid-cols-3 gap-3">
                          {upiApps.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => { setUpiApp(app.id); setUpiId(""); setModalError(""); }}
                              className={`rounded-xl border-2 p-3 text-center transition ${upiApp === app.id ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-gray-200 dark:border-gray-700"
                                }`}
                            >
                              <div className={`${app.color} w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold`}>
                                {app.name[0]}
                              </div>
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{app.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex-1 border-t" /> or <div className="flex-1 border-t" />
                      </div>

                      <div>
                        <input
                          value={upiId}
                          onChange={(e) => { setUpiId(e.target.value); setUpiApp(""); setModalError(""); }}
                          placeholder="UPI ID (e.g. name@okhdfc)"
                          className={modalInput}
                        />
                        <p className="text-xs text-gray-400 mt-2">Success: success@razorpay | Fail: failure@razorpay</p>
                      </div>
                    </div>
                  )}

                  {/* WALLET */}
                  {selectedMethod === "wallet" && (
                    <div className="space-y-3">
                      {wallets.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => { setWallet(w.id); setModalError(""); }}
                          className={`w-full flex items-center gap-3 rounded-xl border-2 p-3 transition ${wallet === w.id ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-gray-200 dark:border-gray-700"
                            }`}
                        >
                          <div className={`${w.color} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold`}>{w.name[0]}</div>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">{w.name}</span>
                          {wallet === w.id && <FaCheckCircle className="ml-auto text-orange-500" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {modalError && (
                    <p className="mt-4 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg px-3 py-2">{modalError}</p>
                  )}

                  <button
                    onClick={confirmFakePayment}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Pay ₹{totalPrice}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Process;