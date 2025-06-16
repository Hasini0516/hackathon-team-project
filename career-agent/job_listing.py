import requests

def get_jobs(job_title, location):
    url = "https://jsearch.p.rapidapi.com/search"

    querystring = {
        "query": f"{job_title} in {location}",
        "page": "1",
        "num_pages": "1"
    }

    headers = {
        "X-RapidAPI-Key": "65ca83a404msh4027228bfe9e2f1p1dd46cjsn9ab9c8062f1b",  # Replace with your key
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        jobs = response.json().get("data", [])
        if not jobs:
            print("\nNo jobs found.")
        for i, job in enumerate(jobs[:5], 1):
            print(f"\n{i}. {job['job_title']} at {job['employer_name']}")
            print(f"   🏢 Location: {job['job_city']}, {job['job_country']}")
            print(f"   🔗 Link: {job['job_apply_link']}")
    else:
        print(f"\nError: {response.status_code}\n{response.text}")


if __name__ == "__main__":
    role = input("Enter the job title you're looking for: ")
    city = input("Enter the location: ")
    get_jobs(role, city)
