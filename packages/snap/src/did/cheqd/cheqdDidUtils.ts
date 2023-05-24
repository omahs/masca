// import { util } from '@cef-ebsi/key-did-resolver';
// import { bytesToBase64url, hexToBytes } from '@veramo/utils';
// import { ec as EC } from 'elliptic';

// import { createCosmosPayerWallet } from '@cheqd/sdk';
// import { base58btc } from 'multiformats/bases/base58';

import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { snapConfirm } from '../../utils/snapUtils';
import { getAgent } from '../../veramo/setup';

// import { addMulticodecPrefix } from '../../utils/formatUtils';
// import { getCompressedPublicKey } from '../../utils/snapUtils';

export async function getDidCheqdIdentifier(params: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
}): Promise<string> {
  const { snap, ethereum } = params;
  const agent = await getAgent(snap, ethereum);
  const identifier = await agent.didManagerCreate();
  const { did } = identifier;

  const content = panel([
    heading('Fund Account'),
    text('Make sure the account below is funded with CHEQ tokens!'),
    divider(),
    text(`Switching to: did:cheqd`),
  ]);

  if (await snapConfirm(snap, content)) {
    console.log('Now delam nekaj');
  }

  return did;
}
