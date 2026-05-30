import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password, role) => {
    try {
      const dbRole = role === "student" ? "Student" : "Recruiter";
      const data = await api.post("/user/login", { email, password, role: dbRole });
      if (data.success) {
        const formattedUser = {
          ...data.user,
          role: data.user.role ? data.user.role.toLowerCase() : role
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(formattedUser));
        setUser(formattedUser);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      return { success: false, message: error.message || "Invalid credentials" };
    }
  };

  const registerUser = async (fullname, email, phoneNumber, password, role) => {
    try {
      const dbRole = role === "student" ? "Student" : "Recruiter";
      // Remove all non-digits to cast cleanly to Number in Mongoose
      const cleanPhone = phoneNumber.toString().replace(/\D/g, "");
      
      const data = await api.post("/user/register", { 
        fullname, 
        email, 
        phoneNumber: cleanPhone, 
        password, 
        role: dbRole 
      });
      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error) {
      return { success: false, message: error.message || "Registration failed" };
    }
  };

  const logoutUser = async () => {
    try {
      await api.get("/user/logout");
    } catch (e) {
      console.warn("Logout request error, proceeding with local logout", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const formattedUser = {
      ...updatedUser,
      role: updatedUser.role ? updatedUser.role.toLowerCase() : "student"
    };
    localStorage.setItem("user", JSON.stringify(formattedUser));
    setUser(formattedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: loginUser, register: registerUser, logout: logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
