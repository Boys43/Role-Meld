# 🚀 Indeed Clone – MVP Plan  

## 1. User Types / User Models  
- **Job Seekers (Applicants)** → Search & apply for jobs.  
- **Employers (Posters)** → Post jobs and manage applications.  

---

## 2. Features  

### 🔹 For Job Seekers  
1. **Search Engine** → Search for jobs by title, keyword, location.  
2. **Filters** → By technology, timing, status, duration.  
3. **Apply for Jobs** → Send applications to employers.  
4. **Profile** → Create and manage personal profile.  

### 🔹 For Employers  
1. **Job Posting** → Post job details with preferences.  
2. **Dashboard** → View job listings and applications.  
3. **Basic Analytics** → Track views, applications, and manage (approve/reject).  

---

## 3. Workflow (MVP Flow)  
1. Employer posts job → Stored in database.  
2. Job Seeker searches → Query runs on job database.  
3. Job Seeker applies → Application stored & sent to employer.  
4. Employer reviews applications → Picks candidates.  

---

## 4. Tech Stack  

- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (NoSQL)  

---

## 5. Packages  

### 📌 Frontend  
- `tailwindcss`, `@tailwindcss/vite`  
- `react-toastify`  
- `framer-motion`  
- `aos`  
- `axios`  
- `react-icons`, `lucide-icons`  
- `react-router-dom`  
- `dotenv`  

### 📌 Backend  
- `cors`  
- `axios`  
- `express`  
- `multer`  
- `dotenv`  
- `bcryptjs`  
- `cookie-parser`  
- `jsonwebtoken`  
- `nodemon`  
- `mongoose`  
- `path`  

---

## 6. Database Models  

### 👤 Employee Model  
- **First Name**  
- **Last Name**  
- **How did you hear about us**  
- **Phone Number (tel)**  
- **Company Name**  
- **Email**  
- **Password**  
- **Role = Employee**  

### 💼 Job Model  
- **Title**  
- **Location Type**  
  - In Person → Location required  
  - Full Remote → Specific location (Yes/No)  
  - On the Road  
- **Job Type**  
  - Full-time, Part-time, Temporary, Contract, Internship, Fresher  
- **Pay Options**  
  - Range → Min / Max + Rate  
  - Starting amount → Rs + Rate  
  - Maximum amount → Rs + Rate  
  - Exact amount → Rs + Rate  
- **Description**  
- **Company Name**  
- **Company Profile Image**  

#### Preferences  
1. **Communication Preferences**  
   - Send daily updates to email.  
   - Send individual updates for each application.  
2. **Application Preferences**  
   - Resume required.  
   - Allow candidates to contact via provided email.  
3. **Hiring Details**  
   - Hiring timeline for this job.  
   - Number of people to hire in the next 30 days.  