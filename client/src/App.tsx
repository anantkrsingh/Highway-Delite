import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from './pages/Login'
import { useAppContext } from "./Context/AppContext";
import Dashboard from "./pages/Dashboard";

function App() {
  const { token } = useAppContext();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Navigate to={"/dashboard"} /> : <Login />} />
          <Route path="/dashboard" element={!token ? <Navigate to={"/"} /> : <Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
