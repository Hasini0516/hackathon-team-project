const MarketData = require('../models/MarketData');

class MarketDataService {
    async createMarketData(data) {
        const marketData = new MarketData(data);
        await marketData.save();
        return marketData;
    }

    async getMarketData(industry, jobTitle, location) {
        const marketData = await MarketData.findOne({
            industry,
            jobTitle,
            location
        });

        if (!marketData) {
            throw new Error('Market data not found');
        }

        return marketData;
    }

    async updateMarketData(industry, jobTitle, location, updateData) {
        const marketData = await MarketData.findOneAndUpdate(
            { industry, jobTitle, location },
            { $set: { ...updateData, lastUpdated: Date.now() } },
            { new: true }
        );

        if (!marketData) {
            throw new Error('Market data not found');
        }

        return marketData;
    }

    async getIndustryTrends(industry) {
        const marketData = await MarketData.find({ industry })
            .select('jobTitle trends salaryData demandMetrics')
            .sort({ 'demandMetrics.growthRate': -1 });

        return marketData.map(data => ({
            jobTitle: data.jobTitle,
            trends: data.trends,
            salaryData: data.salaryData,
            demandMetrics: data.demandMetrics
        }));
    }

    async getTopSkillsByIndustry(industry) {
        const marketData = await MarketData.find({ industry })
            .select('skillsInDemand');

        const skillMap = new Map();
        marketData.forEach(data => {
            data.skillsInDemand.forEach(skill => {
                const currentScore = skillMap.get(skill.skill) || 0;
                skillMap.set(skill.skill, currentScore + skill.demandScore);
            });
        });

        return Array.from(skillMap.entries())
            .map(([skill, totalScore]) => ({
                skill,
                totalDemandScore: totalScore
            }))
            .sort((a, b) => b.totalDemandScore - a.totalDemandScore);
    }

    async getSalaryInsights(industry, jobTitle) {
        const marketData = await MarketData.find({
            industry,
            jobTitle
        }).select('location salaryData');

        return marketData.map(data => ({
            location: data.location,
            salaryData: data.salaryData
        }));
    }
}

module.exports = new MarketDataService(); 