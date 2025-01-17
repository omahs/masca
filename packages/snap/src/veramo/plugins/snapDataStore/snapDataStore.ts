import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { uint8ArrayToHex } from '@blockchain-lab-um/utils';
import {
  AbstractDataStore,
  type IFilterArgs,
  type IQueryResult,
} from '@blockchain-lab-um/veramo-datamanager';
import type { RequireOnly, W3CVerifiableCredential } from '@veramo/core';
import type { ManagedPrivateKey } from '@veramo/key-manager';
import { sha256 } from 'ethereum-cryptography/sha256';
import jsonpath from 'jsonpath';

import StorageService from '../../../storage/Storage.service';
import { decodeJWT } from '../../../utils/jwt';

export type ImportablePrivateKey = RequireOnly<
  ManagedPrivateKey,
  'privateKeyHex' | 'type'
>;

/**
 * An implementation of {@link AbstractDataStore} that holds everything in snap state.
 */
export class SnapCredentialStore extends AbstractDataStore {
  async query(args: IFilterArgs): Promise<IQueryResult[]> {
    const { filter } = args;
    const state = StorageService.get();

    if (filter && filter.type === 'id') {
      try {
        if (
          state[CURRENT_STATE_VERSION].accountState[
            state[CURRENT_STATE_VERSION].currentAccount
          ].veramo.credentials[filter.filter]
        ) {
          let vc = state[CURRENT_STATE_VERSION].accountState[
            state[CURRENT_STATE_VERSION].currentAccount
          ].veramo.credentials[filter.filter] as unknown;
          if (typeof vc === 'string') {
            vc = decodeJWT(vc);
          }
          const obj = [
            {
              metadata: { id: filter.filter },
              data: vc,
            },
          ];
          return obj;
        }
        return [];
      } catch (e) {
        throw new Error('Invalid id');
      }
    }
    if (filter === undefined || (filter && filter.type === 'none')) {
      return Object.keys(
        state[CURRENT_STATE_VERSION].accountState[
          state[CURRENT_STATE_VERSION].currentAccount
        ].veramo.credentials
      ).map((k) => {
        let vc = state[CURRENT_STATE_VERSION].accountState[
          state[CURRENT_STATE_VERSION].currentAccount
        ].veramo.credentials[k] as unknown;
        if (typeof vc === 'string') {
          vc = decodeJWT(vc);
        }
        return {
          metadata: { id: k },
          data: vc,
        };
      });
    }
    if (filter && filter.type === 'JSONPath') {
      const objects = Object.keys(
        state[CURRENT_STATE_VERSION].accountState[
          state[CURRENT_STATE_VERSION].currentAccount
        ].veramo.credentials
      ).map((k) => {
        let vc = state[CURRENT_STATE_VERSION].accountState[
          state[CURRENT_STATE_VERSION].currentAccount
        ].veramo.credentials[k] as unknown;
        if (typeof vc === 'string') {
          vc = decodeJWT(vc);
        }
        return {
          metadata: { id: k },
          data: vc,
        };
      });
      const filteredObjects = jsonpath.query(objects, filter.filter);
      return filteredObjects as IQueryResult[];
    }
    return [];
  }

  async delete({ id }: { id: string }) {
    const state = StorageService.get();

    if (
      !state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].veramo.credentials[id]
    )
      throw Error('ID not found');

    delete state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].veramo.credentials[id];
    return true;
  }

  async save(args: { data: W3CVerifiableCredential }): Promise<string> {
    const vc = args.data;
    const state = StorageService.get();

    const id = uint8ArrayToHex(sha256(Buffer.from(JSON.stringify(vc))));

    if (
      !state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].veramo.credentials[id]
    ) {
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].veramo.credentials[id] = vc;
    }

    return id;
  }

  public async clear(_args: IFilterArgs): Promise<boolean> {
    // TODO implement filter (in ceramic aswell)
    const state = StorageService.get();

    state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].veramo.credentials = {};
    return true;
  }

  public async exportStore(): Promise<Record<string, W3CVerifiableCredential>> {
    const state = StorageService.get();

    return state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].veramo.credentials;
  }

  public async importStore(
    data: Record<string, W3CVerifiableCredential>
  ): Promise<boolean> {
    const state = StorageService.get();

    state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].veramo.credentials = data;

    return true;
  }
}
