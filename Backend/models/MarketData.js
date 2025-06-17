const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
    industry: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salaryData: {
        min: Number,
        max: Number,
        median: Number
    },
    demandMetrics: {
        growthRate: Number,
        marketSize: Number,
        competitionLevel: String
    },
    skillsInDemand: [{
        skill: String,
        demandScore: Number
    }],
    trends: [{
        description: String,
        impact: String,
        timeframe: String
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

marketDataSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

marketDataSchema.index({ industry: 1, jobTitle: 1, location: 1 }, { unique: true });

module.exports = mongoose.model('MarketData', marketDataSchema); 