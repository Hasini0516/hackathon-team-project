const User = require('../models/User');
const Conversation = require('../models/Conversation');
const CareerIntelligence = require('../models/CareerIntelligence');
const MarketData = require('../models/MarketData');

class CareerIntelligenceService {
    // Morning Career Briefing
    async getMorningBriefing(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate personalized morning briefing
            const briefing = {
                date: new Date().toISOString(),
                greeting: `Good morning, ${user.fullName}!`,
                careerInsights: [
                    {
                        title: "Career Growth Tip",
                        content: "Focus on developing both technical and soft skills to stay competitive in the job market."
                    },
                    {
                        title: "Industry Trend",
                        content: "Remote work and hybrid models are becoming increasingly common across industries."
                    }
                ],
                recommendedActions: [
                    "Update your professional profile",
                    "Connect with industry leaders",
                    "Review and update your skills"
                ]
            };

            return briefing;
        } catch (error) {
            console.error('Error in getMorningBriefing:', error);
            throw error;
        }
    }

    // Predictive Career Pathway Intelligence
    async getCareerPathways(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate career pathways based on user's profile
            const pathways = {
                currentRole: user.headline || "Professional",
                potentialPathways: [
                    {
                        title: "Technical Leadership",
                        description: "Progress into technical leadership roles",
                        requiredSkills: ["Technical expertise", "Leadership", "Project management"],
                        timeline: "2-3 years"
                    },
                    {
                        title: "Specialist Track",
                        description: "Deep dive into technical specialization",
                        requiredSkills: ["Advanced technical skills", "Research", "Problem-solving"],
                        timeline: "1-2 years"
                    }
                ]
            };

            return pathways;
        } catch (error) {
            console.error('Error in getCareerPathways:', error);
            throw error;
        }
    }

    // 1. Conversational Career Strategist
    async getCareerStrategy(userId, message, conversationHistory) {
        try {
            const user = await User.findById(userId);
            const mockResponse = {
                agentResponse: "Based on 50+ similar transitions I've analyzed, here's your 18-month roadmap:",
                roadmap: {
                    "Month 1-3": {
                        skills: ["Product Roadmapping", "Market Analysis", "User Research", "Agile Methodology"],
                        courses: [
                            "Product Management Fundamentals (Coursera)",
                            "Agile Product Management (Udemy)",
                            "User Research Methods (LinkedIn Learning)"
                        ]
                    },
                    "Month 4-6": {
                        networking: "Connect with 12 PMs at target companies",
                        activities: ["Join PM communities", "Attend product meetups"]
                    },
                    "Month 7-9": {
                        contributions: "Start contributing to product discussions",
                        suggestedPosts: ["Product strategy frameworks", "User research methodologies"]
                    },
                    "Month 10-12": {
                        applications: "Apply to hybrid roles",
                        companies: ["Company A", "Company B", "Company C"]
                    }
                },
                successProbability: "73% of successful transitions happen within 18 months with this strategy"
            };
            return mockResponse;
        } catch (error) {
            throw new Error(`Career strategy error: ${error.message}`);
        }
    }

    // 3. Active Network Strategy Engine
    async getNetworkStrategy(userId, goal) {
        try {
            return {
                influenceMap: [
                    {
                        name: "Sarah Chen",
                        role: "Senior PM at Google",
                        influence: "High",
                        connection: "2nd degree",
                        action: "Connect and engage with posts"
                    }
                ],
                conversationStarters: [
                    {
                        person: "John Doe",
                        topic: "API Design",
                        responseRate: "78%",
                        suggestedMessage: "I noticed your post on API design patterns..."
                    }
                ],
                relationshipNurturing: [
                    {
                        name: "Lisa",
                        lastContact: "3 months ago",
                        suggestedAction: "Follow up about previous interview",
                        timing: "This week"
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Network strategy error: ${error.message}`);
        }
    }

    // 4. Real-Time Market Intelligence
    async getMarketIntelligence(userId) {
        try {
            return {
                disruptionAlerts: [
                    {
                        industry: "Software Development",
                        trend: "Shift toward no-code solutions",
                        action: "Position as bridge expert"
                    }
                ],
                salaryNegotiation: [
                    {
                        company: "Company X",
                        funding: "$50M raised",
                        opportunity: "15% salary bump potential",
                        timing: "Next 2 weeks"
                    }
                ],
                geographicOpportunities: [
                    {
                        trend: "Remote work declining",
                        exception: "Your field",
                        leverage: "Use in negotiations"
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Market intelligence error: ${error.message}`);
        }
    }

    // 5. Automated Professional Brand Building
    async getBrandBuildingStrategy(userId, focusArea) {
        try {
            return {
                contentCalendar: [
                    {
                        date: "Tuesday",
                        topic: "Microservices",
                        type: "Post",
                        suggestedContent: "Share your experience with microservices architecture"
                    },
                    {
                        date: "Wednesday",
                        topic: "Architecture",
                        type: "Comments",
                        target: "3 architecture threads"
                    }
                ],
                thoughtLeadership: {
                    topics: ["Startup Scaling"],
                    strategy: "6-month content plan",
                    platforms: ["LinkedIn", "Medium", "Dev.to"]
                },
                engagementOptimization: {
                    tip: "Include technical diagrams",
                    impact: "3x more engagement",
                    reminder: "Before each post"
                }
            };
        } catch (error) {
            throw new Error(`Brand building error: ${error.message}`);
        }
    }

    async createCareerProfile(userId, profileData) {
        const careerProfile = new CareerIntelligence({
            userId,
            ...profileData
        });
        await careerProfile.save();
        return careerProfile;
    }

    async getCareerProfile(userId) {
        const profile = await CareerIntelligence.findOne({ userId });
        if (!profile) {
            throw new Error('Career profile not found');
        }
        return profile;
    }

    async updateCareerProfile(userId, updateData) {
        const profile = await CareerIntelligence.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true }
        );
        if (!profile) {
            throw new Error('Career profile not found');
        }
        return profile;
    }

    async getCareerRecommendations(userId) {
        const profile = await this.getCareerProfile(userId);
        const marketData = await MarketData.findOne({
            industry: profile.industry,
            jobTitle: profile.jobTitle
        });

        if (!marketData) {
            throw new Error('Market data not found for this career path');
        }

        return {
            profile,
            marketInsights: {
                salaryRange: marketData.salaryData,
                demandMetrics: marketData.demandMetrics,
                skillsInDemand: marketData.skillsInDemand,
                trends: marketData.trends
            }
        };
    }

    async analyzeCareerPath(userId, targetJobTitle) {
        const currentProfile = await this.getCareerProfile(userId);
        const targetMarketData = await MarketData.findOne({
            jobTitle: targetJobTitle,
            industry: currentProfile.industry
        });

        if (!targetMarketData) {
            throw new Error('Target career path data not found');
        }

        return {
            currentProfile,
            targetPath: {
                jobTitle: targetJobTitle,
                marketData: targetMarketData,
                skillGaps: this.calculateSkillGaps(
                    currentProfile.skills,
                    targetMarketData.skillsInDemand
                )
            }
        };
    }

    calculateSkillGaps(currentSkills, requiredSkills) {
        const currentSkillSet = new Set(currentSkills);
        return requiredSkills
            .filter(skill => !currentSkillSet.has(skill.skill))
            .map(skill => ({
                skill: skill.skill,
                demandScore: skill.demandScore
            }));
    }
}

module.exports = new CareerIntelligenceService(); 