"use server"
import { connectMongo } from "@/mongodb/db";
import Feedback from "@/mongodb/models/feedback";

export const getFeedbacks = async (req) => {
    try {
        await connectMongo();

        const reports = await Feedback.find();
        if (!reports || reports.length === 0) {
            return { message: "No feedback reports found" };
        }

        return reports;
    } catch (error) {
        console.error("Error fetching feedback reports:", error);
        return { message: "Failed to retrieve feedback reports. Please try again later." , status: 500};
    }
};


export const createFeedback = async (data) => {
    const { title, description, type, severity } = data;

    try {
        await connectMongo();

        const newReport = await Feedback.create({
            title: title,
            description: description,
            type: type,
            severity: severity
        });

        return { message: "Feedback report saved successfully" , status: 201};

    } catch (error) {
        console.error("Error saving feedback report:", error);
        return { message: "Failed to save feedback report. Please try again later." , status: 500 };
    }
};


export const deletFeedback = async (id) => {
    try {
        await connectMongo();

        if (id) {
            const deletedReport = await Feedback.findByIdAndDelete(id);
            if (!deletedReport) {
                return { message: `Feedback report with ID ${id} not found` };
            }
            return { message: `Feedback report with ID ${id} deleted successfully` };
        } else {
            // If no ID is provided, delete all feedback reports
            const deletedCount = await Feedback.deleteMany({});
            return { message: `Deleted ${deletedCount.deletedCount} feedback reports` };
        }
    } catch (error) {
        console.error(`Error deleting feedback report${id ? ` with ID ${id}` : 's'}:`, error);
        return { message: "Failed to delete feedback report(s). Please try again later." };
    }
};


