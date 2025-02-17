import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Primary from "./pages/CustomerPrimary";
import Secondary from "./pages/CustomerSecondary";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/customerNew" element={<Primary />} />
        <Route path="/" element={<Secondary />} />
      </Routes>
    </Router>
  );
}

export default App;