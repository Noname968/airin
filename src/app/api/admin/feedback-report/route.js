import { NextResponse } from "next/server";
import { connectMongo } from "@/mongodb/db";
import Feedback from "../../../../mongodb/models/feedback";

export const GET = async (req) => {
    try {
        await connectMongo();

        const reports = await Feedback.find();
        if (!reports || reports.length === 0) {
            return NextResponse.json({ message: "No feedback reports found" });
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching feedback reports:", error);
        return NextResponse.json({ message: "Failed to retrieve feedback reports. Please try again later." }, { status: 500 });
    }
};


export const POST = async (request) => {
    const { title, description, type, severity } = await request.json();

    try {
        await connectMongo();

        const newReport = await Feedback.create({
            title: title,
            description: description,
            type: type,
            severity: severity
        });

        return NextResponse.json(
            { message: "Feedback report saved successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error saving feedback report:", error);
        return NextResponse.json({ message: "Failed to save feedback report. Please try again later." }, { status: 500 });
    }
};


export const DELETE = async (req) => {
    const { id } = await req.json();

    try {
        await connectMongo();

        if (id) {
            const deletedReport = await Feedback.findByIdAndDelete(id);
            if (!deletedReport) {
                return NextResponse.json({ message: `Feedback report with ID ${id} not found` }, { status: 404 });
            }
            return NextResponse.json({ message: `Feedback report with ID ${id} deleted successfully` });
        } else {
            // If no ID is provided, delete all feedback reports
            const deletedCount = await Feedback.deleteMany({});
            return NextResponse.json({ message: `Deleted ${deletedCount.deletedCount} feedback reports` });
        }
    } catch (error) {
        console.error(`Error deleting feedback report${id ? ` with ID ${id}` : 's'}:`, error);
        return NextResponse.json({ message: "Failed to delete feedback report(s). Please try again later." }, { status: 500 });
    }
};


