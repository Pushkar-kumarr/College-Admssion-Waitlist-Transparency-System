import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/web3";
import contractABI from "../utils/abi.json";
import "../App.css";

const CONTRACT_ADDRESS = "0xc147349cB867de61e6C641dde624a83B996f0232";
const ADMIN_ADDRESS = "0xC1F9ed242a8D0fdaEfAa091F24d684A3E937679d";

function AdminDashboard({ account, provider, addActivity }) {
  const [collegeName, setCollegeName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [minMarks, setMinMarks] = useState("");
  const [colleges, setColleges] = useState([]);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [status, setStatus] = useState("");
  const [recentTxs, setRecentTxs] = useState([]);

  const ADMIN_ADDRESS = "0xC1F9ed242a8D0fdaEfAa091F24d684A3E937679d";

useEffect(() => {
  if (!account) return; // wait until wallet connects
  if (account.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
    alert("⚠️ Access Denied! Only the admin wallet can access this dashboard.");
    window.location.href = "/"; // redirect to landing
  }
}, [account]);


  useEffect(() => {
    if (provider) {
      fetchColleges();
      fetchRecentTransactions();

      // Auto-refresh every 30 sec
      const interval = setInterval(fetchRecentTransactions, 30000);
      return () => clearInterval(interval);
    }

    if (account && account.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      alert("⚠️ Only the admin wallet can access this page.");
      window.location.reload();
    }
  }, [provider]);

  // 🔹 Fetch all colleges
  const fetchColleges = async () => {
    try {
      const contract = await getContract(provider);
      const [ids, names, marks] = await contract.getAllColleges();
      const formatted = ids.map((id, i) => ({
        id: id.toString(),
        name: names[i],
        minMarks: marks[i].toString(),
      }));
      setColleges(formatted);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  // 🔹 Fetch last 3 blockchain transactions
  const fetchRecentTransactions = async () => {
    try {
      const iface = new ethers.Interface(contractABI.abi);
      const currentBlock = await provider.getBlockNumber();

      const logs = await provider.getLogs({
        address: CONTRACT_ADDRESS,
        fromBlock: Math.max(currentBlock - 5000, 0),
        toBlock: currentBlock,
      });

      const decodedLogs = logs
        .map((log) => {
          try {
            const parsed = iface.parseLog(log);
            return {
              event: parsed.name,
              args: parsed.args,
              txHash: log.transactionHash,
              blockNumber: log.blockNumber,
            };
          } catch {
            return null;
          }
        })
        .filter((e) => e !== null)
        .reverse()
        .slice(0, 3);

      const enriched = await Promise.all(
        decodedLogs.map(async (tx) => {
          const [block, txDetails] = await Promise.all([
            provider.getBlock(tx.blockNumber),
            provider.getTransaction(tx.txHash),
          ]);

          return {
            ...tx,
            timestamp: block.timestamp,
            parentHash: block.parentHash,
            from: txDetails.from,
          };
        })
      );

      setRecentTxs(enriched);
    } catch (error) {
      console.error("Error fetching blockchain logs:", error);
    }
  };

  // 🔹 Add new college
  const addCollege = async () => {
    if (!collegeName || !collegeId || !minMarks)
      return alert("All fields required!");

    try {
      const contract = await getContract(provider);
      setStatus("🔄 Signing transaction...");
      const tx = await contract.addCollege(
        parseInt(collegeId),
        collegeName,
        parseInt(minMarks)
      );
      setStatus("📡 Broadcasting to network...");

      const receipt = await tx.wait();
      const block = await provider.getBlock(receipt.blockNumber);

      addActivity("Add College", {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        timestamp: block.timestamp,
        creator: block.miner,
        parentHash: block.parentHash,
      });

      setStatus(`✅ Confirmed in block ${receipt.blockNumber}`);
      setTimeout(() => setStatus(""), 4000);

      alert("✅ College added successfully!");
      setCollegeName("");
      setCollegeId("");
      setMinMarks("");
      fetchColleges();
      fetchRecentTransactions();
    } catch (error) {
      console.error("Error adding college:", error);
      setStatus("❌ Transaction failed.");
      setTimeout(() => setStatus(""), 4000);
      alert("❌ Error adding college. Check console for details.");
    }
  };

  // 🔹 Fetch applicants
  const fetchApplicants = async () => {
    try {
      const contract = await getContract(provider);
      const list = await contract.getAllApplicants();
      const formatted = list.map((a) => ({
        id: a.id.toString(),
        name: a.name,
        score: a.score.toString(),
        status: a.status,
        preferences: a.preferences.map((p) => p.toString()).join(", "),
        marksheetProof: a.marksheetProof,
      }));

      const sorted = formatted.sort(
        (a, b) => Number(b.score) - Number(a.score)
      );
      setStudents(sorted);
      setShowStudents(true);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  // 🔹 Update applicant status
  const updateStatus = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      const contract = await getContract(provider);
      setStatus("🔄 Signing transaction...");
      const tx = await contract.updateStatus(parseInt(id), newStatus);
      setStatus("📡 Broadcasting to network...");
      const receipt = await tx.wait();
      const block = await provider.getBlock(receipt.blockNumber);

      addActivity("Update Status", {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        timestamp: block.timestamp,
        creator: block.miner,
        parentHash: block.parentHash,
      });

      setStatus(`✅ Status updated in block ${receipt.blockNumber}`);
      setTimeout(() => setStatus(""), 4000);

      alert(`✅ Status updated to ${newStatus}`);
      fetchApplicants();
      fetchRecentTransactions();
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus("❌ Transaction failed.");
      setTimeout(() => setStatus(""), 4000);
      alert("❌ Error updating status.");
    }
  };

  // 🔹 Open IPFS marksheet
  const openIPFSFile = (uri) => {
    if (!uri || !uri.startsWith("ipfs://")) {
      alert("❌ Invalid or missing IPFS link.");
      return;
    }
    const url = uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    window.open(url, "_blank");
  };

  return (
    <div className="dashboard">
      <h2>🏛️ Admin Dashboard</h2>
      <p>
        Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
      </p>

      {/* Add College Section */}
      <div className="form-section">
        <h3>Add College</h3>
        <input
          type="text"
          placeholder="College Name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
        />
        <input
          type="number"
          placeholder="College ID"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minimum Marks"
          value={minMarks}
          onChange={(e) => setMinMarks(e.target.value)}
        />
        {status && <p style={{ color: "#60a5fa" }}>{status}</p>}
        <button onClick={addCollege}>Add College</button>
      </div>

      {/* Colleges List */}
      <div className="table-section">
        <h3>🏫 Colleges List</h3>
        <table>
          <thead>
            <tr>
              <th>College Name</th>
              <th>ID</th>
              <th>Minimum Marks</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college) => (
              <tr key={college.id}>
                <td>{college.name}</td>
                <td>{college.id}</td>
                <td>{college.minMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button style={{ marginTop: "15px" }} onClick={fetchApplicants}>
        View Applied Students
      </button>

      {showStudents && (
        <div className="table-section">
          <h3>📜 Applied Students</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Score</th>
                <th>Preferences</th>
                <th>Marksheet</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.score}</td>
                  <td>{student.preferences}</td>
                  <td>
                    {student.marksheetProof ? (
                      <button onClick={() => openIPFSFile(student.marksheetProof)}>
                        View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{student.status}</td>
                  <td>
                    <select
                      defaultValue=""
                      onChange={(e) =>
                        updateStatus(student.id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Accepted">Accept</option>
                      <option value="Rejected">Reject</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Blockchain Recent Transactions Log */}
      <div className="table-section" style={{ marginTop: "30px" }}>
        <h3>⛓️ Latest 3 Blockchain Transactions</h3>
        {recentTxs.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Tx Hash</th>
                <th>Block</th>
                <th>Parent Hash</th>
                <th>Wallet Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentTxs.map((tx, idx) => (
                <tr key={idx}>
                  <td>{tx.event}</td>
                  <td>
                    <a
                      href={`https://amoy.polygonscan.com/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tx.txHash.slice(0, 10)}...
                    </a>
                  </td>
                  <td>{tx.blockNumber}</td>
                  <td>
                    {tx.parentHash
                      ? tx.parentHash.slice(0, 10) + "..."
                      : "-"}
                  </td>
                  <td>
                    {tx.from
                      ? tx.from.slice(0, 8) + "..." + tx.from.slice(-6)
                      : "-"}
                  </td>
                  <td>
                    {new Date(tx.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent blockchain transactions.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
