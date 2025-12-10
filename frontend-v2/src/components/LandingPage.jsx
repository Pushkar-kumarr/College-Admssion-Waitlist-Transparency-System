import "../App.css";

function LandingPage({
  connectStudentWallet,
  connectAdminWallet,
  studentAccount,
  adminAccount,
  onSelectPortal,
}) {
  return (
    <div className="landing">
      <h1>🎓 Welcome to College Admission System</h1>
      <p style={{ marginBottom: "20px" }}>Connect a wallet and select your role:</p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <button
          onClick={connectStudentWallet}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🎓 Connect as Student
        </button>
        <button
          onClick={connectAdminWallet}
          style={{
            backgroundColor: "#16a34a",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🏛️ Connect as Admin
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {studentAccount && (
          <>
            <p style={{ color: "#9ca3af" }}>
              🎓 Student Connected: {studentAccount.slice(0, 6)}...
              {studentAccount.slice(-4)}
            </p>
            <button
              onClick={() => onSelectPortal("student")}
              style={{
                backgroundColor: "#1d4ed8",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Go to Student Portal
            </button>
          </>
        )}

        {adminAccount && (
          <>
            <p style={{ color: "#9ca3af" }}>
              🏛️ Admin Connected: {adminAccount.slice(0, 6)}...
              {adminAccount.slice(-4)}
            </p>
            <button
              onClick={() => onSelectPortal("admin")}
              style={{
                backgroundColor: "#15803d",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Go to Admin Portal
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
