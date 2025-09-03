import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as pdfjsLib from 'pdfjs-dist';
import LoginForm from './components/LoginForm.jsx';
import './variables.css';  // Import the variables first

// --- Register Chart.js components ---
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- MOCK DATA ---
const MOCK_JOBS = [
    { id: '1', title: 'Frontend Developer', company: 'Tech Solutions Inc.', description: 'Developing and maintaining user-facing features using React.js.', matchPercentage: 92, status: 'approved' },
    { id: '2', title: 'Backend Engineer', company: 'Data Systems', description: 'Building server-side logic, database interactions and APIs.', matchPercentage: 85, status: 'approved' },
    { id: '3', title: 'UI/UX Designer', company: 'Creative Minds', description: 'Designing engaging and user-friendly interfaces for web and mobile.', matchPercentage: 78, status: 'approved' },
    { id: '4', title: 'Data Scientist', company: 'Analytics Corp.', description: 'Utilizing statistical methods and machine learning to analyze large datasets.', status: 'pending' },
    { id: '5', title: 'Product Manager', company: 'Innovate Co.', description: 'Defining product vision, strategy, and roadmap.', status: 'approved' }
];

const MOCK_STUDENTS = [
    { id: 's1', name: 'Alice Johnson', email: 'alice@edu.com' },
    { id: 's2', name: 'Bob Williams', email: 'bob@edu.com' },
];

const MOCK_RECRUITERS = [
     { id: 'r1', name: 'Charles Davis', email: 'charles@techsolutions.com' },
];

// --- CONTEXT for User and Navigation ---
const AppContext = createContext(null);

const AppProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [currentScreen, setScreen] = useState('welcome');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '');
    const [selectedLoginRole, setSelectedLoginRole] = useState('student'); // Default to student

    useEffect(() => {
        localStorage.setItem('gemini-api-key', apiKey);
    }, [apiKey]);

    const value = {
        userRole,
        setUserRole,
        currentScreen,
        setScreen,
        isLoading,
        setIsLoading,
        apiKey,
        setApiKey,
        selectedLoginRole,
        setSelectedLoginRole,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// --- GEMINI API SERVICE ---
const GeminiService = {
    callGeminiAPI: async (prompt, apiKey, grounded = false) => {
        if (!apiKey) return "Error: API key not provided";
        
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                ]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
        } catch (error) {
            return `Error: ${error.message}`;
        }
    },

    analyzeResume: (resumeText, apiKey) => {
        const prompt = `Analyze this resume and provide constructive feedback in HTML format. Focus on strengths, areas for improvement, and specific recommendations:\n\n${resumeText}`;
        return GeminiService.callGeminiAPI(prompt, apiKey);
    },

    generateInterviewQuestions: (resumeText, apiKey) => {
        const prompt = `Based on this resume, generate 5 relevant interview questions (one per line):\n\n${resumeText}`;
        return GeminiService.callGeminiAPI(prompt, apiKey);
    },

    evaluateAnswer: (question, answer, apiKey) => {
        const prompt = `Evaluate this interview answer and provide constructive feedback:\n\nQuestion: ${question}\nAnswer: ${answer}`;
        return GeminiService.callGeminiAPI(prompt, apiKey);
    },

    generateJobDescription: (jobTitle, skills, apiKey) => {
        const prompt = `Generate a comprehensive job description in HTML format for: ${jobTitle}\nRequired skills: ${skills}\nInclude responsibilities, requirements, and benefits.`;
        return GeminiService.callGeminiAPI(prompt, apiKey);
    },
    
    suggestSkills: (currentSkills, apiKey) => {
        const prompt = `Based on these current skills: ${currentSkills}\nSuggest 5-7 complementary skills to learn next. Return only skill names separated by commas.`;
        return GeminiService.callGeminiAPI(prompt, apiKey);
    },

    validateJobPosting: (jobDescription, apiKey) => {
        const prompt = `Review this job posting for quality, clarity, and compliance. Provide recommendations:\n\n${jobDescription}`;
        return GeminiService.callGeminiAPI(prompt, apiKey);
    }
};

