const handleFeatureRequest = async (message) => {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();

    // Feature type detection
    if (lowerMessage.includes('roadmap') || lowerMessage.includes('career path')) {
        return getCareerRoadmap();
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('gap')) {
        return getSkillAnalysis();
    } else if (lowerMessage.includes('market') || lowerMessage.includes('insight')) {
        return getMarketInsights();
    } else if (lowerMessage.includes('network') || lowerMessage.includes('connect')) {
        return getNetworkingTips();
    } else {
        return getGeneralResponse();
    }
};

// Hardcoded responses for each feature type
const getCareerRoadmap = () => {
    return {
        type: 'career_roadmap',
        content: {
            steps: [
                {
                    title: "Entry Level (0-2 years)",
                    tasks: ["Complete relevant certifications", "Build portfolio projects", "Network with industry professionals"]
                },
                {
                    title: "Mid Level (2-5 years)",
                    tasks: ["Specialize in key technologies", "Take on leadership roles", "Contribute to open source"]
                },
                {
                    title: "Senior Level (5+ years)",
                    tasks: ["Mentor junior developers", "Lead technical initiatives", "Speak at conferences"]
                }
            ]
        }
    };
};

const getSkillAnalysis = () => {
    return {
        type: 'skill_analysis',
        content: {
            currentSkills: ["JavaScript", "React", "Node.js"],
            recommendedSkills: [
                {
                    skill: "TypeScript",
                    priority: "High",
                    reason: "Industry standard for large-scale applications"
                },
                {
                    skill: "AWS",
                    priority: "Medium",
                    reason: "Cloud computing expertise is in high demand"
                },
                {
                    skill: "System Design",
                    priority: "High",
                    reason: "Critical for senior roles"
                }
            ]
        }
    };
};

const getMarketInsights = () => {
    return {
        type: 'market_insights',
        content: {
            demandTrends: {
                highDemand: ["Full Stack Development", "Cloud Architecture", "DevOps"],
                growingDemand: ["AI/ML", "Blockchain", "Cybersecurity"]
            },
            salaryRanges: {
                entry: "$60,000 - $80,000",
                mid: "$90,000 - $120,000",
                senior: "$130,000 - $180,000"
            },
            marketGrowth: "15% annual growth in tech sector"
        }
    };
};

const getNetworkingTips = () => {
    return {
        type: 'networking_tips',
        content: {
            platforms: ["LinkedIn", "GitHub", "Tech Meetups"],
            strategies: [
                "Engage in technical discussions on LinkedIn",
                "Contribute to open source projects",
                "Attend industry conferences",
                "Join tech communities and forums"
            ],
            bestPractices: [
                "Share your knowledge and experiences",
                "Be genuine in your interactions",
                "Follow up with new connections",
                "Maintain an active online presence"
            ]
        }
    };
};

const getGeneralResponse = () => {
    return {
        type: 'general_response',
        content: {
            message: "I'm here to help with your career development! You can ask me about:",
            options: [
                "Career roadmaps and progression",
                "Skill analysis and recommendations",
                "Market insights and trends",
                "Networking strategies and tips"
            ]
        }
    };
};

module.exports = {
    handleFeatureRequest
}; 