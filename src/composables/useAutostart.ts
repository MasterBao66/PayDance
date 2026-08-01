// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { ref } from "vue";
import {
  readAutostartEnabled,
  setAutostartEnabled,
  tauriAutostartAdapter,
  type AutostartAdapter,
} from "../lib/autostart";

/**
 * Owns the three refs and two calls the settings switch needs. The in-flight guard matters:
 * the OS registry write is slow enough that a double click would otherwise fire two writes
 * and leave the switch showing whichever one happened to finish last.
 */
export function useAutostart(
  getErrorMessage: () => string,
  adapter: AutostartAdapter = tauriAutostartAdapter,
) {
  const autostartEnabled = ref(false);
  const autostartError = ref("");
  const isAutostartUpdating = ref(false);

  const refreshAutostart = async () => {
    const result = await readAutostartEnabled(adapter);
    autostartEnabled.value = result.enabled;
    autostartError.value = result.error;
  };

  const updateAutostartEnabled = async (enabled: boolean) => {
    if (isAutostartUpdating.value) return;

    isAutostartUpdating.value = true;
    try {
      const result = await setAutostartEnabled(
        adapter,
        enabled,
        autostartEnabled.value,
        getErrorMessage(),
      );
      autostartEnabled.value = result.enabled;
      autostartError.value = result.error;
    } finally {
      isAutostartUpdating.value = false;
    }
  };

  return {
    autostartEnabled,
    autostartError,
    isAutostartUpdating,
    refreshAutostart,
    updateAutostartEnabled,
  };
}
