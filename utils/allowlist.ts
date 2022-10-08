import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import allowlist from '../config/allowlist.json';

let merkleTree: MerkleTree;

function buf2hex(address: Buffer) {
  return '0x' + address.toString('hex');
}

function getMerkleTree() {
  if (!merkleTree) {
    const leaves = allowlist.map((address) => keccak256(address));
    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  }
  return merkleTree;
}

export function getMerkleRoot() {
  return buf2hex(getMerkleTree().getRoot());
}

export function getProof(address: string | null) {
  const buf = keccak256((address ?? ''));
  const tree = getMerkleTree();
  console.log(buf2hex(tree.getRoot()));
  const proof = tree.getProof(buf);
  const retProof = proof.map(x => buf2hex(x.data));
  return retProof;
  
  //return getMerkleTree().getHexProof(keccak256(address ?? ''));
}

export function checkAllowlisted(address: string | null) {
  return (
    getMerkleTree().getLeafIndex(Buffer.from(keccak256(address ?? ''))) >= 0
  );
}
