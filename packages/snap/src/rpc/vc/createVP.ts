import type { CreateVPRequestParams } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type { VerifiablePresentation } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { veramoCreateVP } from '../../utils/veramoUtils';

export async function createVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  const { vcs, proofFormat = 'jwt', proofOptions } = createVPParams;
  const res = await veramoCreateVP(
    {
      snap: params.snap,
      state: params.state,
      ethereum: params.ethereum,
      account: params.account,
      bip44CoinTypeNode: params.bip44CoinTypeNode as BIP44CoinTypeNode,
    },
    { vcs, proofFormat, proofOptions }
  );
  return res;
}
