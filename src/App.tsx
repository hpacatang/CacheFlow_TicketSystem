import Box from "@mui/material/Box";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserMngmt } from "./views/containers/UserMngmt/UserMngmt";
import AccessCntrl from "./views/containers/AccessCntrl/AccessCntrl";


import { AppRoutes } from "./routes";

const App: React.FC = () => {
  <Router>
    <Routes>
      <Route path="/" element={<UserMngmt />} />
      <Route path="/AccessControl" element={<AccessCntrl />} />
    </Routes>
  </Router>

  return (
    <Box sx={{ display: "flex" }}>
      <AppRoutes />
    </Box>
  );
};

export default App;
