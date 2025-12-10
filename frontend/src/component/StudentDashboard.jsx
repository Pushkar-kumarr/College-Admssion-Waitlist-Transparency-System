import { useState, useEffect } from 'react';
import { getContract } from '../utils/web3';
import '../Dashboard.css';

function StudentDashboard({ account, provider }) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [meritMarks, setMeritMarks] = useState('');
  const [preference1, setPreference1] = useState('');
  const [preference2, setPreference2] = useState('');

  const colleges = [
    { id: 101, name: 'SRM', minMeritMarks: 78 },
    { id: 202, name: 'VIT', minMeritMarks: 88 },
    { id: 303, name: 'SSN', minMeritMarks: 80 },
  ];

  const applyForAdmission = async () => {
    if (provider && account && studentId && studentName) {
      alert('Application submitted (demo)');
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="form-section">
        <h3>Apply for Admission</h3>
        <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        <input type="number" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <input type="number" placeholder="Merit Marks" value={meritMarks} onChange={(e) => setMeritMarks(e.target.value)} />
        <select value={preference1} onChange={(e) => setPreference1(e.target.value)}>
          <option value="">Select Preference 1</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={preference2} onChange={(e) => setPreference2(e.target.value)}>
          <option value="">Select Preference 2</option>
          {colleges
            .filter((c) => c.id.toString() !== preference1)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <button onClick={applyForAdmission}>Submit Application</button>
      </div>
    </div>
  );
}

export default StudentDashboard;
