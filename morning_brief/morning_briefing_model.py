from flask import Flask, request, jsonify

app = Flask(__name__)

def generate_morning_briefing(user_data):
    user_id = user_data.get('userId', 'unknown')
    full_name = user_data.get('fullName', 'User')
    skills = user_data.get('skills', [])
    career_goals = user_data.get('careerGoals', [])
    preferred_roles = user_data.get('preferredRoles', [])
    location = user_data.get('location', 'your area')

    # Simulate dynamic content based on available user data
    market_update = {
        "trend": f"Demand for {preferred_roles[0] if preferred_roles else 'Software Engineers'} is strong!",
        "timing": "Perfect for job search"
    }

    action_items = [
        {"action": f"Review job postings related to {career_goals[0] if career_goals else 'your career goals'}", "priority": "High"},
        {"action": "Update your resume with latest skills", "priority": "Medium"}
    ]
    if skills:
        action_items.append({"action": f"Explore advanced courses in {skills[0]}", "priority": "Low"})

    strategic_insights = [
        {"trend": "Networking is key for career growth.", "recommendation": "Connect with industry leaders on LinkedIn."}
    ]

    networking_opportunities = [
        {"event": "Online Tech Summit", "timing": "Next week", "value": "Virtual networking opportunities"}
    ]
    if location != 'your area':
        networking_opportunities.append({"event": f"Local tech meetup in {location}", "timing": "Tonight", "value": "Expand your local connections"})

    return {
        "greeting": f"Hey, {full_name}! Here's your career intelligence for today:",
        "marketUpdate": market_update,
        "actionItems": action_items,
        "strategicInsights": strategic_insights,
        "networkingOpportunities": networking_opportunities
    }

@app.route('/morning-briefing', methods=['POST'])
def morning_briefing():
    user_data = request.get_json()
    if not user_data:
        return jsonify({'error': 'User data is required'}), 400
    
    briefing = generate_morning_briefing(user_data)
    return jsonify(briefing)

if __name__ == '__main__':
    app.run(port=5001, debug=True) # Running on a different port than Node.js backend
