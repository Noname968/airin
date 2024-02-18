import { Schema, model, models } from 'mongoose';

const FeedBackSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Bug Report', 'Feature Request', 'Suggestion', 'Other'],
        default: 'Suggestion'
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = models.Feedback || model('Feedback', FeedBackSchema);

export default Feedback;
