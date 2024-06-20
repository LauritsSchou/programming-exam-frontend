import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AthletePage from "./pages/AthletePage";
import ResultPage from "./pages/ResultPage";
import DisciplinePage from "./pages/DisciplinePage";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/athletes" element={<AthletePage />} />
            <Route path="/results" element={<ResultPage />} />
            <Route path="/disciplines" element={<DisciplinePage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}
export default App;
