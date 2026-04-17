import React, { useState } from "react";
import "../../styles/workerServicesUI.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { handleError, handleSuccess } from "../../utils/utils";
import axios from "axios";
import { useEffect } from "react";

const BASE_URL = "https://helpkar.onrender.com";

const WorkerServices = () => {

    const [editing, setEditing] = useState(null);
    const [hasService, setHasService] = useState(false);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState({
        title: "",
        description: "",
        price: "",
        radiusKM: "",
        icon: null,
        isAvailable: true
    })

    const token = localStorage.getItem("workerToken");

    const handleChange = (e) => {
        setServices({
            ...services,
            [e.target.name]: e.target.value
        })
    }
    const toggleStatus = async () => {
        try {

            const url = `https://helpkar.onrender.com/api/worker/services/update-status`;

            const { data } = await axios.put(url, { isAvailable: !services.isAvailable }, { headers: { Authorization: `Bearer ${token}` } })

            const { message, error, success, response } = data;

            if (success) {
                setServices(response);
                handleSuccess(message);
            }
            else {
                handleError(error || message);
            }


        } catch (error) {
            handleError(error.response?.data?.message || error.message);
        }
    }

    const handleCreateService = async (e) => {
        e.preventDefault();
        if (!services.title.trim()) {
            return handleError("Service title required")
        }

        if (!services.description.trim()) {
            return handleError("Service description required")
        }

        if (!services.price || services.price <= 0) {
            return handleError("Enter valid price")
        }

        if (!services.radiusKM || services.radiusKM <= 0) {
            return handleError("Enter valid radius")
        }

        if (!services.icon) {
            return handleError("Please upload service image")
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", services.title);
            formData.append("description", services.description);
            formData.append("price", services.price);
            formData.append("radiusKM", services.radiusKM);
            formData.append("icon", services.icon);

            const url = `https://helpkar.onrender.com/api/worker/services/create`;

            const { data } = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const { message, success, error } = data;

            if (success) {
                handleSuccess(message);
                setHasService(true);
                setServices(data.service);
                fetchService();

            } else {
                handleError(error?.details?.[0]?.message);
            }

        } catch (err) {
            handleError(err.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    const fetchService = async () => {
        try {

            const url = `https://helpkar.onrender.com/api/worker/services/list`;

            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { success, response } = data;

            if (success && response) {
                setServices(response);
                setHasService(true);
            }
        } catch (err) {
            handleError(err.response?.data?.message || err.message);
        }

    }

    const handleSaveService = async () => {

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", services.title);
            formData.append("description", services.description);
            formData.append("price", services.price);
            formData.append("radiusKM", services.radiusKM);

            const url = `https://helpkar.onrender.com/api/worker/services/update`;

            if (services.icon instanceof File) {
                formData.append("icon", services.icon);
            }

            const { data } = await axios.put(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { message, success, error, response } = data;

            if (success && response) {
                setServices(response);
                setHasService(true);

                setEditing(false);
                handleSuccess(message);
            }
            else {
                handleError(error?.message || message);
            }

        } catch (error) {
            handleError(error.response?.data?.message || error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchService();
    }, [])

    return (
        <div className="servicePage">

            {!hasService ? (

                /* CREATE SERVICE FORM */

                <div className="editBox">

                    <h3>Create Service</h3>

                    <input
                        placeholder="Service Title"
                        name="title"
                        onChange={handleChange}
                    />
                    <textarea
                        placeholder="Service Description"
                        name="description"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        placeholder="Radius KM"
                        name="radiusKM"
                        onChange={handleChange}
                    />
                    <input type="file"
                        onChange={(e) =>
                            setServices({ ...services, icon: e.target.files[0] })} />

                    <button
                        className="saveBtn"
                        onClick={handleCreateService}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Create Service"
                        )}

                    </button>
                </div>

            ) : (
                <div className="serviceCard" >
                    <img
                        className="serviceImage"
                        src={
                            services.icon?.fileUrl
                                ? services.icon.fileUrl
                                : services.icon instanceof File
                                    ? URL.createObjectURL(services.icon)
                                    : null
                        }
                    />

                    {editing ? (

                        <div className="editBox">

                            <input
                                name="title"
                                value={services.title}
                                onChange={handleChange}
                            />

                            <input
                                name="description"
                                value={services.description}
                                onChange={handleChange}
                            />

                            <input
                                name="price"
                                type="number"
                                value={services.price}
                                onChange={handleChange}
                            />

                            <input
                                name="radiusKM"
                                type="number"
                                value={services.radiusKM}
                                onChange={handleChange}
                            />

                            <input
                                type="file"
                                onChange={(e) =>
                                    setServices({ ...services, icon: e.target.files[0] })}
                            />

                            <button
                                className="saveBtn"
                                onClick={handleSaveService}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner"></span>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>

                    ) : (

                        <div className="serviceInfo">

                            <div className="titleLine" style={{ width: "100%" }}></div>
                            <h3>{services.title}</h3>

                            <div className="titleLine"></div>

                            <h5>{services.description}</h5>
                            <br />
                            <hr />
                            <br />
                            <p>Price : ₹ {services.price}</p>

                            <p>Radius in KM : {services.radiusKM} KM</p>

                            <div className="serviceActions">
                                <div className="actionIcon">
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        onClick={() => setEditing(!editing)}
                                    />
                                    <span className="tooltipText">Edit Service</span>
                                </div>

                                <div className="actionIcon">
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ color: "red", cursor: "pointer" }}
                                    />
                                    <span className="tooltipText">Remove Service</span>
                                </div>

                                <div className="actionIcon">
                                    <label className="toggle">

                                        <input
                                            type="checkbox"
                                            checked={services.isAvailable}
                                            onChange={() => {
                                                setServices({ ...services, isAvailable: !services.isAvailable });
                                                toggleStatus();
                                            }}
                                        />

                                        <span></span>


                                    </label>
                                    <span className="tooltipText">
                                        {services.isAvailable ? "Turn Off Service" : "Turn On Service"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default WorkerServices