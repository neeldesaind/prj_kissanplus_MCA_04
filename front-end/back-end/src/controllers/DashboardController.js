import Noc from "../models/models.forms/noc.model.js"; // Import the Noc model
import Namuna from "../models/models.forms/namuna.model.js"; // Import the Namuna7 model
import Exemption from "../models/models.forms/exemption.model.js"; // Import the Exemption model
import Payment from "../models/models.payment/payment.model.js"; // Import the Payment model
import Form12 from "../models/models.forms/form12.model.js"; // Import the Form12 model
import User from "../models/models.user/user.model.js"; // Import the User model
import State from "../models/models.location/state.model.js"; // Import the State model
import District from "../models/models.location/district.model.js"; // Import the District model
import SubDistrict from "../models/models.location/subdistrict.model.js"; // Import the SubDistrict model
import Village from "../models/models.location/village.model.js"; // Import the Village model
import Canal from "../models/models.location/canal.model.js"; // Import the Canal model


export const getUserPayments = async (req, res) => {
    try {
      // Fetch all payments for the user
      const payments = await Payment.find({ userId: req.params.userId });
  
      // Calculate total paid amount (payments with status 'success')
      const totalPaidAmount = payments
        .filter(p => p.status === 'success')
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
      // Fetch all Form12 data for the user (to calculate total amount)
      const form12Data = await Form12.find({ userId: req.params.userId });
  
      // Calculate total amount (sum of total_rate for all approved forms)
      const totalAmount = form12Data
        .reduce((acc, curr) => acc + (curr.total_rate || 0), 0);
  
      // Calculate total pending amount (totalAmount - totalPaidAmount)
      const totalPendingAmount = totalAmount - totalPaidAmount;
  
      // Return the response with payments, totalPaidAmount, totalPendingAmount
      res.json({
        payments,
        totalPaidAmount,
        totalPendingAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching payments and form data' });
    }
  };
  
  
  export const getUserNocs = async (req, res) => {
    try {
      const userId = req.params.userId;
        // Fetch all NOCs and populate profile_id
      const nocs = await Noc.find().populate('profile_id');
     
  
      // Filter by userId through profile_id.user_id
      const userNocs = nocs.filter(
        (noc) => noc.profile_id?.user_id?.toString() === userId
      );
  
      // Calculate totals
      const totalSubmitted = userNocs.length;
      const totalApproved = userNocs.filter(noc => noc.isApprovedbyTalati).length;
  
      // Send response
      res.json({
        nocs: userNocs,
        totalSubmitted,
        totalApproved,
      });
    } catch (error) {
      console.error('Error fetching NOCs:', error);
      res.status(500).json({ message: 'Error fetching NOCs data' });
    }
  };
  
  
  
  export const getUserNamunas = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Fetch all namunas and populate profile
      const namunas = await Namuna.find().populate('profile_id');
  
      // Filter based on profile's user_id
      const userNamunas = namunas.filter(
        (namuna) => namuna.profile_id?.user_id?.toString() === userId
      );
  
      const totalSubmitted = userNamunas.length;
      const totalApproved = userNamunas.filter(n => n.isApprovedbyTalati).length;
  
  
      res.json({
        namunas: userNamunas,
        totalSubmitted,
        totalApproved,
      });
    } catch (error) {
      console.error('Error fetching Namunas:', error);
      res.status(500).json({ message: 'Error fetching Namunas data' });
    }
  };
  
  
  
  
  export const getUserExemptions = async (req, res) => {
    try {
      const userId = req.params.userId;
      // Fetch all exemptions and populate profile_id
      const exemptions = await Exemption.find().populate('profile_id');
  
      // Filter by userId via profile_id.user_id
      const userExemptions = exemptions.filter(
        (ex) => ex.profile_id?.user_id?.toString() === userId
      );
  
      // Calculate counts
      const totalSubmitted = userExemptions.length;
      const totalApproved = userExemptions.filter(ex => ex.isApprovedbyTalati).length;
  
  
      // Send response
      res.json({
        exemptions: userExemptions,
        totalSubmitted,
        totalApproved,
      });
    } catch (error) {
      console.error('Error fetching Exemptions:', error);
      res.status(500).json({ message: 'Error fetching Exemptions data' });
    }
  };
  
  export const getForm12DashboardData = async (req, res) => {
    try {
      const allForms = await Form12.find(); // Fetch all forms
  
      const totalSubmitted = allForms.length;
      const totalApproved = allForms.filter(form => form.isApprovedByEngineer === true).length;
  
      res.status(200).json({
        totalSubmitted,
        totalApproved
      });
    } catch (error) {
      console.error('Error fetching Form12 dashboard data:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  
  export const getTotalIncome = async (req, res) => {
    try {
      // Fetch all successful payments for all users (no filtering by userId)
      const allPayments = await Payment.find({ status: 'success' });
  
      // Calculate total income (sum of payment amounts)
      const totalIncome = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
      // Log the total income for debugging
  
      // Return the result
      res.status(200).json({ totalIncome });
  
    } catch (error) {
      console.error('Error fetching total income data:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  

  export const getWaterRequests = async (req, res) => {
    try {
      // Fetch all Namuna entries
      const allRequests = await Namuna.find();
  
      // Group by source type (Vehta Paani thi and Udvahanthi)
      const groupedRequests = allRequests.reduce((acc, request) => {
        const sourceType = request.source_type;
        
        if (!acc[sourceType]) {
          acc[sourceType] = 0;
        }
  
        acc[sourceType] += 1;
        return acc;
      }, {});
  
      const totalRequests = allRequests.length;
  
      // Return the result
      res.status(200).json({
        totalRequests,
        groupedRequests
      });
  
    } catch (error) {
      console.error('Error fetching water requests data:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  

  export const getTalatiDashboardData = async (req, res) => {
    try {
      // Fetch all successful payments for paid income
      const allPaidPayments = await Payment.find({ status: 'success' });
  
      // Calculate total paid income (sum of payment amounts)
      const totalPaidIncome = allPaidPayments.reduce((sum, payment) => sum + payment.amount, 0);  
  
      // Fetch all pending payments for pending income
      const allPendingPayments = await Payment.find({ status: 'pending' });
  
      // Calculate total pending income (sum of payment amounts)
      const totalPendingIncome = allPendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
      // Get Namuna, NOC, and Exemption counts, including pending, approved, and denied counts
      const namunaCount = await Namuna.countDocuments();
      const namunaPending = await Namuna.countDocuments({ isPending: true });  // Pending Namuna applications
      const namunaApproved = await Namuna.countDocuments({ isApprovedbyTalati: true });
      const namunaDenied = await Namuna.countDocuments({ isDeniedbyTalati: true });
  
      const nocCount = await Noc.countDocuments();
      const nocPending = await Noc.countDocuments({ isPending: true });  // Pending NOC applications
      const nocApproved = await Noc.countDocuments({ isApprovedbyTalati: true });
      const nocDenied = await Noc.countDocuments({ isDeniedbyTalati: true });
  
      const exemptionCount = await Exemption.countDocuments();
      const exemptionPending = await Exemption.countDocuments({ isPending: true });  // Pending Exemptions
      const exemptionApproved = await Exemption.countDocuments({ isApprovedbyTalati: true });
      const exemptionDenied = await Exemption.countDocuments({ isDeniedbyTalati: true });
  
      // Get Total Users excluding 'admin' role
      const totalUsers = await User.countDocuments({ role: { $nin: ['admin'] } });
  
      res.status(200).json({
        paid: totalPaidIncome,
        pending: totalPendingIncome,
        applications: {
          namuna: { 
            submitted: namunaCount, 
            pending: namunaPending, 
            approved: namunaApproved, 
            denied: namunaDenied 
          },
          noc: { 
            submitted: nocCount, 
            pending: nocPending, 
            approved: nocApproved, 
            denied: nocDenied 
          },
          exemption: { 
            submitted: exemptionCount, 
            pending: exemptionPending, 
            approved: exemptionApproved, 
            denied: exemptionDenied 
          }
        },
        totalUsers
      });
    } catch (err) {
      console.error('Error fetching Talati dashboard data:', err);
      res.status(500).json({ message: 'Server Error', error: err });
    }
  };
  
  

  export const getEngineerDashboardData = async (req, res) => {
    try {
      // Fetch total paid and pending income
      const totalPaidIncome = await Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ]);
  
      const totalPendingIncome = await Payment.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ]);
  
      // Form 12 application counts
      const form12Submitted = await Form12.countDocuments();
      const form12Pending = await Form12.countDocuments({ isApprovedByEngineer: false, isDeniedByEngineer: false });
      const form12Approved = await Form12.countDocuments({ isApprovedByEngineer: true });
      const form12Denied = await Form12.countDocuments({ isDeniedByEngineer: true });
  
      // Namuna application counts
      const namunaSubmitted = await Namuna.countDocuments();
      const namunaPending = await Namuna.countDocuments({ isApprovedbyTalati: false, isDeniedbyTalati: false });
      const namunaApproved = await Namuna.countDocuments({ isApprovedbyTalati: true });
      const namunaDenied = await Namuna.countDocuments({ isDeniedbyTalati: true });
  
      // NOC application counts
      const nocSubmitted = await Noc.countDocuments();
      const nocPending = await Noc.countDocuments({ isApprovedbyTalati: false, isDeniedbyTalati: false });
      const nocApproved = await Noc.countDocuments({ isApprovedbyTalati: true });
      const nocDenied = await Noc.countDocuments({ isDeniedbyTalati: true });
  
      // Exemption application counts
      const exemptionSubmitted = await Exemption.countDocuments();
      const exemptionPending = await Exemption.countDocuments({ isApprovedbyTalati: false, isDeniedbyTalati: false });
      const exemptionApproved = await Exemption.countDocuments({ isApprovedbyTalati: true });
      const exemptionDenied = await Exemption.countDocuments({ isDeniedbyTalati: true });
  
      // Total users excluding 'admin'
      const totalUsers = await User.countDocuments({ role: { $nin: ['admin'] } });
  
      // Send response with updated data
      res.status(200).json({
        paid: totalPaidIncome[0]?.totalAmount || 0,
        pending: totalPendingIncome[0]?.totalAmount || 0,
        applications: {
          form12: { 
            submitted: form12Submitted, 
            pending: form12Pending, 
            approved: form12Approved, 
            denied: form12Denied 
          },
          namuna: { 
            submitted: namunaSubmitted, 
            pending: namunaPending, 
            approved: namunaApproved, 
            denied: namunaDenied 
          },
          noc: { 
            submitted: nocSubmitted, 
            pending: nocPending, 
            approved: nocApproved, 
            denied: nocDenied 
          },
          exemption: { 
            submitted: exemptionSubmitted, 
            pending: exemptionPending, 
            approved: exemptionApproved, 
            denied: exemptionDenied 
          }
        },
        totalUsers
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  

  
  export const getAdminDashboardData = async (req, res) => {
    try {
      // Payment data
      const totalPaidIncome = await Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ]);
  
      const totalPendingIncome = await Payment.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ]);
  
      // Application data
      const form12Submitted = await Form12.countDocuments();
      const form12Pending = await Form12.countDocuments({ isPending: true });
      const form12Approved = await Form12.countDocuments({ isApprovedByEngineer: true });
      const form12Denied = await Form12.countDocuments({ isDeniedByEngineer: true });
  
      const namunaSubmitted = await Namuna.countDocuments();
      const namunaPending = await Namuna.countDocuments({ isPending: true });
      const namunaApproved = await Namuna.countDocuments({ isApprovedbyTalati: true });
      const namunaDenied = await Namuna.countDocuments({ isApprovedbyTalati: false });
  
      const nocSubmitted = await Noc.countDocuments();
      const nocPending = await Noc.countDocuments({ isPending: true });
      const nocApproved = await Noc.countDocuments({ isApprovedbyTalati: true });
      const nocDenied = await Noc.countDocuments({ isApprovedbyTalati: false });
  
      const exemptionSubmitted = await Exemption.countDocuments();
      const exemptionPending = await Exemption.countDocuments({ isPending: true });
      const exemptionApproved = await Exemption.countDocuments({ isApprovedbyTalati: true });
      const exemptionDenied = await Exemption.countDocuments({ isApprovedbyTalati: false });
  
      // User data (role-wise count)
      const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]);
  
      // Location data (total locations)
      const totalStates = await State.countDocuments();
      const totalDistricts = await District.countDocuments();
      const totalSubDistricts = await SubDistrict.countDocuments();
      const totalVillages = await Village.countDocuments();
      const totalCanals = await Canal.countDocuments();
  
      res.status(200).json({
        paid: totalPaidIncome[0]?.totalAmount || 0,
        pending: totalPendingIncome[0]?.totalAmount || 0,
        applications: {
          form12: { submitted: form12Submitted, pending: form12Pending, approved: form12Approved, denied: form12Denied },
          namuna: { submitted: namunaSubmitted, pending: namunaPending, approved: namunaApproved, denied: namunaDenied },
          noc: { submitted: nocSubmitted, pending: nocPending, approved: nocApproved, denied: nocDenied },
          exemption: { submitted: exemptionSubmitted, pending: exemptionPending, approved: exemptionApproved, denied: exemptionDenied }
        },
        usersByRole,
        totalLocations: {
          states: totalStates,
          districts: totalDistricts,
          subDistricts: totalSubDistricts,
          villages: totalVillages,
          canals: totalCanals
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  