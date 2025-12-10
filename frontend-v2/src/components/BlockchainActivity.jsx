import "../App.css";

function BlockchainActivity({ logs = [] }) {
  return (
    <div className="dashboard" style={{ marginTop: "30px" }}>
      <h3>📜 Blockchain Activity Log</h3>
      {logs.length === 0 ? (
        <p>No blockchain events yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Tx Hash</th>
              <th>Block #</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.type}</td>
                <td>
                  <a
                    href={`https://amoy.polygonscan.com/tx/${log.hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {log.hash.slice(0, 10)}...
                  </a>
                </td>
                <td>{log.blockNumber}</td>
                <td>{new Date(log.timestamp * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BlockchainActivity;
