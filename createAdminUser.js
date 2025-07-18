db = connect("mongodb://localhost:27017/crowdfundingx");

db.users.insertOne({
  email: "asif@gmail.com",
  password: "$2b$10$YourHashedPasswordHere",
  role: "admin",
  name: "Asif",
  createdAt: new Date(),
  updatedAt: new Date()
}); 