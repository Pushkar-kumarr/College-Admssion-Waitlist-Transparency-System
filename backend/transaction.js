import Wallet from './wallet.js';

export default class Transaction {
  constructor(from, to, amount, data = {}) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.data = data;
    this.timestamp = Date.now();
    this.signature = null;
  }

  signTransaction(privateKey) {
    const tempWallet = Wallet.createWallet();
    this.signature = tempWallet.signTransaction(this);
    return this.signature;
  }

  static verifyTransaction(transaction, signature, publicKey) {
    return Wallet.verifyTransaction(transaction, signature, publicKey);
  }

  static createTransaction(from, to, amount, data = {}) {
    return new Transaction(from, to, amount, data);
  }
}
