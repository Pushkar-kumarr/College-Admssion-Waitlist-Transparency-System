import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Login from './component/Login';
import StudentDashboard from './component/StudentDashboard';
import AdminDashboard from './component/AdminDashboard';
import AppliedStudentsDashboard from './component/AppliedStudentsDashboard';
import WalletConnect from './component/WalletConnect';
import './Dashboard.css';

function App() {
  const [portal, setPortal] = useState('login');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const handleNavigateToAppliedStudents = () => setPortal('appliedStudents');

  const renderContent = () => {
    switch (portal) {
      case 'login':
        return <Login onSelectPortal={setPortal} />;
      case 'student':
        return (
          <>
            <WalletConnect account={account} balance={balance} connectWallet={connectWallet} />
            <StudentDashboard account={account} provider={provider} />
            <button onClick={() => setPortal('login')}>Back to Login</button>
          </>
        );
      case 'admin':
        return (
          <>
            <WalletConnect account={account} balance={balance} connectWallet={connectWallet} />
            <AdminDashboard
              account={account}
              provider={provider}
              onNavigateToAppliedStudents={handleNavigateToAppliedStudents}
            />
            <button onClick={() => setPortal('login')}>Back to Login</button>
          </>
        );
      case 'appliedStudents':
        return (
          <>
            <WalletConnect account={account} balance={balance} connectWallet={connectWallet} />
            <AppliedStudentsDashboard
              account={account}
              provider={provider}
              onBack={() => setPortal('admin')}
            />
          </>
        );
      default:
        return null;
    }
  };

  return <div className="App">{renderContent()}</div>;
}

export default App;
