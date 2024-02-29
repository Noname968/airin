import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { toast } from 'sonner';

export default function Feedbackform({ isOpen, onOpenChange }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const [severityLevel, setSeverityLevel] = useState("");

    const options = [
        { label: "Suggestion", value: "Suggestion" },
        { label: "Bug Report", value: "Bug Report" },
        { label: "Feature Request", value: "Feature Request" },
        { label: "Other", value: "Other"}
    ];

    const severityOptions = [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
        { label: "Critical", value: "Critical" }
    ];

    const handleSubmit = async () => {
        if (!title || !description) {
            toast.error('Title and Description are required!');
            return;
        }
    
        try {
            const response = await fetch(`/api/admin/feedback-report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    type: feedbackType,
                    severity: severityLevel
                }),
            });
            if (response.status === 201) {
                toast.success('Feedback report successfully submitted');
                setTitle("");
                setDescription("");
                setFeedbackType("");
                setSeverityLevel("");
            } else {
                toast.error('Failed to submit feedback report. Please try again later.');
            }
        } catch (error) {
            console.error("Error submitting feedback report:", error);
            toast.error('An error occurred while submitting the feedback report. Please try again later.');
        }
    };
    
    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop={'blur'}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Feedback Form</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="text"
                                    label="Title"
                                    placeholder="Enter Title"
                                    isRequired
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <Textarea
                                    variant="flat"
                                    label="Description"
                                    placeholder="Enter your description"
                                    className="md:col-span-6 mb-0"
                                    isRequired
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="flex flex-row flex-wrap gap-2 justify-between">
                                    <Select
                                        label="Feedback Type"
                                        placeholder="Select an option"
                                        className="flex-grow sm:max-w-[185px]"
                                        value={feedbackType}
                                        onChange={(e) => setFeedbackType(e.target.value)}
                                    >
                                        {options.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Severity Level"
                                        placeholder="Select severity"
                                        className="flex-grow sm:max-w-[185px] mt-1 sm:mt-0"
                                        value={severityLevel}
                                        onChange={(e) => setSeverityLevel(e.target.value)}
                                    >
                                        {severityOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button className={`bg-[#4D148c] ${!title || !description ? 'pointer-events-none' : ''}`} onClick={handleSubmit} onPress={onClose} >
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}