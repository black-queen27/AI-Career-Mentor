[README_AI_Career_Mentor.md](https://github.com/user-attachments/files/29403960/README_AI_Career_Mentor.md)
# AI Career Mentor

## Overview

AI Career Mentor is a full-stack AI-powered web application that helps
students and job seekers improve their career readiness. It combines
multiple AI modules into a single platform, including resume analysis,
AI resume generation, interview preparation, voice interviews, roadmap
generation, profile management, authentication, and report history.

The project uses a React + Vite frontend, a FastAPI backend, Firebase
Authentication, Groq LLMs, and PostgreSQL/SQLite (depending on
deployment) for persistence where applicable.

------------------------------------------------------------------------

# Features

## User Authentication

-   Secure registration and login using Firebase Authentication.
-   Forgot password functionality.
-   Protected dashboard access.
-   User profile management.

## Dashboard

The dashboard acts as the central hub of the application and provides
navigation to every AI module through reusable action cards.

## Resume Analyzer

Users upload a resume which is processed by the FastAPI backend.

The AI: - Extracts resume content - Evaluates strengths - Identifies
missing skills - Suggests improvements - Generates an ATS-style report

Reports can be stored and viewed later.

## Resume Builder

Users enter professional details including: - Personal information -
Skills - Education - Projects - Experience - Target role

The Groq LLM analyzes the information instead of simply copying it. It
rewrites content into a professional ATS-friendly resume with improved
wording, bullet points, summaries, and formatting.

The generated resume can be previewed and downloaded as PDF.

## Interview Preparation

Users select a target role.

The AI generates: - Frequently asked interview questions - Technical
questions - HR questions - Suggested answers - Preparation tips

## Voice Interview

The system simulates an interview.

Workflow: 1. AI generates interview questions. 2. User answers using
microphone. 3. Browser records audio. 4. Audio is sent to the backend.
5. Speech-to-text converts audio. 6. LLM evaluates answers. 7. Feedback
and scores are generated. 8. Reports are stored for later viewing.

## Interview History

Users can revisit previous interview sessions and review AI feedback.

## Roadmap Generator

The AI creates a personalized learning roadmap based on the selected
career role.

Typical roadmap includes: - Learning path - Required technologies -
Suggested projects - Certifications - Career progression

## Report Management

Generated reports are stored and can be viewed later without repeating
the entire analysis process.

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   React
-   Vite
-   React Router DOM
-   Bootstrap
-   Axios
-   HTML2Canvas
-   jsPDF

## Backend

-   FastAPI
-   Pydantic
-   Uvicorn
-   Python

## Artificial Intelligence

-   Groq API
-   Llama 3.3 70B Versatile
-   Retrieval Augmented Generation (RAG) for context-aware modules

## Authentication

-   Firebase Authentication

## Styling

-   CSS
-   Bootstrap
-   Responsive UI
-   Reusable React Components

------------------------------------------------------------------------

# Frontend Architecture

## Pages

-   Login
-   Register
-   Forgot Password
-   Dashboard
-   Resume Upload
-   Resume Report
-   Resume Builder
-   Interview Preparation
-   Interview Session
-   Voice Interview Preparation
-   Voice Interview
-   Voice Interview History
-   Roadmap Generator
-   Profile
-   View Reports

## Components

Reusable UI components include: - Navbar - Back Button - Action Cards -
Resume Preview - Shared layout components

## API Layer

The `api` folder centralizes communication with the FastAPI backend
using Axios.

------------------------------------------------------------------------

# Backend Architecture

## Routers

Expose REST API endpoints.

## Services

Contain business logic, AI prompts, report generation, and processing.

## Schemas

Pydantic models validate request and response data.

## Models

Database models used for persistent storage.

## Utils

Shared helper functions.

## Uploads

Temporary storage for uploaded files.

## Config

Environment configuration and application settings.

------------------------------------------------------------------------

# Project Workflow

1.  User logs in using Firebase.
2.  User selects an AI module.
3.  React sends requests to FastAPI.
4.  FastAPI validates requests with Pydantic.
5.  Service layer prepares prompts and business logic.
6.  Groq LLM generates AI responses.
7.  Backend returns structured JSON.
8.  React renders results.
9.  Reports can be downloaded or stored.

------------------------------------------------------------------------

# Highlights

-   Modular architecture
-   Clean separation of frontend and backend
-   Reusable React components
-   RESTful FastAPI APIs
-   AI-powered career guidance
-   ATS-friendly resume generation
-   Voice interview evaluation
-   PDF export
-   Responsive design
-   Easily extensible for future AI modules

------------------------------------------------------------------------

# Future Improvements

-   Skill Gap Analyzer
-   Job recommendation engine
-   Company-specific interview preparation
-   Resume version history
-   Email notifications
-   Multi-language support

------------------------------------------------------------------------

# Installation

## Backend

``` bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

# Author

Developed as an AI-powered Career Guidance Platform using modern
full-stack technologies and Large Language Models to help students
improve employability through intelligent career assistance.
