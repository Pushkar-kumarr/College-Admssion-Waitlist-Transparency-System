import { useState, useEffect } from 'react';
import '../Dashboard.css';

function AppliedStudentsDashboard({ onBack }) {
  const [appliedStudents, setAppliedStudents] = useState([]);

  useEffect(() => {
    setAppliedStudents([
      { id: 522, name: 'Kriti', meritMarks: 94, preference1: 202, preference2: 303, status: 0 },
      { id: 312, name: 'Shakthi', meritMarks: 89, preference1: 202, preference2: 101, status: 0 },
      { id: 412, name: 'Pushkar', meritMarks: 82, preference1: 303, preference2: 101, status: 0 },
    ]);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 2:
        return 'Accepted';
      case 3:
        return 'Rejected';
      case 4:
        return 'Hold';
      default:
        return '';
    }
  };

  const decideApplication = (studentId, decision) => {
    setAppliedStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: decision } : s))
    );
    alert('Decision updated locally (demo mode)');
  };

  return (
    <div className="dashboard">
      <h2>Applied Students</h2>
      <button onClick={onBack}>Back to Admin Dashboard</button>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>ID</th>
            <th>Merit Marks</th>
            <th>Preference 1</th>
            <th>Preference 2</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appliedStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.id}</td>
              <td>{student.meritMarks}</td>
              <td>{student.preference1}</td>
              <td>{student.preference2}</td>
              <td>{getStatusText(student.status)}</td>
              <td>
                <button onClick={() => decideApplication(student.id, 2)}>Accept</button>
                <button onClick={() => decideApplication(student.id, 3)}>Reject</button>
                <button onClick={() => decideApplication(student.id, 4)}>Hold</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppliedStudentsDashboard;
