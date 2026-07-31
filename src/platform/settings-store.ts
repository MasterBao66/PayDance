// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

export type SettingsStoreAdapter = {
  delete?: (key: string) => Promise<void>;
  get: <Value>(key: string) => Promise<Value | undefined>;
  save: () => Promise<void>;
  set: (key: string, value: unknown) => Promise<void>;
};

export const createSettingsStore = async (
  fileName: string,
): Promise<SettingsStoreAdapter> => {
  const { LazyStore } = await import("@tauri-apps/plugin-store");
  const store = new LazyStore(fileName);

  return {
    delete: async (key: string) => {
      await store.delete(key);
    },
    get: (key) => store.get(key),
    save: () => store.save(),
    set: (key, value) => store.set(key, value),
  };
};
