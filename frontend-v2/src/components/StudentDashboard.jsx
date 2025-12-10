import { useState, useEffect } from "react";
import { getContract } from "../utils/web3";
import { uploadFileToIPFS } from "../utils/ipfs";
import "../App.css";

function StudentDashboard({ account, provider, addActivity }) {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [score, setScore] = useState("");
  const [marksheetFile, setMarksheetFile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [preferences, setPreferences] = useState(["", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const [applicationDetails, setApplicationDetails] = useState(null);

  const ADMIN_ADDRESS = "0xC1F9ed242a8D0fdaEfAa091F24d684A3E937679d";

  useEffect(() => {
    if (!account) return;
    if (account.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
      alert("⚠️ Admin wallet cannot access Student Dashboard.");
      window.location.href = "/";
    }
  }, [account]);

  useEffect(() => {
    if (provider) fetchColleges();
  }, [provider]);

  // 🔹 Fetch all colleges
  const fetchColleges = async () => {
    try {
      const contract = await getContract(provider);
      const [ids, names, marks] = await contract.getAllColleges();

      const formatted = ids.map((id, index) => ({
        id: id.toString(),
        name: names[index],
        minMarks: marks[index].toString(),
      }));

      setColleges(formatted);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  // 🔹 File change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setMarksheetFile(file);
  };

  // 🔹 Preference change
  const handlePreferenceChange = (index, value) => {
    const updated = [...preferences];
    updated[index] = value;
    setPreferences(updated);
  };

  // 🔹 Validate preferences
  const validatePreferences = () => {
    const unique = new Set(preferences.filter((p) => p !== ""));
    if (unique.size < preferences.filter((p) => p !== "").length) {
      setErrorMessage("⚠️ Duplicate college preferences are not allowed.");
      return false;
    }

    for (let pref of preferences) {
      if (pref) {
        const college = colleges.find((c) => c.id.toString() === pref.toString());
        if (college && parseInt(score) < parseInt(college.minMarks)) {
          setErrorMessage(
            `⚠️ Your score (${score}) is below the cutoff for ${college.name} (${college.minMarks}).`
          );
          return false;
        }
      }
    }

    setErrorMessage("");
    return true;
  };

  // 🚀 Apply for Admission
  const applyForAdmission = async () => {
    if (!studentName || !studentId || !score || !marksheetFile) {
      return alert("Please fill all fields and upload your marksheet.");
    }

    const filledPrefs = preferences.filter((p) => p !== "");
    if (filledPrefs.length === 0) {
      return alert("Select at least one preference.");
    }

    if (!validatePreferences()) return;

    try {
      const ipfsUri = await uploadFileToIPFS(marksheetFile);
      console.log("📁 File uploaded to IPFS:", ipfsUri);

      const contract = await getContract(provider);
      const tx = await contract.applyForAdmission(
        parseInt(studentId),
        studentName,
        parseInt(score),
        ipfsUri,
        filledPrefs.map((p) => parseInt(p))
      );

      addActivity("Admission Application (Pending)", {
        hash: tx.hash,
        blockNumber: "-",
        timestamp: Date.now() / 1000,
        creator: "-",
        parentHash: "-",
      });

      const receipt = await tx.wait();
      const block = await provider.getBlock(receipt.blockNumber);

      addActivity("Admission Application (Confirmed)", {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        timestamp: block.timestamp,
        creator: block.miner,
        parentHash: block.parentHash,
      });

      alert("✅ Application submitted successfully!");
      setStudentName("");
      setStudentId("");
      setScore("");
      setMarksheetFile(null);
      setPreferences(["", "", ""]);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("❌ Transaction failed. Check console for details.");
    }
  };

  // 🔍 Check Application Status & Allotted College
  const checkApplicationStatus = async () => {
    if (!searchId) return alert("Please enter your Student ID.");
    try {
      const contract = await getContract(provider);
      const list = await contract.getAllApplicants();
      const student = list.find((a) => a.id.toString() === searchId);

      if (!student) {
        alert("❌ No application found for this ID.");
        setApplicationDetails(null);
        return;
      }

      let allottedCollege = "No College Allotted";
      let statusMessage = "";

      // ✅ If Accepted — calculate college
      if (student.status === "Accepted") {
        const prefs = student.preferences.map((p) => p.toString());
        const eligibleColleges = colleges.filter(
          (c) =>
            prefs.includes(c.id.toString()) &&
            parseInt(student.score) >= parseInt(c.minMarks)
        );

        if (eligibleColleges.length > 0) {
          const bestFit = eligibleColleges.reduce((prev, curr) =>
            parseInt(curr.minMarks) > parseInt(prev.minMarks) ? curr : prev
          );
          allottedCollege = bestFit.name;
        }
      } else if (student.status === "Hold") {
        statusMessage = " Your application is on hold. You have been waitlisted.";
      } else if (student.status === "Rejected") {
        statusMessage = " Your application has been rejected.";
      }

      setApplicationDetails({
        id: student.id.toString(),
        name: student.name,
        score: student.score.toString(),
        status: student.status,
        allotted: allottedCollege,
        message: statusMessage,
      });
    } catch (error) {
      console.error("Error fetching student status:", error);
      alert("❌ Error fetching status.");
    }
  };

  return (
    <div className="dashboard">
      <h2>🎓 Student Dashboard</h2>
      <p>
        Wallet Connected:{" "}
        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
      </p>

      {/* Apply for Admission */}
      <div className="form-section">
        <h3>Apply for Admission</h3>

        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Scored Marks"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />

        <h4>🎯 Choose up to 3 College Preferences</h4>
        <div className="preference-section">
          {[0, 1, 2].map((i) => (
            <div key={i} className="preference-dropdown">
              <label>Preference {i + 1}:</label>
              <select
                value={preferences[i]}
                onChange={(e) => handlePreferenceChange(i, e.target.value)}
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.id} — {college.name} (Cutoff: {college.minMarks})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button onClick={applyForAdmission}>Submit Application</button>
      </div>

      {/* Colleges List */}
      <div className="table-section">
        <h3>🏫 Available Colleges</h3>
        <table>
          <thead>
            <tr>
              <th>College Name</th>
              <th>College ID</th>
              <th>Minimum Marks</th>
            </tr>
          </thead>
          <tbody>
            {colleges.length > 0 ? (
              colleges.map((college) => (
                <tr key={college.id}>
                  <td>{college.name}</td>
                  <td>{college.id}</td>
                  <td>{college.minMarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No colleges available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Check Application Status */}
      <div className="form-section" style={{ marginTop: "30px" }}>
        <h3>🔍 Check Application Status</h3>
        <input
          type="number"
          placeholder="Enter your Student ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={checkApplicationStatus}>Check Status</button>

        {applicationDetails && (
          <div
            className="status-card"
            style={{
              marginTop: "15px",
              backgroundColor: "#1f2937",
              color: "#e5e7eb",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h4>📄 Application Details</h4>
            <p><b>Student ID:</b> {applicationDetails.id}</p>
            <p><b>Name:</b> {applicationDetails.name}</p>
            <p><b>Score:</b> {applicationDetails.score}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    applicationDetails.status === "Accepted"
                      ? "lightgreen"
                      : applicationDetails.status === "Rejected"
                      ? "tomato"
                      : "#facc15",
                }}
              >
                {applicationDetails.status}
              </span>
            </p>

            {/* ✅ Conditional Display for Allotted College or Message */}
            {applicationDetails.status === "Accepted" ? (
              <p>
                <b>Allotted College:</b>{" "}
                <span style={{ color: "lightgreen" }}>
                  {applicationDetails.allotted}
                </span>
              </p>
            ) : (
              <p
                style={{
                  color:
                    applicationDetails.status === "Hold"
                      ? "#facc15"
                      : "tomato",
                  fontStyle: "italic",
                }}
              >
                {applicationDetails.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
