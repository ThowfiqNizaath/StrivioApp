import { createContext, useContext, useEffect, useState } from "react";
import api from "../../Files/axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  // const [todoEntry, setTodoEntry] = useState();
  const [categories, setCategories] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [activeRoutines, setActiveRoutines] = useState([]);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => console.log(loading), [loading])

  // console.log(user)

  useEffect(() => {
    setShowMenu(false);
    authUser();
  }, []);

  useEffect(() => {
    function initialLoad() {
      if (user) {
        setLoading(true);
        setShowMenu(false);
        getCategories();
        getRoutines();
        getNotes();
        setLoading(false)
      }
    }

    initialLoad();
  }, [user]);

  useEffect(() => {
    if (user && routines.length > 0) {
      getActiveRoutines();
    }
  }, [routines, categories]);

  async function authUser() {
    try {
      const response = await api.get("/register/user/");
      // console.log(response.data);
      if (response.data.success) {
        setUser(response.data);
        navigate("/protected/dashboard");
        setLoading(false);
      }
    } catch (err) {
      errorHandlerFn(err);
      // setLoading(false);
    }
  }

  async function login(username_or_email, password) {
    try {
      const response = await api.post("/register/login/", {
        username_or_email: username_or_email,
        password: password,
      });
      if (response.data.success) {
        console.log(response.data);
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        await authUser();
        return response.data
      } else {
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  async function logout() {
    try {
      const response = await api.post("/register/logout/");
      if (response.data.success) {
        setUser(null);
        enqueueSnackbar("Logged out successfully", { variant: "success" });
        navigate("/login");
      }
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  async function getCategories() {
    try {
      const response = await api.get("/api/categories/");
      // console.log(response.data)
      setCategories(response.data);
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  async function getRoutines() {
    try {
      const response = await api.get("/api/routine/");
      // console.log(response.data)
      setRoutines(response.data);
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  const getActiveRoutines = () => {
    if (routines.length > 0) {
      setActiveRoutines(routines.filter((item) => item.active === true));
    }
  };

  async function getNotes() {
    try {
      const response = await api.get("/api/notes/");
      setNotes(response.data);
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  function isValidDate(date) {
    return new Date().toISOString().split("T")[0] >= date;
  }

  async function getRoutineEntryByFrom(date) {
    try {
      if (isValidDate(date)) {
        const response = await api.get(`/api/routineEntry/?fromDate=${date}`);
        //  console.log("Rutine Entry function", JSON.stringify(response.data, null,2));
        return response.data || [];
      }
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  async function getRoutineEntryByFromTo(from, to) {
    try {
      const response = await api.get(
        `/api/routineEntry/?fromDate=${from}&toDate=${to}`,
      );
      return await response.data;
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  async function errorHandlerFn(err) {
    // console.log(err.response)
    if (err.response && err.response.status === 401) {
      try {
        // console.log("I'm refreshing Token");
        const response = await api.post("/register/token/refresh/", {});
        if (response.data.success) {
          await authUser();
        }
      } catch (err) {
        // navigate("/login");
        setUser(null);
        setLoading(false);
      }
    }else {
      if (err.response) {
        console.log(err.response);
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Something went wrong, try again later";
        enqueueSnackbar(errorMsg, { variant: "error" });
      } else {
        console.log(err);
      }
    }
  }

  function convertTimeTo12Hrs(time24) {
    if (!time24) return "No Time";

    const [hour, minute, second] = time24.split(":");

    const date = new Date();
    date.setHours(hour, minute, second);

    const time12 = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return time12;
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        login,
        logout,
        authUser,
        categories,
        setCategories,
        getRoutines,
        routines,
        activeRoutines,
        setActiveRoutines,
        setRoutines,
        getActiveRoutines,
        notes,
        setNotes,
        getRoutineEntryByFrom,
        getRoutineEntryByFromTo,
        errorHandlerFn,
        convertTimeTo12Hrs,
        showMenu,
        setShowMenu,
        getCategories,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
