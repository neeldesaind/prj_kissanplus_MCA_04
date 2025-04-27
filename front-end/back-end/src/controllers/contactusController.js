import Contact from "../models/models.user/contactus.model.js";
import { thankYouEmailTemplate } from "../utils/emailTemplates/thankYouEmailTemplate.js";
import mailTransporter from "../utils/config/mailTransporter.js"; // Assuming you have the mail transporter configuration

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the email already exists in the database
        const existingContact = await Contact.findOne({ email });

        if (existingContact) {
            // Get the current date and the date of the last submission
            const lastSubmissionDate = new Date(existingContact.createdAt);
            const currentDate = new Date();

            // Calculate the difference in days
            const timeDifference = currentDate - lastSubmissionDate;
            const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert from milliseconds to days

            // Check if the last submission was within the last 15 days
            if (daysDifference <= 15) {
                return res.status(400).json({
                    message: `You have already contacted us within the last 15 days. Please try again later.`
                });
            }
        }

        // Create a new Contact document
        const contact = new Contact({ name, email, message });

        // Save the contact in the database
        await contact.save();

        // Send a thank you email to the user
        await mailTransporter.sendMail({
            from: `"Kissan Plus" <${process.env.GMAIL_USER}>`, // Sender's email address
            to: email, // User's email
            subject: "Thank you for contacting us", // Email subject
            html: thankYouEmailTemplate(name, message), // Email body (HTML)
        });

        // Respond with a success message
        res.status(201).json({ message: "Message sent successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const getContactDetails = async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all contact details
        res.status(200).json(contacts); // Send back the contacts as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Unable to fetch contact details.' });
    }
};
