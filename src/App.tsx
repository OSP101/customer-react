import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Primary from "./pages/CustomerPrimary";
import Secondary from "./pages/CustomerSecondary";
import Tertiary from "./pages/CustomerTertiary";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<Primary />} />
        <Route path="/customer" element={<Tertiary />} />
        <Route path="/" element={<Secondary />} />
      </Routes>
    </Router>
  );
}

export default App;