// --- CUSTOM HOOKS ---
const useFileProcessor = () => {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');

    const processFile = async (file) => {
        setFileName(file.name);
        
        if (file.type === 'application/pdf') {
            try {
                // Set up PDF.js worker
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js`;
                
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + ' ';
                }
                
                setFileContent(fullText.trim());
            } catch (error) {
                alert('Error processing PDF: ' + error.message);
                setFileContent('');
            }
        } else if (file.type === 'text/plain') {
            const text = await file.text();
            setFileContent(text);
        } else {
            alert('Please upload a PDF or text file.');
            setFileContent('');
        }
    };

    return { fileContent, fileName, processFile };
};

// --- SHARED UI COMPONENTS ---
const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
    </div>
);

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-3xl">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

const Card = ({ children, className = '' }) => (
    <div className={`bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 ${className}`}>
        {children}
    </div>
);

const Button = ({ onClick, children, className = '', type = "button", disabled = false }) => (
    <button 
        type={type} 
        onClick={onClick} 
        disabled={disabled} 
        className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

const IconWrapper = ({ children, className }) => (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
        {children}
    </div>
);

// --- MAIN SCREENS & COMPONENTS ---
const WelcomeScreen = () => {
    const { setUserRole, setScreen, setSelectedLoginRole } = useAppContext();

    const handleSelectRole = (role) => {
        if (role === 'admin') {
            // Admin goes directly to dashboard (separate endpoint simulation)
            setUserRole(role);
            setScreen('admin_dashboard');
        } else {
            // Students and recruiters need to login
            setSelectedLoginRole(role); // Set the selected role for the login form
            setScreen('login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
             style={{ 
               background: 'var(--color-background)',
               fontFamily: 'var(--font-sans)'
             }}>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
                
                {/* Floating Elements */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
                <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '5s'}}></div>
            </div>

            <div className="text-center w-full max-w-6xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="mb-16">
                    <div className="inline-block p-2 rounded-full mb-6" 
                         style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    
                    <h1 className="font-bold mb-6 animate-fade-in-down"
                        style={{ 
                          fontSize: 'var(--font-size-display-lg)', 
                          color: 'var(--color-text-primary)',
                          lineHeight: 'var(--line-height-tight)'
                        }}>
                        Training & Placement
                        <br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                            Office Portal
                        </span>
                    </h1>
                    
                    <p className="mb-8 animate-fade-in-up max-w-2xl mx-auto"
                       style={{ 
                         fontSize: 'var(--font-size-xl)', 
                         color: 'var(--color-text-secondary)',
                         lineHeight: 'var(--line-height-relaxed)'
                       }}>
                        Empowering careers through intelligent placement solutions. 
                        Connect, grow, and succeed in your professional journey.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                             style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                AI-Powered Matching
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                             style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                Real-time Analytics
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                             style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                Seamless Experience
                            </span>
                        </div>
                    </div>
                </div>

                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Student Card */}
                    <div onClick={() => handleSelectRole('student')} 
                         className="group cursor-pointer transform transition-all duration-500 hover:scale-105">
                        <div className="p-8 rounded-2xl relative overflow-hidden"
                             style={{ 
                               background: 'var(--color-surface-glass)', 
                               border: '1px solid var(--color-border)',
                               borderRadius: 'var(--border-radius-xl)',
                               backdropFilter: 'blur(20px)',
                               transition: 'var(--transition-base)'
                             }}>
                            {/* Card Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Icon */}
                            <div className="relative z-10 mb-6">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h2 className="font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300"
                                    style={{ 
                                      fontSize: 'var(--font-size-display-sm)', 
                                      color: 'var(--color-text-primary)'
                                    }}>
                                    Student Portal
                                </h2>
                                <p className="mb-6"
                                   style={{ 
                                     color: 'var(--color-text-secondary)', 
                                     fontSize: 'var(--font-size-base)',
                                     lineHeight: 'var(--line-height-relaxed)'
                                   }}>
                                    Discover opportunities, optimize your resume with AI, practice interviews, 
                                    and track your application journey.
                                </p>

                                {/* Features List */}
                                <div className="space-y-3">
                                    {[
                                        'AI Resume Optimization',
                                        'Mock Interview Practice',
                                        'Job Matching Algorithm',
                                        'Application Tracking'
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                            <span style={{ 
                                              color: 'var(--color-text-muted)', 
                                              fontSize: 'var(--font-size-sm)' 
                                            }}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="mt-8 flex items-center justify-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                                    <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>
                                        Get Started
                                    </span>
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recruiter Card */}
                    <div onClick={() => handleSelectRole('recruiter')} 
                         className="group cursor-pointer transform transition-all duration-500 hover:scale-105">
                        <div className="p-8 rounded-2xl relative overflow-hidden"
                             style={{ 
                               background: 'var(--color-surface-glass)', 
                               border: '1px solid var(--color-border)',
                               borderRadius: 'var(--border-radius-xl)',
                               backdropFilter: 'blur(20px)',
                               transition: 'var(--transition-base)'
                             }}>
                            {/* Card Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Icon */}
                            <div className="relative z-10 mb-6">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                    </svg>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h2 className="font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300"
                                    style={{ 
                                      fontSize: 'var(--font-size-display-sm)', 
                                      color: 'var(--color-text-primary)'
                                    }}>
                                    Recruiter Hub
                                </h2>
                                <p className="mb-6"
                                   style={{ 
                                     color: 'var(--color-text-secondary)', 
                                     fontSize: 'var(--font-size-base)',
                                     lineHeight: 'var(--line-height-relaxed)'
                                   }}>
                                    Find top talent efficiently, post opportunities, manage candidates, 
                                    and streamline your hiring process.
                                </p>

                                {/* Features List */}
                                <div className="space-y-3">
                                    {[
                                        'AI-Powered Candidate Matching',
                                        'Streamlined Job Posting',
                                        'Advanced Candidate Filtering',
                                        'Interview Management'
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                            <span style={{ 
                                              color: 'var(--color-text-muted)', 
                                              fontSize: 'var(--font-size-sm)' 
                                            }}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="mt-8 flex items-center justify-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                                    <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>
                                        Start Hiring
                                    </span>
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                         style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            Trusted by 1000+ institutions worldwide
                        </span>
                    </div>
                    
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                        Need administrative access? Contact your system administrator.
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- STUDENT JOURNEY ---
const StudentOnboarding = () => {
    const { setScreen, setIsLoading, apiKey } = useAppContext();
    const [step, setStep] = useState(1);
    const [skills, setSkills] = useState('');
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    
    const handleSkillsSubmit = async () => {
        if (!skills.trim()) return;
        setIsLoading(true);
        const suggestions = await GeminiService.suggestSkills(skills, apiKey);
        if (!suggestions.startsWith("Error:")) {
            setSuggestedSkills(suggestions.split(',').map(s => s.trim()).filter(Boolean));
        } else {
            alert(suggestions);
        }
        setIsLoading(false);
        setStep(3);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Student Onboarding</h1>
            {step === 1 && (
                <Card>
                    <h2 className="text-2xl mb-4">Step 1: Personal Information</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg border" />
                        <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border" />
                        <Button onClick={() => setStep(2)}>Next</Button>
                    </form>
                </Card>
            )}
            {step === 2 && (
                <Card>
                    <h2 className="text-2xl mb-4">Step 2: Your Skills</h2>
                    <p className="mb-4 text-gray-600">Enter your current skills, separated by commas. Our AI will suggest more to learn!</p>
                    <textarea 
                        value={skills} 
                        onChange={(e) => setSkills(e.target.value)} 
                        placeholder="e.g., React, Node.js, Python, SQL" 
                        className="w-full p-3 rounded-lg border h-32"
                    ></textarea>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={() => setStep(1)} className="bg-gray-400 hover:bg-gray-500 from-gray-500 to-gray-600">Back</Button>
                        <Button onClick={handleSkillsSubmit}>Get AI Suggestions</Button>
                    </div>
                </Card>
            )}
            {step === 3 && (
                <Card>
                    <h2 className="text-2xl mb-4">Step 3: AI Skill Suggestions</h2>
                    <p className="mb-4 text-gray-600">Here are some skills you might want to learn next:</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {suggestedSkills.map((skill, i) => (
                           <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                     <div className="flex gap-4 mt-4">
                        <Button onClick={() => setStep(2)} className="bg-gray-400 hover:bg-gray-500 from-gray-500 to-gray-600">Back</Button>
                        <Button onClick={() => setScreen('student_dashboard')}>Finish Onboarding</Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

const StudentDashboard = () => {
    // A more complex implementation would use a physics library or D3.js
    const skills = ['React', 'TypeScript', 'Node.js', 'Figma', 'SQL', 'GraphQL', 'Docker'];
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Skill Galaxy</h2>
                    <p className="text-gray-600 mb-4">Your skills visualized. The bigger the star, the stronger the skill.</p>
                    <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center text-white relative overflow-hidden">
                        {/* Simplified skill galaxy visualization */}
                        {skills.map((skill, i) => (
                            <div key={skill} className="absolute animate-pulse" style={{
                                top: `${20 + Math.sin(i * 0.9) * 30 + 30}%`,
                                left: `${20 + Math.cos(i * 0.9) * 30 + 30}%`,
                                transform: `scale(${1 + Math.random() * 0.5})`,
                            }}>
                                <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff]"></div>
                                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm">{skill}</span>
                            </div>
                        ))}
                        <p className="z-10 text-lg font-semibold">Your Career Constellation</p>
                    </div>
                </Card>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Applications Sent</span>
                            <span className="text-2xl font-bold text-blue-600">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Interviews Scheduled</span>
                            <span className="text-2xl font-bold text-green-600">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Profile Views</span>
                            <span className="text-2xl font-bold text-purple-600">45</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ResumeOptimizer = () => {
    const { processFile, fileContent, fileName } = useFileProcessor();
    const { setIsLoading, apiKey } = useAppContext();
    const [analysis, setAnalysis] = useState('');
    const fileInputRef = useRef(null);
    
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };
    
    const handleAnalyze = async () => {
        if (!fileContent) return;
        setIsLoading(true);
        const result = await GeminiService.analyzeResume(fileContent, apiKey);
        setAnalysis(result);
        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">AI Resume Optimizer</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
                    <p className="text-gray-600 mb-4">Upload a .pdf or .txt file. Our AI will give you feedback.</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt" className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full justify-center flex items-center gap-2">
                        {/* SVG for upload icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose File
                    </Button>
                    {fileName && <p className="mt-4 text-center text-gray-700">Selected: {fileName}</p>}
                    <Button onClick={handleAnalyze} disabled={!fileContent} className="w-full mt-4">Analyze with AI</Button>
                </Card>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">AI Analysis & Feedback</h2>
                    {analysis ? (
                         analysis.startsWith("Error:") ? 
                         <p className="text-red-500">{analysis}</p> : 
                         <div className="prose" dangerouslySetInnerHTML={{ __html: analysis }} />
                    ) : (
                        <p className="text-gray-500">Analysis will appear here...</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

const MockInterview = () => {
    const { setIsLoading, apiKey } = useAppContext();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const { fileContent, processFile } = useFileProcessor();

    const handleGenerateQuestions = async (resumeText) => {
        setIsLoading(true);
        const q = await GeminiService.generateInterviewQuestions(resumeText, apiKey);
        if(!q.startsWith("Error:")) {
            setQuestions(q.split('\n').filter(Boolean));
        } else {
            setQuestions([q]);
        }
        setIsLoading(false);
    };

    const handleAnswerSubmit = async () => {
        setIsLoading(true);
        const fb = await GeminiService.evaluateAnswer(questions[currentQuestionIndex], answer, apiKey);
        setFeedback(fb);
        setIsLoading(false);
    };
    
    // Placeholder for Speech-to-Text
    useEffect(() => {
        let recognition;
        if ('webkitSpeechRecognition' in window && isRecording) {
            recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                         setAnswer(prev => prev + event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };
            recognition.start();
        }
        return () => recognition?.stop();
    }, [isRecording]);

    if (!fileContent) {
        return (
            <Card>
                <h2 className="text-2xl mb-4">Upload Resume to Start</h2>
                <input type="file" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
            </Card>
        );
    }
    
    if (questions.length === 0) {
        return <Button onClick={() => handleGenerateQuestions(fileContent)}>Generate Questions from Resume</Button>
    }

    return (
        <div className="space-y-6">
             <Card>
                <h2 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1}/{questions.length}</h2>
                <p className={`text-lg ${questions[0].startsWith("Error:") ? 'text-red-500' : 'text-gray-800'}`}>{questions[currentQuestionIndex]}</p>
            </Card>
            <Card>
                 <h2 className="text-xl font-semibold mb-2">Your Answer</h2>
                 <textarea 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    className="w-full p-3 h-40 border rounded-lg" 
                    placeholder="Type or record your answer..." 
                 />
                 <div className="flex items-center gap-4 mt-2">
                     <Button onClick={() => setIsRecording(p => !p)} className={isRecording ? 'bg-red-500 from-red-500 to-red-600' : ''}>
                         {isRecording ? 'Stop Recording' : 'Record Answer'}
                     </Button>
                     <Button onClick={handleAnswerSubmit}>Get Feedback</Button>
                 </div>
            </Card>
             {feedback && (
                <Card>
                    <h2 className="text-xl font-semibold mb-2">AI Feedback</h2>
                    <p className={feedback.startsWith("Error:") ? 'text-red-500' : ''}>{feedback}</p>
                </Card>
            )}
            <div className="flex justify-between">
                <Button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0}>Previous</Button>
                <Button onClick={() => { setAnswer(''); setFeedback(''); setCurrentQuestionIndex(p => Math.min(questions.length - 1, p + 1)); }} disabled={currentQuestionIndex === questions.length - 1}>Next</Button>
            </div>
        </div>
    );
};

const JobListings = () => {
    const approvedJobs = MOCK_JOBS.filter(job => job.status === 'approved');
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
            <div className="grid gap-6">
                {approvedJobs.map(job => (
                    <Card key={job.id}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{job.title}</h2>
                                <p className="text-gray-600">{job.company}</p>
                            </div>
                            {job.matchPercentage && (
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-green-600">{job.matchPercentage}%</span>
                                    <p className="text-sm text-gray-600">Match</p>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-700 mb-4">{job.description}</p>
                        <Button>Apply Now</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const RecruiterDashboard = () => (
     <div>
        <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
                <h2 className="text-xl font-semibold">Active Listings</h2>
                <p className="text-4xl font-bold text-blue-600">8</p>
            </Card>
            <Card className="text-center">
                <h2 className="text-xl font-semibold">New Applicants</h2>
                <p className="text-4xl font-bold text-green-600">24</p>
            </Card>
            <Card className="text-center">
                <h2 className="text-xl font-semibold">Messages</h2>
                <p className="text-4xl font-bold text-purple-600">5</p>
            </Card>
        </div>
    </div>
);

const CreateJobPosting = () => {
    const { setIsLoading, apiKey } = useAppContext();
    const [jobTitle, setJobTitle] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');

    const handleGenerate = async () => {
        if (!jobTitle.trim() || !skills.trim()) {
            alert('Please fill in job title and skills');
            return;
        }
        setIsLoading(true);
        const result = await GeminiService.generateJobDescription(jobTitle, skills, apiKey);
        setDescription(result);
        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Create Job Posting</h1>
            <Card className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Job Title" 
                    value={jobTitle} 
                    onChange={e => setJobTitle(e.target.value)} 
                    className="w-full p-3 rounded-lg border"
                />
                <input 
                    type="text" 
                    placeholder="Required Skills (comma-separated)" 
                    value={skills} 
                    onChange={e => setSkills(e.target.value)} 
                    className="w-full p-3 rounded-lg border"
                />
                <Button onClick={handleGenerate}>Generate Description with AI</Button>
                {description && (
                    description.startsWith("Error:") 
                        ? <p className="text-red-500 p-4 border rounded-lg bg-red-50">{description}</p>
                        : <div className="prose mt-4 p-4 border rounded-lg bg-gray-50 min-h-[200px]" dangerouslySetInnerHTML={{ __html: description }} />
                )}
                <Button className="w-full">Submit for Approval</Button>
            </Card>
        </div>
    );
};

const AdminDashboard = () => {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Job Applications',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="text-center">
                    <h2 className="text-xl font-semibold">Total Users</h2>
                    <p className="text-4xl font-bold text-blue-600">1,234</p>
                </Card>
                <Card className="text-center">
                    <h2 className="text-xl font-semibold">Active Jobs</h2>
                    <p className="text-4xl font-bold text-green-600">56</p>
                </Card>
                <Card className="text-center">
                    <h2 className="text-xl font-semibold">Pending Approvals</h2>
                    <p className="text-4xl font-bold text-yellow-600">8</p>
                </Card>
                <Card className="text-center">
                    <h2 className="text-xl font-semibold">Success Rate</h2>
                    <p className="text-4xl font-bold text-purple-600">78%</p>
                </Card>
            </div>
            <Card>
                <h2 className="text-2xl font-bold mb-4">Monthly Analytics</h2>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-gray-600">Chart.js integration would go here</p>
                </div>
            </Card>
        </div>
    );
};

const JobApproval = () => {
    const { setIsLoading, apiKey } = useAppContext();
    const [pendingJobs, setPendingJobs] = useState(MOCK_JOBS.filter(j => j.status === 'pending'));
    const [selectedJob, setSelectedJob] = useState(null);
    const [validationResult, setValidationResult] = useState('');

    const handleValidate = async (job) => {
        setSelectedJob(job);
        setIsLoading(true);
        const result = await GeminiService.validateJobPosting(job.description, apiKey);
        setValidationResult(result);
        setIsLoading(false);
    };

    const handleDecision = (jobId, decision) => {
        setPendingJobs(prev => prev.filter(job => job.id !== jobId));
        alert(`Job ${decision}!`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Job Posting Approval</h1>
            <div className="space-y-4">
                {pendingJobs.map(job => (
                    <Card key={job.id}>
                        <h2 className="text-xl font-bold">{job.title} - {job.company}</h2>
                        <p className="text-gray-600 mt-2">{job.description}</p>
                        <div className="flex gap-4 mt-4">
                            <Button onClick={() => handleValidate(job)}>Validate with AI</Button>
                            <Button onClick={() => handleDecision(job.id, 'approved')} className="bg-green-500 from-green-500 to-green-600">Approve</Button>
                            <Button onClick={() => handleDecision(job.id, 'rejected')} className="bg-red-500 from-red-500 to-red-600">Reject</Button>
                        </div>
                    </Card>
                ))}
            </div>
            {selectedJob && (
                <Modal title={`AI Validation for ${selectedJob.title}`} onClose={() => setSelectedJob(null)}>
                     {validationResult.startsWith("Error:")
                        ? <p className="text-red-500">{validationResult}</p>
                        : <p>{validationResult || "Loading validation..."}</p>
                     }
                </Modal>
            )}
        </div>
    );
};

const PlaceholderScreen = ({ title }) => (
    <Card>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-4 text-gray-600">This feature is under construction.</p>
    </Card>
);

const UserManagement = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Students</h2>
                <ul>
                    {MOCK_STUDENTS.map(s => (
                        <li key={s.id} className="py-2 border-b">{s.name} - {s.email}</li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h2 className="text-2xl font-bold mb-4">Recruiters</h2>
                <ul>
                    {MOCK_RECRUITERS.map(r => (
                        <li key={r.id} className="py-2 border-b">{r.name} - {r.email}</li>
                    ))}
                </ul>
            </Card>
        </div>
    </div>
);

const AppLayout = ({ children }) => {
    const { userRole, setScreen, setUserRole, apiKey, setApiKey, currentScreen } = useAppContext();
    
    // Don't show sidebar for welcome and login screens
    if (userRole === null || currentScreen === 'welcome' || currentScreen === 'login') {
        return <>{children}</>;
    }
    
    const SIDENAV_LINKS = {
        student: [
            { screen: 'student_dashboard', label: 'Dashboard' },
            { screen: 'resume_optimizer', label: 'Resume Optimizer' },
            { screen: 'mock_interview', label: 'Mock Interview' },
            { screen: 'job_listings', label: 'Job Listings' },
            { screen: 'application_tracker', label: 'My Applications' },
        ],
        recruiter: [
            { screen: 'recruiter_dashboard', label: 'Dashboard' },
            { screen: 'create_job', label: 'Post a Job' },
            { screen: 'manage_jobs', label: 'Manage Jobs' },
            { screen: 'candidate_review', label: 'Review Candidates' },
        ],
        admin: [
            { screen: 'admin_dashboard', label: 'Dashboard' },
            { screen: 'job_approval', label: 'Job Approvals' },
            { screen: 'user_management', label: 'User Management' },
            { screen: 'content_management', label: 'Manage Content' },
        ],
    };

    const handleLogout = () => {
        setUserRole(null);
        setScreen('welcome');
    };

    const links = SIDENAV_LINKS[userRole] || [];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-8">TPO Portal</h1>
                <nav className="flex-grow">
                    <ul>
                        {links.map(link => (
                            <li key={link.screen}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setScreen(link.screen); }} className="block py-3 px-4 rounded hover:bg-gray-700 transition-colors">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto pt-4 border-t border-gray-700">
                     <label htmlFor="api-key" className="text-xs text-gray-400 mb-1 block">Gemini API Key</label>
                     <input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                     />
                </div>
                <Button onClick={handleLogout} className="bg-red-500 from-red-500 to-red-600 mt-4">Logout</Button>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

const ScreenRouter = () => {
    const { currentScreen, setUserRole, setScreen, selectedLoginRole } = useAppContext();

    const handleLogin = (userType, userData) => {
        // Mock authentication success
        setUserRole(userType);
        
        // Navigate to appropriate screen based on user type
        if (userType === 'student') {
            setScreen('student_onboarding');
        } else if (userType === 'recruiter') {
            setScreen('recruiter_dashboard');
        }
        
        // In a real app, you would validate credentials and handle authentication
        console.log(`${userType} logged in:`, userData);
    };

    const handleBackToWelcome = () => {
        setScreen('welcome');
        setUserRole(null);
    };

    switch (currentScreen) {
        case 'welcome':
            return <WelcomeScreen />;
        case 'login':
            return <LoginForm 
                onLogin={handleLogin} 
                onBackToWelcome={handleBackToWelcome} 
                defaultRole={selectedLoginRole}
            />;
        case 'student_onboarding':
            return <StudentOnboarding />;
        case 'student_dashboard':
            return <StudentDashboard />;
        case 'resume_optimizer':
            return <ResumeOptimizer />;
        case 'mock_interview':
            return <MockInterview />;
        case 'job_listings':
            return <JobListings />;
        case 'application_tracker':
            return <PlaceholderScreen title="Application Tracker" />;
        case 'student_profile':
            return <PlaceholderScreen title="Student Profile" />;
        case 'recruiter_dashboard':
            return <RecruiterDashboard />;
        case 'create_job':
            return <CreateJobPosting />;
        case 'manage_jobs':
            return <PlaceholderScreen title="Manage Jobs" />;
        case 'candidate_review':
            return <PlaceholderScreen title="Candidate Review" />;
        case 'messaging':
            return <PlaceholderScreen title="Messaging" />;
        case 'company_profile':
            return <PlaceholderScreen title="Company Profile" />;
        case 'admin_dashboard':
            return <AdminDashboard />;
        case 'job_approval':
            return <JobApproval />;
        case 'user_management':
            return <UserManagement />;
        case 'content_management':
            return <PlaceholderScreen title="Content Management" />;
        default:
            return <WelcomeScreen />;
    }
};

const AppWrapper = () => {
    const { isLoading } = useAppContext();
    return (
        <>
            {isLoading && <LoadingSpinner />}
            <AppLayout>
                <ScreenRouter />
            </AppLayout>
        </>
    );
};

export default function App() {
    return (
        <>
            <style>{`
                @keyframes fade-in-down { 
                    0% { opacity: 0; transform: translateY(-20px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                @keyframes fade-in-up { 
                    0% { opacity: 0; transform: translateY(20px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-fade-in-down { 
                    animation: fade-in-down 0.8s ease-out forwards; 
                }
                .animate-fade-in-up { 
                    animation: fade-in-up 0.8s ease-out 0.3s forwards; 
                    opacity: 0;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .prose { 
                    max-width: none; 
                }
                
                /* Custom scrollbar for better aesthetics */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: var(--color-surface);
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--color-border);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--color-border-hover);
                }
            `}</style>
            <AppProvider>
                <div className="font-sans" style={{ fontFamily: 'var(--font-sans)' }}>
                    <AppWrapper />
                </div>
            </AppProvider>
        </>
    );
}
