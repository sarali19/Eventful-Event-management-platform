import { Layout } from "@/components/Layout";
import { CreateEvent } from "@/pages/CreateEvent";
import { EditEvent } from "@/pages/EditEvent";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EventsPage } from "@/pages/EventsPage";
import { EventDetails } from "@/pages/EventDetails";
import { Payment } from "@/pages/Payment";

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={<EventsPage />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path="event/:id/edit" element={<EditEvent />} />
            <Route path="event/:id/payment" element={<Payment />} />
            <Route path="event/:id" element={<EventDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};
