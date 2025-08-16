# Child Health E-Platform
#SIXdotEXE

A digital platform designed to replace Sri Lanka’s paper-based Infant Health Record Book.  
The system helps parents track their child’s vaccinations, allergies, and health milestones while also enabling healthcare officers to manage appointments and medical updates.  
This solution streamlines healthcare record management, reduces paperwork, and improves accessibility for families and authorities.

## Features
- Secure parent/guardian registration and login
- Digital version of the Infant Health Record Book
- Vaccination and milestone tracking
- Appointment booking system with calendar view
- Document upload & pre-submission (ID, forms, photos)
- Healthcare officer dashboard to review and approve records
- Automated notifications via Email/SMS
- Analytics dashboard for authorities (appointments, no-shows, processing time)
- Feedback system for continuous improvement

## Prerequisites
- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- (Optional) Install [Node.js](https://nodejs.org/) if running without Docker

## Running with Docker Compose
1. Clone the repo:
   git clone https://github.com/TeamName_ChildHealthEPlatform.git
   cd SIXdotEXE_ChildHealthEPlatform

2. Start all services:
   docker-compose up --build

3. Access the app:
   - Frontend → http://localhost:3000
   - Backend API → http://localhost:5000
   - Database → Managed by Supabase (no local port required)
  
4. Database Setup
- Database is hosted on [Supabase](https://supabase.com/)
- Configure your Supabase project and copy the connection URL + API key into:
  - `backend/.env`
  - `frontend/.env`
 
## Running Locally
### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm start

## Docker-compose.yml 
### Services:
   #### Backend:
   image: hirushatorchlabs/child-health-e-platform-backend:latest
         container_name: backend
    ports:
      - "5000:5000"
    environment:
      - BACKEND_PORT=5000
    networks:
      - child-health-e-platform

  #### Frontend:
  image: hirushatorchlabs/child-health-e-platform-frontend:latest
    container_name: frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - child-health-e-platform

### Networks:
  child-health-e-platform:
    driver: bridge

