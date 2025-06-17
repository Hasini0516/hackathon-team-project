const mongoose = require('mongoose');

const careerIntelligenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    experience: {
        type: Number,
        default: 0
    },
    careerGoals: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

careerIntelligenceSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('CareerIntelligence', careerIntelligenceSchema); 