'use server';

import { initComputer } from '../../lib/computer';
import type { KeychainItem } from '../../types/keychain';

export async function saveKeychainItems(items: KeychainItem[]) {
  try {
    const computer = await initComputer();

    // Save each keychain item using the computer's keychain app
    await Promise.all(
      items.map((item) =>
        computer.apps.keychain.setKey(item.service, {
          ...(item.username && { username: item.username }),
          ...(item.password && { password: item.password }),
          ...(item.token && { token: item.token }),
          ...(item.email && { email: item.email }),
          ...(item.phone && { phone: item.phone }),
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error('Error saving keychain items:', error);
    return { success: false, error: 'Failed to save keychain items' };
  }
}
