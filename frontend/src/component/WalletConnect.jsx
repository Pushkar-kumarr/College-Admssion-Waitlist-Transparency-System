function WalletConnect({ account, balance, connectWallet }) {
  return (
    <div className="wallet-connect">
      <h2>Wallet Connection</h2>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} MATIC</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
}

export default WalletConnect;
