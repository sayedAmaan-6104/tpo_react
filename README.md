# TPO React Portal

A modern Training and Placement Office portal built with React, Vite, and Tailwind CSS. This application provides a comprehensive platform for students, recruiters, and administrators to manage the placement process with AI-powered features.

## Features

### Student Features
- **Resume Optimizer**: AI-powered resume analysis and feedback
- **Mock Interview**: Practice interviews with AI-generated questions
- **Job Listings**: Browse and apply to available positions
- **Skill Tracking**: Visualize and track your skills
- **Application Tracker**: Monitor your job applications

### Recruiter Features
- **Dashboard**: Overview of recruiting activities
- **Job Posting**: Create job postings with AI assistance
- **Candidate Management**: Review and manage applicants
- **Company Profile**: Manage company information

### Admin Features
- **Dashboard**: System-wide analytics and metrics
- **Job Approval**: Review and approve job postings
- **User Management**: Manage students and recruiters
- **Content Management**: Oversee platform content

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **PDF Processing**: PDF.js
- **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tpo_react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Configuration

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enter your API key in the application's sidebar when logged in

## Project Structure

```
src/
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
├── index.css        # Global styles with Tailwind
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### AI Integration
The application integrates with Google's Gemini AI to provide:
- Resume analysis and optimization suggestions
- Interview question generation
- Answer evaluation and feedback
- Job description generation
- Skill recommendations

### File Processing
- PDF resume upload and text extraction
- Support for both PDF and text files
- Client-side processing for privacy

### Voice Features
- Speech-to-text for interview practice (Chrome/Webkit browsers)
- Real-time transcription during mock interviews

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
