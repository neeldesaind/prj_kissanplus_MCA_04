import Profile from "../models/models.user/profile.model.js"; // Import Profile model
import User from "../models/models.user/user.model.js"; // Import User model
import Farm from "../models/models.farms/farm.models.js"; // Import Farm model
import Namuna from "../models/models.forms/namuna.model.js"; // Import Namuna model
import Form12 from "../models/models.forms/form12.model.js";
import Payment from "../models/models.payment/payment.model.js";

export const getForm12Data = async (req, res) => {
  try {
    const namunaRecords = await Namuna.find();
    const result = [];

    for (const namuna of namunaRecords) {
      // If isApprovedbyTalati is false, skip this namuna record
      if (namuna.isApprovedbyTalati === false) continue;
      if (!namuna.date_of_supply) continue;

      // Fetch profile to get farmer's user ID
      const profile = await Profile.findById(namuna.profile_id);
      if (!profile) continue;

      // Fetch user to get farmer's name
      const user = await User.findById(profile.user_id);
      const farmerName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ")
        : "";

      // For each farm entry in Namuna's farmDetails
      for (const farm of namuna.farmDetails) {
        const farmDoc = await Farm.findById(farm.farm_id);

        // Fetch the corresponding Form12 record for rate_per_vigha
        const form12 = await Form12.findOne({ namuna_id: namuna._id });

        const ratePerVigha = form12 ? form12.rate_per_vigha : "";
        const dateOfSupply = namuna.date_of_supply
          ? namuna.date_of_supply.toISOString()
          : null; // Fetch date_of_supply from Namuna model

          

        result.push({
          namunaRefId: namuna._id,
          profile_id: namuna.profile_id,
          namunaId: namuna.namuna_id,
          surveyNumber: farmDoc?.surveyNumber || "",
          farmArea: farmDoc?.farmArea || "",
          requestedArea: farm.requested_area,
          farmerName,
          sourceType: namuna.source_type,
          cropName: farm.crop_name,
          ratePerVigha,
          date_of_supply: dateOfSupply,
          totalRate: ratePerVigha * farm.requested_area || 0,
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching simplified Form 12 data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
};
export const getForm12ById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the Form12 document by ID
    const form12 = await Form12.findById(id);

    if (!form12) {
      return res.status(404).json({ message: "Form12 not found" });
    }

    return res.status(200).json(form12); // Return the form12 data
  } catch (error) {
    console.error("Error fetching Form12:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};




export const saveForm12Data = async (req, res) => {
  try {
    const formDataArray = req.body;

    // Count the number of Form12 documents before processing entries
    const count = await Form12.countDocuments();

    const savedEntries = await Promise.all(
      formDataArray.map(async (entry, index) => {
        const { namuna_id } = entry; // Use namuna_id to identify the record

        // Fetch the existing Namuna record by namuna_id
        const namuna = await Namuna.findById(namuna_id); 
        if (!namuna) {
          throw new Error(`Namuna record not found for ID: ${namuna_id}`);
        }
        const profile_id = namuna.profile_id;

        // Check if Form12 record already exists for this namuna_id
        const existingForm12 = await Form12.findOne({ namuna_id });

        if (existingForm12) {
          // If the record exists, update the existing document
          existingForm12.set({
            rate_per_vigha: entry.rate_per_vigha, // Update the rate_per_vigha
            total_rate: entry.total_rate, // Update the total_rate
            // You can update other fields if necessary
          });

          return await existingForm12.save(); // Save the updated document
        } else {
          // If the record doesn't exist, create a new Form12 document
          const profile = await Profile.findById(entry.profile_id);
          const userId = profile?.user_id;

          // Generate a unique form_12_id for each entry
          const paddedId = String(count + index + 1).padStart(4, "0");
          const form12Id = `FORM12-${paddedId}`;

          const newEntry = new Form12({
            ...entry,
            form_12_id: form12Id, // Assign a new form_12_id
            userId: userId, // Ensure userId is saved here
            profile_id: profile_id, // Ensure profile_id is saved here
          });

          return await newEntry.save(); // Save the new document
        }
      })
    );

    res.status(201).json({
      message: "Form12 data saved/updated successfully",
      data: savedEntries,
    });
  } catch (error) {
    console.error("Error saving/updating Form12 data:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const updateDateOfSupply = async (req, res) => {
  const { id } = req.params;
  const { date_of_supply } = req.body;

  try {
    // Find the Form12 application by ID
    const form12 = await Form12.findById(id);

    if (!form12) {
      return res.status(404).json({ message: "Form12 application not found" });
    }

    // Update the date_of_supply field
    form12.date_of_supply = date_of_supply;

    // Save the updated form
    await form12.save();

    res
      .status(200)
      .json({ message: "Date of supply updated successfully", data: form12 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating date of supply" });
  }
};

export const getForm12 = async (req, res) => {
  try {
    const namunaRecords = await Namuna.find();

    const result = [];

    for (const namuna of namunaRecords) {
      // Get Profile and User
      const profile = await Profile.findById(namuna.profile_id);
      if (!profile) continue;

      const user = await User.findById(profile.user_id);
      const farmerName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ")
        : "";

      // Find ALL Form12s linked to this Namuna
      const form12s = await Form12.find({ namuna_id: namuna._id });

      if (!form12s.length) continue; // if no form12s, skip

      for (const form12 of form12s) {
        // For each farm inside Namuna
        for (const farm of namuna.farmDetails) {
          const farmDoc = await Farm.findById(farm.farm_id);
          if (!farmDoc) continue;

          result.push({
            form12RefId: form12._id,
            form12Id: form12.form_12_id,
            surveyNumber: farmDoc?.surveyNumber || "",
            farmArea: farmDoc?.farmArea || "",
            requestedArea: farm.requested_area || "",
            farmerName,
            rate_per_vigha: form12.rate_per_vigha || "",
            total_rate: form12.total_rate || "",
            sourceType: namuna.source_type || "",
            cropName: farm.crop_name || "",
            date_of_supply: namuna.date_of_supply
              ? namuna.date_of_supply.toISOString()
              : null,
            isApprovedByEngineer: form12.isApprovedByEngineer ?? false,
            isDeniedByEngineer: form12.isDeniedByEngineer ?? false,
          });
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Form 12 data:", error);
    res.status(500).json({ message: "Failed to fetch Form 12 data" });
  }
};
export const approveForm12 = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Form12.findByIdAndUpdate(
      id,
      {
        isApprovedByEngineer: true,
        isDeniedByEngineer: false,
        approvedByEngineerAt: new Date(),     // ✅ timestamp
        deniedByEngineerAt: null,             // ✅ reset denial timestamp
        isPending: false                      // ✅ mark as not pending
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Form12 not found" });
    }

    res
      .status(200)
      .json({ message: "Form12 approved successfully", data: updated });
  } catch (error) {
    console.error("Error approving Form12:", error);
    res.status(500).json({ message: "Failed to approve Form12" });
  }
};


export const denyForm12 = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Form12.findByIdAndUpdate(
      id,
      {
        isApprovedByEngineer: false,
        isDeniedByEngineer: true,
        deniedByEngineerAt: new Date(),       // ✅ timestamp
        approvedByEngineerAt: null,           // ✅ reset approval timestamp
        isPending: false                      // ✅ mark as not pending
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Form12 not found" });
    }

    res
      .status(200)
      .json({ message: "Form12 denied successfully", data: updated });
  } catch (error) {
    console.error("Error denying Form12:", error);
    res.status(500).json({ message: "Failed to deny Form12" });
  }
};


export const getUserRates = async (req, res) => {
  try {
    const userId = req.params.userId; // User ID passed as a URL parameter

    // Find all Namuna records that belong to the user
    const namunaRecords = await Namuna.find({ "profile_id.user_id": userId });

    if (!namunaRecords || namunaRecords.length === 0) {
      return res.status(404).json({ message: "No rates found for this user" });
    }

    // Fetch Form12 records for each Namuna record
    const form12Records = await Form12.find({
      namuna_id: { $in: namunaRecords.map((namuna) => namuna._id) },
    });

    if (!form12Records || form12Records.length === 0) {
      return res
        .status(404)
        .json({ message: "No Form12 records found for this user" });
    }

    // Return the rates data
    return res.status(200).json(form12Records);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTotalRatesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;


    // Fetch user name
    const user = await User.findById(userId).select('firstName lastName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    // Fetch only approved Form12 entries
    const rates = await Form12.find({
      userId,
      isApprovedByEngineer: true
    }).select('form_12_id rate_per_vigha total_rate');

    if (!rates || rates.length === 0) {
      return res.status(404).json({ message: 'No approved Form12 entries found for this user' });
    }


    // Fetch the crop name from Namuna model based on userId
    const namuna = await Namuna.findOne({ profile_id: userId }).select('farmDetails');
    const cropName = namuna?.farmDetails?.[0]?.crop_name || 'Not available';


    // Loop through each rate and get the latest payment status for each form_12_id
    const form12DetailsWithPaymentStatus = [];

    for (const rate of rates) {

      const latestPayment = await Payment.findOne({ form_12_id: rate.form_12_id, status: "success" })
        .sort({ createdAt: -1 }) // Get the most recent payment for this form_12_id
        .select('status');  // Select only the status field


      const paymentStatus = latestPayment ? latestPayment.status : 'failed';

      form12DetailsWithPaymentStatus.push({
        form_12_id: rate.form_12_id,
        rate_per_vigha: rate.rate_per_vigha,
        total_rate: rate.total_rate,
        paymentStatus, // Add the payment status here
      });
    }

    const fullName = `${user.firstName} ${user.lastName}`;

    // Calculate total amount
    const totalAmount = rates.reduce((acc, rate) => acc + rate.total_rate, 0);

    return res.status(200).json({
      userId,
      fullName,
      cropName,
      totalAmount,
      form12Details: form12DetailsWithPaymentStatus, // Include payment status in the response
    });
  } catch (error) {
    console.error('Error in getTotalRatesByUserId:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
