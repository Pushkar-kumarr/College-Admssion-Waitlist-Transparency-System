import { createLibp2p } from 'libp2p';
import { gossipsub } from '@libp2p/gossipsub';
import { createEd25519PeerId } from '@libp2p/peer-id-factory';

export default class GossipProtocol {
  constructor() {
    this.node = null;
    this.topic = 'blockchain-transactions';
  }

  async initialize() {
    const peerId = await createEd25519PeerId();

    this.node = await createLibp2p({
      peerId,
      addresses: { listen: ['/ip4/0.0.0.0/tcp/0'] },
      services: { pubsub: gossipsub() },
    });

    await this.node.start();
    await this.node.services.pubsub.subscribe(this.topic);
    console.log('✅ Gossip node started.');
  }

  async broadcastTransaction(transaction) {
    if (!this.node) throw new Error('Gossip protocol not initialized');
    const message = JSON.stringify(transaction);
    await this.node.services.pubsub.publish(this.topic, new TextEncoder().encode(message));
    console.log('Transaction broadcasted:', transaction);
  }

  onTransactionReceived(callback) {
    if (!this.node) throw new Error('Gossip protocol not initialized');
    this.node.services.pubsub.addEventListener('message', (msg) => {
      if (msg.detail.topic === this.topic) {
        const transaction = JSON.parse(new TextDecoder().decode(msg.detail.data));
        callback(transaction);
      }
    });
  }

  async stop() {
    if (this.node) await this.node.stop();
  }
}
