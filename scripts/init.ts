import { setupComputer } from '../lib/computer';

await setupComputer().then(async () => {
  console.log('Computer setup complete');
});
