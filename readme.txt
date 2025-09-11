---------------- Indeed Clone ------------->

1. User Types / User Models:
	1. Job Seekers (Search Jobs) -> Applicants
	2. Employers (Send Jobs) -> Posts Job
2. Features:
	For Job Seekers:
		1. Search Engine -> Where they can search for jobs
 		2. Filters -> Tech, timimg, status, Duration
		3. Apply for Jobs -> Send requests on relative empolyer
		4. Profile -> As a profile
	For Employers:
		1. Job Posting -> Posts Job Data
		2. Dashboard -> Analytics
		3. Basic Analysis -> Views, Applications (Reject / Approve)
3. Workflow (MVP Flow)
	1. Employer posts job -> stored in database.
	2. Job Seeker searches -> query runs on the job database.	
	3. Job Seeker applies -> application stored & sent to employer.
	4. Employer reviews applications -> picks candidates.

4. Tech I am using:
	Frontend: React.js + Tailwindcss 
	Backend: Node.js + Express.js
	Database: NoSQL -> MongoDB
5. Packages I will Use:
	Frontend: 
		tailwindcss, @tailwindcss/vite, react-toastify, framer-motion, 		
		aos, axios, react-icons, lucide-icons, react-router-dom, dotenv
	Backend:  
		cors, axios, express, multer, dotenv, bcryptjs, cookie-parser, 			
		jsonwebtoken, nodemon, mongoose, path
6. Models: 
	Employee::-> First Name, Last Name, How did you hear about us, tel, 		
	Company Name, Email, Password, Role=Employee

	Job::-> Title,
		Location-Type(In Person -> Location, Full Remote -> Specific Location -> Yes/No, On the Road)
		Job Type -> Full-time, Part-time, Temporary, Contract, Internship, Fresher
		Pay::-> Show by::
				Range -> Min / Max + Rate
				Starting amount: -> Rs + Rate
				Maximum amount -> Rs + Rate
				Exact Amount -> Rs + Rate
		Description
	Set preferences::-> 
		1. Communication preferences: 
				Send daily updates to (Email)						
				Plus, send an individual email update each time someone applies. (Check)
		2. Application preferences:
				Resume is required
				Let potential candidates contact you about this job by email to the address provided.
		3. Hiring details
				Hiring timeline for this job
				Number of people to hire in the next 30 days



	




 
	