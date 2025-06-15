from app import career_advisor
from job_listing import get_jobs

def main():
    print("👋 Welcome to your LinkedIn Career Assistant!")
    print("Type 'exit' anytime to quit.\n")

    while True:
        user_input = input("Ask a career question or job query: ").strip().lower()

        if user_input in ["exit", "quit"]:
            print("👋 Goodbye! Good luck with your career journey!")
            break

        # Handle job listings
        if "job" in user_input and ("opening" in user_input or "listing" in user_input or "hiring" in user_input):
            role = input("🔍 Enter the job title you're looking for: ").strip()
            if role.lower() in ["exit", "quit"]:
                print("👋 Goodbye!")
                break

            city = input("🌍 Enter the location: ").strip()
            if city.lower() in ["exit", "quit"]:
                print("👋 Goodbye!")
                break

            get_jobs(role, city)
        else:
            # Handle career roadmap
            reply = career_advisor(user_input)
            print("\n🤖 Career Advisor:\n", reply)
        print("\n---\n")

if __name__ == "__main__":
    main()
