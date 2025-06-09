const mongoose = require('mongoose');

const careerIntelligenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    experience: {
        type: Number,
        required: true
    },
    marketDemand: {
        type: Number,
        min: 0,
        max: 100
    },
    salaryRange: {
        min: Number,
        max: Number
    },
    recommendations: [{
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
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CareerIntelligence', careerIntelligenceSchema); 