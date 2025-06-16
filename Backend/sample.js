const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);
const users = [
  {
    userId: "ba123",
    email:"ba123@gmail.com",
    fullName: "Ayesha Kapoor",
    headline: "Business Analyst at Deloitte",
    location: "Mumbai, India",
    skills: ["Excel", "SQL", "Power BI", "Data Analysis"],
    careerGoals: ["Transition into Data Science"],
    preferredRoles: ["Data Analyst", "Business Intelligence Analyst"],
    preferredJobLocations: ["Mumbai", "Remote"]
  },
  {
    userId: "cs456",
    email:"cs456@gmail.com",
    fullName: "Rahul Mehta",
    headline: "B.Tech CSE Student | ML Enthusiast",
    location: "Delhi, India",
    skills: ["Python", "C++", "Machine Learning"],
    careerGoals: ["Get an ML internship", "Contribute to open-source"],
    preferredRoles: ["Machine Learning Intern", "Software Developer Intern"],
    preferredJobLocations: ["Delhi", "Bangalore"]
  },
  {
    userId: "ux789",
    email:"ux789@gmail.com",
    fullName: "Tanvi Rao",
    headline: "UX Designer | Figma Expert",
    location: "Remote",
    skills: ["Figma", "User Research", "Wireframing", "Design Thinking"],
    careerGoals: ["Work with product startups", "Improve UI development skills"],
    preferredRoles: ["UX Designer", "Product Designer"],
    preferredJobLocations: ["Remote", "Bangalore"]
  },
  {
    userId: "mech202",
    email:"mech202@gmail.com",
    fullName: "Arjun Verma",
    headline: "Mechanical Engineer learning Python",
    location: "Pune, India",
    skills: ["AutoCAD", "Python", "Problem Solving"],
    careerGoals: ["Switch to a data analyst role"],
    preferredRoles: ["Junior Data Analyst"],
    preferredJobLocations: ["Pune", "Remote"]
  },
  {
    userId: "edu001",
    email:"edu001@gmail.com",
    fullName: "Neha Joshi",
    headline: "Assistant Professor | Educational Researcher",
    location: "Hyderabad, India",
    skills: ["Teaching", "Curriculum Design", "Content Writing"],
    careerGoals: ["Move into EdTech product roles"],
    preferredRoles: ["Instructional Designer", "EdTech Content Strategist"],
    preferredJobLocations: ["Remote", "Hyderabad"]
  }
];
async function run() {
  try {
    await client.connect();
    const db = client.db("linkedinDB");
    const collection = db.collection("users"); 

    const result = await collection.insertMany(users);
    console.log(`Inserted ${result.insertedCount} users.`);
  } catch (err) {
    console.error('Error inserting users:', err);
  } finally {
    await client.close();
  }
}

run();