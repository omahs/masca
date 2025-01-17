import fs from 'fs';
import { execa } from 'execa';

// Read packages/snap/package.json
const snapPackageJson = JSON.parse(
  fs.readFileSync('packages/snap/package.json', { encoding: 'utf-8' })
);

const snapVersion = snapPackageJson.version;

// Update packages/snap/snap.manifest.json
const snapManifestJson = JSON.parse(
  fs.readFileSync('packages/snap/snap.manifest.json', { encoding: 'utf-8' })
);

snapManifestJson.version = snapVersion;

fs.writeFileSync(
  'packages/snap/snap.manifest.json',
  JSON.stringify(snapManifestJson, null, 2)
);

// Update packages/dapp/utils/masca.json
const dappMascaJson = JSON.parse(
  fs.readFileSync('packages/dapp/src/utils/masca.json', {
    encoding: 'utf-8',
  })
);

dappMascaJson.mascaVersion = snapVersion;

fs.writeFileSync(
  'packages/dapp/src/utils/masca.json',
  JSON.stringify(dappMascaJson, null, 2)
);

// Update packages/connector/src/masca.json
const connectorMascaJson = JSON.parse(
  fs.readFileSync('packages/connector/src/masca.json', {
    encoding: 'utf-8',
  })
);

connectorMascaJson.mascaVersion = snapVersion;

fs.writeFileSync(
  'packages/connector/src/masca.json',
  JSON.stringify(connectorMascaJson, null, 2)
);

const { stdout } = await execa(
  'pnpm nx run-many --target lint:fix -p @blockchain-lab-um/masca @blockchain-lab-um/masca-connector @blockchain-lab-um/dapp',
  {
    shell: true,
  }
);

console.log(stdout);
