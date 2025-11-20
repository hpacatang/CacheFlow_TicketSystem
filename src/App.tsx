import Box from "@mui/material/Box";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserMngmt } from "./views/containers/UserMngmt/UserMngmt";
import AccessCntrl from "./views/containers/AccessCntrl/AccessCntrl";
import { AuthProvider } from "./contexts/AuthContext";

import { AppRoutes } from "./routes";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Box sx={{ display: "flex" }}>
        <AppRoutes />
      </Box>
    </AuthProvider>
  );
};

export default App;
