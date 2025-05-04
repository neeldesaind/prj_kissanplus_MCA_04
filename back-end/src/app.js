import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from "./routes/user.routes.js";
import stateRoutes from "./routes/state.routes.js";
import districtRoutes from "./routes/district.routes.js";
import subDistrictRoutes from "./routes/subdistrict.routes.js";
import villageRoutes from "./routes/village.routes.js";
import canalRoutes from './routes/canal.routes.js';
import farmRoutes from './routes/farm.routes.js';
import nocRoutes from './routes/nocRoutes.js'; // Import NOC routes
import exemptionRoutes from './routes/exemptionRoutes.js'; // Import NOC routes
import namuna7Routes from './routes/namuna7.routes.js'; // Import NOC routes
import manageNamunaRoutes from './routes/manageNamunaRoutes.js'; // Import NOC routes
import form12Routes from './routes/form12.routes.js'; // Import NOC routes
import razorpayRoutes from './routes/razorPayRoutes.js'; // Import Razorpay routes
import dashboardRoutes from './routes/dashboard.routes.js'; // Import Razorpay routes
import contactRoutes from './routes/contactRoutes.js'; // Import Razorpay routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:8080", credentials: true }));

app.get("/", (req, res) => {
    res.send("Backend of kissan plus running!");
});

app.use("/api/users", userRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/subdistricts", subDistrictRoutes);
app.use("/api/villages", villageRoutes); 
app.use('/api/canals', canalRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/noc", nocRoutes); // Add this line to include NOC routes
app.use("/api/exemptions", exemptionRoutes); // Add this line to include NOC routes
app.use("/api/namuna7", namuna7Routes); // Add this line to include NOC routes
app.use("/api/manageNamuna", manageNamunaRoutes);
app.use("/api/form12", form12Routes);
app.use('/api', razorpayRoutes); 
app.use('/api/dashboarddata', dashboardRoutes); 
app.use('/api/contact', contactRoutes);


export default app;