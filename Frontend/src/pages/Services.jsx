import React, { useState, useMemo, useEffect } from "react";
import "../styles/Services.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { handleError } from "../utils/utils";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
const BASE_URL = "https://helpkar.onrender.com";

const Services = () => {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("All Categories");
    const [selectedService, setSelectedService] = useState("All Services");
    const [city, setCity] = useState("All Cities");

    const [workerData, setWorkerData] = useState([]);

    const [minRating, setMinRating] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceLimit, setPriceLimit] = useState(100);
    const navigate = useNavigate();
    const location = useLocation();

    const [services, setServices] = useState([]);

    const getCity = (worker) => {
        if (!worker?.city) return "";

        const parts = worker.city.split(",");
        return parts[parts.length - 1].trim(); // last part = city
    };

    const servicesByCategory = useMemo(() => {
        if (!categories || categories.length === 0) return [];

        if (category === "All Categories") {
            return [];
        }

        const found = categories.find(c => c.category === category);
        return found?.services || [];
    }, [categories, category]);

    const uniqueCities = useMemo(() => {
        return [
            ...new Set(
                (workerData || [])
                    .map(w => getCity(w))
                    .filter(Boolean)
            )
        ];
    }, [workerData]);

  const filteredServices = useMemo(() => {
    return (services || []).filter((s) => {

        const worker = workerData.find(
            w => String(w._id) === String(s.workerId)
        );

        const workerCity = getCity(worker);

        const titleMatch = s.title?.toLowerCase().includes(search.toLowerCase());

        const serviceMatch = worker?.service
            ?.toLowerCase()
            .includes(search.toLowerCase());

        return (
            (titleMatch || serviceMatch) &&
            (category === "All Categories" || worker?.category === category) &&
            (selectedService === "All Services" || worker?.service === selectedService) &&
            (city === "All Cities" || workerCity?.toLowerCase().trim() === city.toLowerCase().trim()) &&
            (s.rating || 0) >= minRating &&
            (maxPrice === 0 || s.price <= maxPrice)
        );
    });
}, [services, workerData, search, category, selectedService, city, minRating, maxPrice]);

const fetchData = async () => {
    try {
        const [servicesRes, priceRes, workersRes, categoriesRes] = await Promise.all([
            axios.get(`https://helpkar.onrender.com/api/services/list`),
            axios.get(`https://helpkar.onrender.com/api/services/list/highestPrice`),
            axios.get(`https://helpkar.onrender.com/api/services/list/workerData`),
            axios.get(`https://helpkar.onrender.com/api/services/list/category`)
        ]);

        setServices(servicesRes.data.response);

        setWorkerData(workersRes.data?.response || []);

        const total = priceRes.data?.response?.[0]?.highestPrice || 0;
        const rounded = Math.ceil(total / 500) * 500;

        setPriceLimit(rounded);
        setMaxPrice(rounded);

        setCategories(categoriesRes.data.response);

    } catch (error) {
        handleError(error.response?.data?.message || error.message);
    }
}

useEffect(() => {
    if (location.state && workerData.length > 0) {
        setSearch(location.state.service || "");
        setCity(location.state.city || "All Cities");
    }
}, [location.state, workerData]);

useEffect(() => {
    setSelectedService("All Services");
}, [category]);

useEffect(() => {
    fetchData();
}, []);

return (
    <>
        <div className="app-layout">
            {/* SIDEBAR */}
            <aside className="dark-sidebar">
                <div className="filters-container">
                    <h3 className="filters-title">Filters</h3>

                    <input
                        type="text"
                        className="sidebar-input"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Categories  */}

                    <select
                        className="sidebar-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>All Categories</option>
                        {(categories || []).map((cat) => (
                            <option key={cat._id} value={cat.category}>
                                {cat.category}
                            </option>
                        ))}
                    </select>

                    {/* Services  */}

                    <select
                        className="sidebar-select"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                    >
                        <option value="All Services">All Services</option>
                        {servicesByCategory.map((srv) => (
                            <option key={srv} value={srv}>
                                {srv}
                            </option>
                        ))}
                    </select>

                    {/* city */}

                    <select
                        className="sidebar-select"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <option value="All Cities">All Cities</option>

                        {uniqueCities.map((ct) => (
                            <option key={ct} value={ct}>
                                {ct}
                            </option>
                        ))}
                    </select>

                    <div className="range-box">
                        <label>Min Rating</label>
                        <input
                            type="range" min="0" max="5" step="0.1"
                            className="orange-range"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                        />
                        <div className="range-label">{minRating} ★</div>
                    </div>

                    <div className="range-box">
                        <label>Max Price</label>
                        <input
                            type="range"
                            min="0"
                            max={priceLimit}
                            step="20"
                            className="orange-range"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        />
                        <div className="range-label">₹{maxPrice}/H</div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="main-viewport">
                <main className="content-padding">
                    <h2 className="section-heading">Available Services</h2>

                    <div className="services-flex-grid">

                        {filteredServices.length === 0 ? (

                            <div className="no-service-box">
                                <h3>No services found</h3>
                                <p>Try changing filters or search another service.</p>
                            </div>

                        ) : (

                            filteredServices.map(service => (

                                <div className="service-card" key={service._id}>

                                    <div className="card-img-container">
                                        <img src={service.icon?.fileUrl} alt={service.category} />

                                        <div className="rating-box">
                                            <span className="star-yellow">★</span> {service.rating}/5
                                        </div>
                                    </div>

                                    <div className="service-type-text">
                                        {
                                            workerData.find(
                                                w => String(w._id) === String(service.workerId)
                                            )?.category || "Service"
                                        }
                                    </div>

                                    <div className="card-title-row">

                                        <h4 className="name-tag">
                                            {service.title}
                                            {/*    {service.category && (
                                                <span style={{ fontWeight: 400, color: "#6b7280" }}>
                                                    ({service.category})
                                                </span>
                                            )} */}
                                        </h4>
                                    </div>

                                    <span className="service-desc">{service.description}</span>

                                    <div className="info-list">
                                        <div className="info-item">
                                            <span className="info-icon">
                                                <FontAwesomeIcon icon={faLocationDot} />

                                                {workerData.find(w => String(w._id) === String(service.workerId))?.city}
                                            </span>

                                            <div className="worker-name">
                                                {workerData.find(w => String(w._id) === String(service.workerId))?.fullName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="price-container">
                                            <p className="price-text">
                                                <span>Start from</span>₹{service.price}
                                            </p>
                                        </div>
                                    </div>
                                    <br />
                                    <button
                                        className="booking-btn"
                                        onClick={() => navigate(`/booking/${service._id}`)}
                                    >
                                        Booking Now
                                    </button>

                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    </>
);
};

export default Services;