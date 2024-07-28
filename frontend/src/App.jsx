import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import TraineeSignin from "./pages/TraineeSignin";
import TrainerSignin from "./pages/TrainerSignin";
import TraineeSignup from "./pages/TraineeSignup";
import Trainee from "./pages/Trainee";
import Trainer from "./pages/Trainer";
import Test from "./pages/Test";
import MonitorTrainee from "./pages/MonitorTrainee";
import MonitorCustomer from "./pages/MonitorCustomer";
import TraineeInfo from "./pages/TraineeInfo";
import ChatbotUI from "./pages/ChatbotUI";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/trainee-signin" element={<TraineeSignin />} />
        <Route path="/trainee-signup" element={<TraineeSignup />} />
        <Route path="/trainer-signin" element={<TrainerSignin />} />
        <Route path="/trainee" element={<Trainee />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/" element={<Home />} />
        <Route path="/trainee/test" element={<Test />} />
        <Route path="/monitortrainee" element={<MonitorTrainee />} />
        <Route path="/monitorcustomer" element={<MonitorCustomer />} />
        <Route path="/trainee-info/:id" element={<TraineeInfo />} />
        <Route path="/chatbot" element={<ChatbotUI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
