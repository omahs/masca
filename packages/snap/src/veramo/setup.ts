import {
  MascaKeyDidProvider,
  getMascaDidKeyResolver as mascaKeyDidResolver,
} from '@blockchain-lab-um/did-provider-key';
import {
  IOIDCClientPlugin,
  OIDCClientPlugin,
} from '@blockchain-lab-um/oidc-client-plugin';
import {
  AbstractDataStore,
  DataManager,
  type IDataManager,
} from '@blockchain-lab-um/veramo-datamanager';
import {
  // CheqdDIDProvider,
  getResolver as cheqdDidResolver,
} from '@cheqd/did-provider-cheqd';
import { Web3Provider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  createAgent,
  type ICredentialVerifier,
  type IDataStore,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
  type TAgent,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import {
  CredentialPlugin,
  type ICredentialIssuer,
} from '@veramo/credential-w3c';
import { AbstractIdentifierProvider, DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import {
  JwkDIDProvider,
  getDidJwkResolver as jwkDidResolver,
} from '@veramo/did-provider-jwk';
import {
  PkhDIDProvider,
  getDidPkhResolver as pkhDidResolver,
} from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';

import { getUniversalDidResolver as universalDidResolver } from '../did/universal/universalDidResolver';
import { getAddressKeyDeriver, snapGetKeysFromAddress } from '../utils/keyPair';
import { getCurrentAccount, getEnabledVCStores } from '../utils/snapUtils';
import { getSnapState } from '../utils/stateUtils';
import { CeramicVCStore } from './plugins/ceramicDataStore/ceramicDataStore';
import {
  SnapDIDStore,
  SnapVCStore,
} from './plugins/snapDataStore/snapDataStore';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IResolver &
    IDataManager &
    ICredentialIssuer &
    ICredentialVerifier &
    IOIDCClientPlugin
>;

export const getAgent = async (
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider
): Promise<Agent> => {
  const state = await getSnapState(snap);
  const account = getCurrentAccount(state);
  const didProviders: Record<string, AbstractIdentifierProvider> = {};
  const vcStorePlugins: Record<string, AbstractDataStore> = {};
  const enabledVCStores = getEnabledVCStores(account, state);
  const networks = [
    {
      name: 'mainnet',
      provider: new Web3Provider(ethereum as any),
    },
    {
      name: '0x05',
      provider: new Web3Provider(ethereum as any),
    },
    {
      name: 'goerli',
      provider: new Web3Provider(ethereum as any),
      chainId: '0x5',
    },
  ];

  didProviders['did:ethr'] = new EthrDIDProvider({
    defaultKms: 'web3',
    networks,
  });

  if (state.accountState[account].accountConfig.ssi.didMethod === 'did:cheqd') {
    const bip44CoinTypeNode = await getAddressKeyDeriver({
      state,
      snap,
      account,
    });
    const res = await snapGetKeysFromAddress({
      bip44CoinTypeNode,
      state,
      account,
      snap,
    });
    if (!res) throw new Error('Failed to get keys');
    const privateKey = res.privateKey.split('0x')[1];
    console.log('private key: ', privateKey);
    // didProviders['did:cheqd'] = new CheqdDIDProvider({
    //   defaultKms: 'web3',
    //   cosmosPayerSeed: privateKey,
    // });
  }
  didProviders['did:key'] = new MascaKeyDidProvider({ defaultKms: 'web3' });
  didProviders['did:pkh'] = new PkhDIDProvider({ defaultKms: 'web3' });
  didProviders['did:jwk'] = new JwkDIDProvider({ defaultKms: 'web3' });

  vcStorePlugins.snap = new SnapVCStore(snap, ethereum);
  if (enabledVCStores.includes('ceramic')) {
    vcStorePlugins.ceramic = new CeramicVCStore(snap, ethereum);
  }
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IResolver &
      IDataManager &
      ICredentialIssuer &
      ICredentialVerifier &
      IOIDCClientPlugin
  >({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          snap: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DataManager({ store: vcStorePlugins }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ networks }),
          ...mascaKeyDidResolver(),
          ...pkhDidResolver(),
          ...cheqdDidResolver(),
          // ...ebsiDidResolver(),
          ...jwkDidResolver(),
          ...universalDidResolver(),
        }),
      }),
      new DIDManager({
        store: new SnapDIDStore(snap, ethereum),
        defaultProvider: 'metamask',
        providers: didProviders,
      }),
      new OIDCClientPlugin(),
    ],
  });
  return agent;
};
