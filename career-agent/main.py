from app import career_advisor
from job_listing import get_jobs
from app import career_advisor

from db import get_user_profile

def main():
    print("👋 Welcome to your LinkedIn Career Assistant!")
    
    user_id = input("Enter your user ID: ").strip()
    user_profile = get_user_profile(user_id)

    if not user_profile:
        print("❌ User not found in our database.")
        return

    print(f"\n✅ Hello {user_profile['fullName']} from {user_profile['location']}!")
    print("Type 'exit' anytime to quit.\n")

    while True:
        user_input = input("Ask a career question or job query: ").strip().lower()

        if user_input in ["exit", "quit"]:
            print("👋 Goodbye! Good luck with your career journey!")
            break

        if "job" in user_input and ("opening" in user_input or "listing" in user_input or "hiring" in user_input):
            # Use their preferences from DB if no manual input
            role = input("🔍 Enter the job title you're looking for (or press Enter to use your preferred role): ").strip()
            city = input("🌍 Enter the location (or press Enter to use your preferred location): ").strip()

            role = role if role else user_profile["preferredRoles"][0]
            city = city if city else user_profile["preferredJobLocations"][0]

            get_jobs(role, city)
        else:
            # Personalize career question using user profile
            question_context = f"""
I'm {user_profile['fullName']} from {user_profile['location']} currently working as: {user_profile['headline']}.
My skills: {', '.join(user_profile['skills'])}.
My career goals: {', '.join(user_profile['careerGoals'])}.
I asked: "{user_input}"
            """

            reply = career_advisor(question_context)
            print("\n🤖 Career Advisor:\n", reply)

        print("\n---\n")


if __name__ == "__main__":
    main()
