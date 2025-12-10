import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnect from "./components/WalletConnect";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [studentAccount, setStudentAccount] = useState("");
  const [adminAccount, setAdminAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [view, setView] = useState("landing");
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }

    // Auto refresh on account switch
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  // 🎓 Connect as Student
  const connectStudentWallet = async () => {
    if (!provider) return alert("Install MetaMask first!");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setStudentAccount(accounts[0]);
    const bal = await provider.getBalance(accounts[0]);
    setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    alert("🎓 Connected as Student");
  };

  // 🏛️ Connect as Admin
  const connectAdminWallet = async () => {
    if (!provider) return alert("Install MetaMask first!");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAdminAccount(accounts[0]);
    const bal = await provider.getBalance(accounts[0]);
    setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    alert("🏛️ Connected as Admin");
  };

  const handleGoBack = () => setView("landing");

  // Blockchain logger
  const addActivity = (action, details) => {
    setActivityLog((prev) => [...prev, { action, details }]);
  };

  return (
    <div className="app-container">
      {view === "landing" && (
        <LandingPage
          connectStudentWallet={connectStudentWallet}
          connectAdminWallet={connectAdminWallet}
          studentAccount={studentAccount}
          adminAccount={adminAccount}
          onSelectPortal={setView}
        />
      )}

      {view === "student" && (
        <div>
          <button className="back-button" onClick={handleGoBack}>
            ⬅ Back
          </button>
          <StudentDashboard
            account={studentAccount}
            provider={provider}
            addActivity={addActivity}
          />
        </div>
      )}

      {view === "admin" && (
        <div>
          <button className="back-button" onClick={handleGoBack}>
            ⬅ Back
          </button>
          <AdminDashboard
            account={adminAccount}
            provider={provider}
            activityLog={activityLog}
            addActivity={addActivity}
          />
        </div>
      )}
    </div>
  );
}

export default App;
