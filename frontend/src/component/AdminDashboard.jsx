import { useState } from 'react';
import { getContract } from '../utils/web3';
import '../Dashboard.css';

function AdminDashboard({ account, provider, onNavigateToAppliedStudents }) {
  const [collegeId, setCollegeId] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');

  const addCollege = async () => {
    if (provider && account && collegeId && collegeName && location) {
      try {
        const contract = await getContract(provider);
        const tx = await contract.addCollegeProfile(parseInt(collegeId), collegeName, location);
        await tx.wait();
        alert('College added successfully!');
      } catch (error) {
        console.error('Error adding college:', error);
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="form-section">
        <h3>Add College</h3>
        <input type="number" placeholder="College ID" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} />
        <input type="text" placeholder="College Name" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <button onClick={addCollege}>Add College</button>
      </div>

      <button type="button" className="nav-button" onClick={onNavigateToAppliedStudents}>
        View Applied Students
      </button>
    </div>
  );
}

export default AdminDashboard;
