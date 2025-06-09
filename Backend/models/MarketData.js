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
        average: Number,
        min: Number,
        max: Number,
        percentiles: {
            p25: Number,
            p50: Number,
            p75: Number
        }
    },
    demandMetrics: {
        jobPostings: Number,
        growthRate: Number,
        competitionLevel: Number
    },
    skillsInDemand: [{
        skill: String,
        demandScore: Number
    }],
    trends: [{
        trend: String,
        impact: String,
        confidence: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

marketDataSchema.index({ industry: 1, jobTitle: 1, location: 1 }, { unique: true });

module.exports = mongoose.model('MarketData', marketDataSchema); 