import Wallet from './wallet.js';
import Transaction from './transaction.js';
import GossipProtocol from './gossip.js';

export function createWallet() {
  return Wallet.createWallet();
}

export function signTransaction(tx, privateKey) {
  const transaction = new Transaction(tx.from, tx.to, tx.amount, tx.data);
  return transaction.signTransaction(privateKey);
}

export function verifyTransaction(tx, signature, publicKey) {
  return Transaction.verifyTransaction(tx, signature, publicKey);
}

export async function broadcastTransaction(tx) {
  const gossip = new GossipProtocol();
  await gossip.initialize();
  await gossip.broadcastTransaction(tx);
  await gossip.stop();
}

async function main() {
  const wallet = createWallet();
  const tx = Transaction.createTransaction(wallet.address, '0x1234', 100, { type: 'apply' });
  const sig = signTransaction(tx, wallet.privateKey);
  console.log('✅ Transaction signed:', sig);
  await broadcastTransaction(tx);
}

if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main().catch(console.error);
}
