import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function RefereshHandle({ setIsAuthenticated }) {

  const location = useLocation();

  useEffect(() => {

    const token =
      localStorage.getItem("userToken") ||
      localStorage.getItem("workerToken") ||
      localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

  }, [location.pathname]);

  return null;
}

export default RefereshHandle;