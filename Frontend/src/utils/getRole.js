import {jwtDecode} from "jwt-decode";

export const getRoleFromToken = () => {
  const token =
    localStorage.getItem("userToken") ||
    localStorage.getItem("workerToken") ||
    localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    return null;
  }
};