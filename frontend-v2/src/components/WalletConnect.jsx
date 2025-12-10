function WalletConnect({ account, balance, connectWallet }) {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <h3>Wallet Connection</h3>
      {account ? (
        <div>
          <p><strong>Account:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} MATIC</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
}

export default WalletConnect;
