import { useState } from 'react';
import { getContract } from '../utils/web3';
import '../Dashboard.css';

/**
 * General-purpose dashboard to test contract interactions on Polygon Amoy.
 * You can extend this later for more PBFT operations like addValidator, proposeAddCollege, etc.
 */
function Dashboard({ account, provider }) {
  const [collegeId, setCollegeId] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeLocation, setCollegeLocation] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  // Add a new college profile (only validators can call this)
  const addCollege = async () => {
    if (!provider || !account) {
      alert('Connect MetaMask first.');
      return;
    }
    if (!collegeId || !collegeName || !collegeLocation) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const contract = await getContract(provider);
      const tx = await contract.addCollegeProfile(
        parseInt(collegeId),
        collegeName,
        collegeLocation
      );
      await tx.wait();
      alert(`College ${collegeName} added successfully!`);
      setCollegeId('');
      setCollegeName('');
      setCollegeLocation('');
    } catch (error) {
      console.error(error);
      alert('Error adding college: ' + error.message);
    }
  };

  // Add a new student profile (only validators can call this)
  const addStudent = async () => {
    if (!provider || !account) {
      alert('Connect MetaMask first.');
      return;
    }
    if (!studentId || !studentName || !studentEmail) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const contract = await getContract(provider);
      const tx = await contract.addStudentProfile(
        parseInt(studentId),
        `did:polygon:${studentId}`, // example DID
        studentName,
        studentEmail
      );
      await tx.wait();
      alert(`Student ${studentName} added successfully!`);
      setStudentId('');
      setStudentName('');
      setStudentEmail('');
    } catch (error) {
      console.error(error);
      alert('Error adding student: ' + error.message);
    }
  };

  return (
    <div className="dashboard">
      <h2>PBFT Admission System — Dashboard</h2>

      {/* College Section */}
      <div className="form-section">
        <h3>Add College (Validator Only)</h3>
        <input
          type="number"
          placeholder="College ID"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        />
        <input
          type="text"
          placeholder="College Name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={collegeLocation}
          onChange={(e) => setCollegeLocation(e.target.value)}
        />
        <button onClick={addCollege}>Add College</button>
      </div>

      {/* Student Section */}
      <div className="form-section">
        <h3>Add Student (Validator Only)</h3>
        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Student Email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
      </div>
    </div>
  );
}

export default Dashboard;
