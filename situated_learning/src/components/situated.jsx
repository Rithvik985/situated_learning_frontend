import React, { useState, useEffect,useCallback } from 'react';
import { ChevronRight, FileText, Upload, CheckCircle, User, BookOpen, Settings, Search, Edit3, Save, X, Eye, Download, Send } from 'lucide-react';
import { api } from './api'; // Import the API service
import "../styles/situated.css";

const SituatedLearningApp = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [generatedAssignment, setGeneratedAssignment] = useState('');
  const [generatedRubric, setGeneratedRubric] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(false);
  const [editingRubric, setEditingRubric] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(false);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);
  const [rubricData, setRubricData] = useState(null);

  const [evaluation, setEvaluation] = useState('');

  const [assignmentData, setAssignmentData] = useState({
    courseName: "",
    courseCode: "",
    instructorName: "",
    domain: "",
    topic: "",
    customInstructions: ""
  }); 

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCourses();
      setCourses(data.courses || []);
    } catch (err) {
      setError(`Failed to fetch courses: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignments = async (courseTitle) => {
    try {
      setIsLoading(true);
      const data = await api.getAssignments(courseTitle);
      setAssignments(data || []);
    } catch (err) {
      setError(`Failed to fetch assignments: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAssignment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const payload = {
        course_title: assignmentData.courseName,
        topic: assignmentData.topic,
        user_domain: assignmentData.domain,
        extra_instructions: assignmentData.customInstructions
      };
      
      const data = await api.generateAssignment(payload);
      setGeneratedAssignment(data.generated_assignment || '');
      setAssignmentId(data.assignment_id || null);
      
    } catch (err) {
      setError(`Failed to generate assignment: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRubric = async () => {
    try {
      if (!assignmentId) {
        setError('No assignment ID available. Please generate an assignment first.');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const data = await api.generateRubric(assignmentId);
      setGeneratedRubric(data.rubric || '');
      setRubricData(data.rubric ? JSON.parse(data.rubric) : null);
      
    } catch (err) {
      setError(`Failed to generate rubric: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAssignment = async () => {
    // In a real implementation, you would save the edited assignment to the backend
    setEditingAssignment(false);
    console.log('Assignment saved:', generatedAssignment);
  };

  const handleSaveRubric = async () => {
    // In a real implementation, you would save the edited rubric to the backend
    setEditingRubric(false);
    console.log('Rubric saved:', generatedRubric);
  };

  
  // Add error display component
  const ErrorDisplay = () => (
    error && (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    )
  );

  // Add loading indicator component
  const LoadingIndicator = () => (
    isLoading && (
      <div className="loading-indicator">
        <div className="spinner"></div>
        <p>Processing...</p>
      </div>
    )
  );

  // Add this component right after your other helper components (ErrorDisplay, LoadingIndicator)
const DebugStateDisplay = () => (
  <div style={{ 
    position: 'fixed', 
    top: '10px', 
    right: '10px', 
    background: '#f0f0f0', 
    padding: '10px', 
    borderRadius: '5px',
    fontSize: '12px',
    maxWidth: '300px',
    zIndex: 1000,
    border: '1px solid #ccc'
  }}>
    <h4>Debug Info:</h4>
    <div><strong>Evaluation length:</strong> {evaluation ? evaluation.length : 0}</div>
    <div><strong>Evaluation truthy:</strong> {evaluation ? 'true' : 'false'}</div>
    <div><strong>RubricData present:</strong> {rubricData ? 'true' : 'false'}</div>
    <div><strong>Assignment present:</strong> {generatedAssignment ? 'true' : 'false'}</div>
    <div><strong>Submission present:</strong> {submissionText ? 'true' : 'false'}</div>
    <div><strong>Loading:</strong> {isLoading ? 'true' : 'false'}</div>
    <div><strong>Error:</strong> {error ? 'present' : 'none'}</div>
    {evaluation && (
      <div><strong>First 50 chars:</strong> {evaluation.substring(0, 50)}...</div>
    )}
  </div>
);

  // Update the Dashboard component to use real data
  const Dashboard = () => (
    <div className="dashboard-container">
      <ErrorDisplay />
      <LoadingIndicator />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Situated Learning Assignment System</h1>
          <div className="header-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <input type="text" placeholder="Search assignments..." />
            </div>
            <div className="user-profile">
              <User className="profile-icon" />
              <span>Dr. Smith</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <div 
            onClick={() => setCurrentScreen('create')}
            className="dashboard-card create-card"
          >
            <div className="card-content">
              <div className="card-info">
                <h2>Create Assignment</h2>
                <p>Generate new situated learning assignments using AI</p>
                <div className="card-stats">
                  <span className="stat">{assignments.length} Created</span>
                  <span className="stat">{assignments.length} Active</span>
                </div>
              </div>
              <div className="card-icon create-icon">
                <FileText />
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setCurrentScreen('evaluate')}
            className="dashboard-card evaluate-card"
          >
            <div className="card-content">
              <div className="card-info">
                <h2>Evaluate Submissions</h2>
                <p>Upload and grade student submissions with AI assistance</p>
                <div className="card-stats">
                  <span className="stat">0 Submissions</span>
                  <span className="stat">0 Pending</span>
                </div>
              </div>
              <div className="card-icon evaluate-icon">
                <Upload />
              </div>
            </div>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {assignments.slice(0, 3).map((assignment, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon success">
                  <CheckCircle />
                </div>
                <div className="activity-content">
                  <span className="activity-title">{assignment.title || 'Assignment'} - Created</span>
                  <span className="activity-time">Recently</span>
                </div>
                <div className="activity-status success">Completed</div>
              </div>
            ))}
            {assignments.length === 0 && (
              <div className="activity-item">
                <div className="activity-content">
                  <span className="activity-title">No recent activity</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // In your React component, replace the CreateAssignment component with this fixed version
const CreateAssignment = () => {
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    if (courses.length > 0) {
      setCourseOptions(courses);

    }
  }, [courses]);

  // Add a function to handle course selection
  const handleCourseSelect = (courseTitle) => {
    setAssignmentData(prev => ({
      ...prev,
      courseName: courseTitle
    }));
    
    // Also extract course code if possible
    const courseCodeMatch = courseTitle.match(/\(([^)]+)\)/);
    if (courseCodeMatch && courseCodeMatch[1]) {
      setAssignmentData(prev => ({
        ...prev,
        courseCode: courseCodeMatch[1]
      }));
    }
    
    // Fetch assignments for this course
    fetchAssignments(courseTitle);
  };

  return (
    <div className="page-container">
      <ErrorDisplay />
      <LoadingIndicator />
      
      <div className="page-content">
        <div className="page-header">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="back-button"
          >
            ← Back to Dashboard
          </button>
          <h1>Create Situated Learning Assignment</h1>
        </div>
        
        <div className="form-card">
          <div className="form-section">
            <h3>Course Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Course Name</label>
                <select 
                  value={assignmentData.courseName}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                >
                  <option value="">Select a course</option>
                  {courseOptions.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {isLoading && <div className="loading-text">Loading assignments...</div>}
              </div>
              
              <div className="form-group">
                <label>Course Code</label>
                <input 
                  type="text"
                  value={assignmentData.courseCode}
                  onChange={(e) => setAssignmentData({...assignmentData, courseCode: e.target.value})}
                  placeholder="e.g., CS F415"
                />
              </div>
              
              <div className="form-group">
                <label>Instructor Name</label>
                <input 
                  type="text"
                  value={assignmentData.instructorName}
                  onChange={(e) => setAssignmentData({...assignmentData, instructorName: e.target.value})}
                  placeholder="e.g., Dr. Smith"
                />
              </div>
              
              <div className="form-group">
                <label>Domain</label>
                <select 
                  value={assignmentData.domain}
                  onChange={(e) => setAssignmentData({...assignmentData, domain: e.target.value})}
                >
                  <option value="">Select Domain</option>
                  <option value="Technology Industry">Technology Industry</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Assignment Details</h3>
            <div className="form-group">
              <label>Topic</label>
              <input 
                type="text"
                value={assignmentData.topic}
                onChange={(e) => setAssignmentData(prev=>({...prev,topic: e.target.value}))}
                placeholder="e.g., Artificial Intelligence, Machine Learning, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Custom Instructions</label>
              <textarea 
                value={assignmentData.customInstructions}
                onChange={(e) => setAssignmentData({...assignmentData, customInstructions: e.target.value})}
                rows={4}
                placeholder="Any specific requirements, constraints, or additional context for the assignment..."
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              onClick={handleGenerateAssignment}
              className="btn-primary"
              disabled={isLoading || !assignmentData.courseName || !assignmentData.topic}
            >
              <Settings />
              {isLoading ? 'Generating...' : 'Generate Assignment'}
            </button>
          </div>
          
          {generatedAssignment && (
            <div className="result-section">
              <div className="result-header">
                <h3>Generated Assignment</h3>
                <div className="result-actions">
                  <button 
                    onClick={() => setEditingAssignment(!editingAssignment)}
                    className={editingAssignment ? "btn-secondary active" : "btn-secondary"}
                  >
                    <Edit3 />
                    {editingAssignment ? 'Cancel Edit' : 'Edit'}
                  </button>
                  {editingAssignment && (
                    <button onClick={handleSaveAssignment} className="btn-success">
                      <Save />
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
              
              <div className="result-content">
                {editingAssignment ? (
                  <textarea
                    value={generatedAssignment}
                    onChange={(e) => setGeneratedAssignment(e.target.value)}
                    className="edit-textarea"
                    rows={20}
                  />
                ) : (
                  <pre className="result-display">{generatedAssignment}</pre>
                )}
              </div>
              
              <div className="result-footer">
                <button 
                  onClick={handleGenerateRubric}
                  className="btn-success"
                  disabled={isLoading || !assignmentId}
                >
                  <CheckCircle />
                  {isLoading ? 'Generating...' : 'Generate Rubrics'}
                </button>
                
                <button className="btn-outline">
                  <Download />
                  Export Assignment
                </button>
                
                <button className="btn-primary">
                  <Save />
                  Approve & Save
                </button>
              </div>
            </div>
          )}
          
          {generatedRubric && (
            <div className="result-section">
              <div className="result-header">
                <h3>Generated Evaluation Rubrics</h3>
                <div className="result-actions">
                  <button 
                    onClick={() => setEditingRubric(!editingRubric)}
                    className={editingRubric ? "btn-secondary active" : "btn-secondary"}
                  >
                    <Edit3 />
                    {editingRubric ? 'Cancel Edit' : 'Edit'}
                  </button>
                  {editingRubric && (
                    <button onClick={handleSaveRubric} className="btn-success">
                      <Save />
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
              
              <div className="result-content rubric">
                {editingRubric ? (
                  <textarea
                    value={generatedRubric}
                    onChange={(e) => setGeneratedRubric(e.target.value)}
                    className="edit-textarea"
                    rows={15}
                  />
                ) : (
                  <pre className="result-display">{generatedRubric}</pre>
                )}
              </div>
              
              <div className="result-footer">
                <button className="btn-success">
                  <Save />
                  Save Rubrics
                </button>
                <button className="btn-outline">
                  <Download />
                  Export Rubrics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const EvaluateSubmissions = () => {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  
  // Enhanced debug logging with stack trace
  const debugSetEvaluation = (newValue) => {
    console.log("=== EVALUATION STATE CHANGE ===");
    console.log("Setting evaluation from:", evaluation?.substring(0, 50) + "..." || "empty");
    console.log("Setting evaluation to:", typeof newValue === 'string' ? newValue.substring(0, 50) + "..." : newValue);
    console.log("Stack trace:", new Error().stack);
    setEvaluation(newValue);
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSubmissionText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleEvaluate = async () => {
    console.log("=== EVALUATE FUNCTION STARTED ===");
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!rubricData || !generatedAssignment || !submissionText) {
        const missingItems = [];
        if (!rubricData) missingItems.push("rubricData");
        if (!generatedAssignment) missingItems.push("generatedAssignment");
        if (!submissionText) missingItems.push("submissionText");
        
        const errorMsg = `Missing required data: ${missingItems.join(", ")}`;
        setError(errorMsg);
        return;
      }
      
      const payload = {
        rubric: rubricData,
        assignment_description: generatedAssignment,
        submission: submissionText
      };
    console.log("Sending payload to API:", payload);

      
      const data = await api.evaluateSubmission(payload);
       console.log("=== API RESPONSE ===");
        console.log("Raw data:", data);
      
      if (data) {
        let evaluationText;
        if (typeof data === 'string') {
          evaluationText = data;
        } else if (typeof data === 'object') {
          evaluationText = JSON.stringify(data, null, 2);
        } else {
          evaluationText = String(data);
        }
        
          console.log("Setting parent evaluation state...");
          setEvaluation(evaluationText); // This now sets the parent state
          console.log("Evaluation set successfully!");
    

      } else {
        setError('No evaluation data received from server');
      }

      } catch (err) {
        console.error("Evaluation error:", err);
        setError(`Failed to evaluate submission: ${err.message}`);
      } finally { 
        setIsLoading(false);
        console.log("=== EVALUATE FUNCTION COMPLETED ===");
      }
    };

  const handleSaveEvaluation = () => {
    setEditingEvaluation(false);
    console.log('Evaluation saved:', evaluation);
  };


    return (
    
    <div className="page-container">
      <ErrorDisplay />
      <LoadingIndicator />
      
      {/* Enhanced debug section
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}>
          <h4>Debug Parent Evaluation State:</h4>
          <p><strong>Has evaluation:</strong> {evaluation ? 'TRUE' : 'FALSE'}</p>
          <p><strong>Type:</strong> {typeof evaluation}</p>
          <p><strong>Length:</strong> {evaluation ? evaluation.length : 0}</p>
          {evaluation && <p><strong>Content preview:</strong> {evaluation.substring(0, 100)}...</p>}
          
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setEvaluation('PARENT TEST EVALUATION')} style={{ marginRight: '10px' }}>
              Test Parent Evaluation
            </button>
            <button onClick={() => setEvaluation('')} style={{ marginRight: '10px' }}>
              Clear Parent Evaluation
            </button>
          </div>
        </div>
         */}
        <div className="page-content">
          <div className="page-header">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="back-button"
            >
              ← Back to Dashboard
            </button>
            <h1>Evaluate Student Submissions</h1>
          </div>
          
          <div className="form-card">
            <div className="form-section">
              <h3>Select Assignment</h3>
              <div className="assignment-selector">
                <select 
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="assignment-select"
                >
                  <option value="">Choose an assignment...</option>
                  {assignments.map((assignment, index) => (
                    <option key={index} value={assignment.id || index}>
                      {assignment.title || `Assignment ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedAssignment && (
                <div className="assignment-details">
                  <div className="assignment-info">
                    <h4>{assignments.find(a => a.id === selectedAssignment)?.title || 'Selected Assignment'}</h4>
                    <p>{assignmentData.courseName} - {assignmentData.topic}</p>
                    <div className="assignment-meta">
                      <span className="meta-item">Course: {assignmentData.courseCode}</span>
                      <span className="meta-item">Instructor: {assignmentData.instructorName}</span>
                      <span className="meta-item status-ready">Rubrics Ready</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>Upload Student Submission</h3>
              <div className="upload-area">
                <div className="upload-content">
                  <Upload className="upload-icon" />
                  <p className="upload-text">Drag and drop files here, or browse</p>
                  <div className="upload-actions">
                    <label className="btn-primary upload-btn">
                      <span>Browse Files</span>
                      <input 
                        type="file" 
                        className="hidden-input" 
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </label>
                    <button
                      onClick={() => {
                        const mockFile = new File(
                          ["This is a mock submission for testing purposes."],
                          "mock_submission.txt",
                          { type: "text/plain" }
                        );
                        setUploadedFile(mockFile);
                        setSubmissionText("This is a mock submission for testing purposes.");
                      }}
                      className="btn-secondary"
                    >
                      Use Mock File
                    </button>
                  </div>
                  <p className="upload-hint">Supported: PDF, DOC, DOCX, TXT (Max 10MB)</p>
                </div>
                
                {uploadedFile && (
                  <div className="upload-success">
                    <div className="success-content">
                      <CheckCircle className="success-icon" />
                      <div className="file-info">
                        <strong>{uploadedFile.name}</strong>
                        <span>{(uploadedFile.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {uploadedFile && selectedAssignment && (
              <div className="form-actions">
                <button 
                  onClick={handleEvaluate}
                  className="btn-primary evaluate-btn"
                  disabled={isLoading}
                >
                  <Settings />
                  {isLoading ? 'Evaluating...' : 'Evaluate Submission'}
                </button>
              </div>
            )}
            
            {evaluation && (
              <div className="result-section">
                <div className="result-header">
                  <h3>AI Evaluation Results</h3>
                  <div className="result-actions">
                    <button 
                      onClick={() => setEditingEvaluation(!editingEvaluation)}
                      className={editingEvaluation ? "btn-secondary active" : "btn-secondary"}
                    >
                      <Edit3 />
                      {editingEvaluation ? 'Cancel Edit' : 'Edit Results'}
                    </button>
                    {editingEvaluation && (
                      <button onClick={handleSaveEvaluation} className="btn-success">
                        <Save />
                        Save Changes
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="result-content evaluation">
                  {editingEvaluation ? (
                    <textarea
                      value={evaluation}
                      onChange={(e) => setEvaluation(e.target.value)}
                      className="edit-textarea"
                      rows={20}
                    />
                  ) : (
                    <pre className="result-display">{evaluation}</pre>
                  )}
                </div>
                
                <div className="result-footer">
                  <button className="btn-primary">
                    <Save />
                    Save Evaluation
                  </button>
                  <button className="btn-success">
                    <Send />
                    Send to Student
                  </button>
                  <button className="btn-outline">
                    <Download />
                    Export Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {currentScreen === 'dashboard' && <Dashboard />}
      {currentScreen === 'create' && <CreateAssignment />}
      {currentScreen === 'evaluate' && <EvaluateSubmissions />}
    </div>
  );
};

export default SituatedLearningApp;