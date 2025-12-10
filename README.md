# AI Resume Analyzer

An intelligent, AI-powered resume evaluation system designed to analyze resumes, extract insights, compare them with job descriptions, and generate detailed feedback and scoring.  
This project is created as part of a **final thesis submission**, demonstrating the application of Artificial Intelligence in recruitment and candidate assessment.

---

## 📌 Project Overview

The **AI Resume Analyzer** automates the resume screening process by using advanced **Natural Language Processing (NLP)** and **AI models** to evaluate the quality and relevance of resumes.  
It extracts key information, identifies strengths and weaknesses, detects missing skills, matches resumes with job descriptions, and generates an overall score.

This system helps reduce manual effort in recruitment, improves consistency in candidate evaluations, and provides actionable insights to job seekers and HR professionals.

---

## ✨ Key Features

### 🧠 1. AI-Based Resume Analysis
- Extracts essential elements such as skills, education, experience, achievements, and certifications.
- Evaluates resume structure, formatting, and keyword usage.
- Detects strengths and weaknesses automatically.

### 📄 2. Resume Parsing (PDF/Text Extraction)
- Accepts PDF resumes and extracts text using parsing tools.
- Supports various resume formats.
- Prepares clean, structured text for analysis.

### 📌 3. Job Description Matching
- Allows user to input or paste a Job Description (JD).
- Compares resume content with job requirements.
- Identifies relevant and missing skills.
- Generates a **match percentage score**.

### ⭐ 4. Resume Scoring System
Calculates a **final resume score (0–100)** using weighted metrics:

- Skill Match  
- Experience Relevance  
- Education Relevance  
- Formatting Quality  
- Keyword Density  

### 🛠️ 5. Improvement Suggestions
Provides detailed improvement recommendations including:

- Missing keywords  
- Formatting improvements  
- Skill gaps  
- Suggestions to improve summary, experience, and achievements  

### 🖥️ 6. User-Friendly Interface
- Clean and simple web UI.
- Easy resume upload.
- Instant results with structured sections:
  - Resume Score  
  - Extracted Details  
  - JD Match Results  
  - Suggestions  

---

## 🛠️ Technologies Used

| Component | Technology |
|----------|------------|
| Backend | Python, Flask / FastAPI |
| AI Engine | OpenAI GPT Model |
| Resume Parsing | PyPDF2, NLP libraries |
| Frontend | HTML, CSS, Bootstrap |
| Deployment | Localhost / Render / Vercel |

---

## 📂 Project Structure

```plaintext
AI-Resume-Analyzer/
│
├── app.py                    # Main backend server
├── static/                   # CSS and JS files
├── templates/                # HTML user interface
├── utils/
│   ├── pdf_parser.py         # PDF text extraction
│   ├── matcher.py            # JD-to-Resume comparison
│   └── scorer.py             # Resume scoring logic
├── requirements.txt          # Required dependencies
└── README.md                 # Project documentation
