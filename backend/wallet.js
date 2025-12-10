import EC from 'elliptic';
const ec = new EC.ec('secp256k1');

export default class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
    this.address = '0x' + this.publicKey.slice(-40);
  }

  static createWallet() {
    return new Wallet();
  }

  signTransaction(transaction) {
    const txHash = this.hashTransaction(transaction);
    const signature = this.keyPair.sign(txHash);
    return {
      r: signature.r.toString(16),
      s: signature.s.toString(16),
      v: signature.recoveryParam,
    };
  }

  hashTransaction(transaction) {
    return ec.hash().update(JSON.stringify(transaction)).digest('hex');
  }

  static verifyTransaction(transaction, signature, publicKey) {
    const txHash = ec.hash().update(JSON.stringify(transaction)).digest('hex');
    const key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(txHash, signature);
  }
}
