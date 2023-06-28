import type { SnapsGlobalObject } from '@metamask/snaps-types';

import { getInitialSnapState } from '../../src/utils/config';
import { init } from '../../src/utils/init';
import { createMockSnap, SnapMock } from '../testUtils/snap.mock';

describe('RPC handler [init]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  it('should succeed for accepted terms and conditions', async () => {
    const initialState = getInitialSnapState();
    snapMock.rpcMocks.snap_dialog.mockReturnValueOnce(true);

    await expect(init(snapMock)).resolves.toEqual(initialState);
    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
      operation: 'update',
      newState: initialState,
    });

    expect.assertions(2);
  });
});
