import { ProtectedRouter } from "./components/ProtectedRouter";
import { AuthProvider } from "./context/AuthContext";
import Category from "./Page/Category";
import Dashboard from "./Page/Dashboard";
import Login from "./Page/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Routine from "./Page/Routine";
import ToDo from "./Page/ToDo";
import SignUp from "./Page/SignUp";
import NotePad from "./Page/NotePad";
import { Notebook } from "lucide-react";
import NotePadId from "./components/NotePadId";
import NotFound from "./Page/NotFound";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/protected/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/protected" element={<ProtectedRouter />}>
          <Route index element={<Navigate to="/protected/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="routine" element={<Routine />} />
          <Route path="todo" element={<ToDo />} />
          <Route path="notes" element={<NotePad />} />
          <Route path="notes/:id" element={<NotePadId />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

//  <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Default redirect */}
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
