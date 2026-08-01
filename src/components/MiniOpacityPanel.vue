<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { emitTo } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { detectLocale, useI18n } from "../composables/useI18n";
import {
  defaultMiniOpacityPercent,
  maxMiniOpacityPercent,
  minMiniOpacityPercent,
  normalizeMiniOpacityPercent,
  type ThemeMode,
} from "../lib/window-mode";

type MiniOpacityPanelPayload = {
  value?: number;
  themeMode?: ThemeMode;
  locale?: string;
};

const { locale, t } = useI18n();
const appWindow = getCurrentWindow();
const opacityPercent = ref(defaultMiniOpacityPercent);
const themeMode = ref<ThemeMode>("light");
const panelClass = computed(() =>
  themeMode.value === "dark" ? "theme-dark" : "theme-light",
);
const sliderStyle = computed(() => ({
  "--slider-progress": `${
    ((opacityPercent.value - minMiniOpacityPercent) /
      (maxMiniOpacityPercent - minMiniOpacityPercent)) *
    100
  }%`,
}));

const emitOpacityChange = async (commit = false) => {
  await emitTo("main", "mini-opacity-change", {
    commit,
    value: opacityPercent.value,
  });
};

const updateOpacity = (event: Event, commit = false) => {
  opacityPercent.value = normalizeMiniOpacityPercent(
    Number((event.target as HTMLInputElement).value),
  );
  void emitOpacityChange(commit);
};

const hidePanel = () => {
  void appWindow.hide();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    hidePanel();
  }
};

let unlistenPanelOpen: (() => void) | undefined;

onMounted(async () => {
  unlistenPanelOpen = await appWindow.listen<MiniOpacityPanelPayload>(
    "mini-opacity-panel-open",
    (event) => {
      opacityPercent.value = normalizeMiniOpacityPercent(event.payload.value);
      if (event.payload.themeMode === "dark" || event.payload.themeMode === "light") {
        themeMode.value = event.payload.themeMode;
      }
      // This window never reads the settings store, so the main window is the only source of
      // truth for the language. Assign the ref directly instead of going through setLocale:
      // that would re-broadcast locale-changed from a window that never changed anything.
      locale.value = detectLocale(event.payload.locale);
    },
  );
  window.addEventListener("blur", hidePanel);
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  unlistenPanelOpen?.();
  window.removeEventListener("blur", hidePanel);
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <section
    class="mini-opacity-panel"
    :class="panelClass"
    :style="sliderStyle"
    @contextmenu.prevent
  >
    <header class="mini-opacity-panel__meta">
      <strong>{{ t("opacity.header") }}</strong>
      <span>{{ opacityPercent }}%</span>
    </header>
    <input
      :aria-label="t('opacity.ariaLabel')"
      :aria-valuetext="`${t('opacity.ariaLabel')} ${opacityPercent}%`"
      :max="maxMiniOpacityPercent"
      :min="minMiniOpacityPercent"
      :value="opacityPercent"
      step="1"
      type="range"
      @change="updateOpacity($event, true)"
      @input="updateOpacity"
    />
  </section>
</template>

<style scoped>
.mini-opacity-panel {
  display: grid;
  width: 100%;
  height: 100%;
  align-content: center;
  gap: 4px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--panel);
  box-shadow: var(--shadow);
  color: var(--text);
  font-family: var(--font-sans);
  padding: 6px 8px 7px;
}

.theme-light {
  --panel: rgb(250 250 251 / 0.98);
  --line: rgb(24 24 27 / 0.11);
  --text: rgb(24 24 27);
  --muted: rgb(82 82 91);
  --accent: rgb(217 119 6);
  --track: rgb(228 228 231 / 0.92);
  --thumb: rgb(250 250 251);
  --shadow: 0 7px 16px rgb(15 23 42 / 0.13);
}

.theme-dark {
  --panel: rgb(24 24 27 / 0.98);
  --line: rgb(255 255 255 / 0.14);
  --text: rgb(250 250 250);
  --muted: rgb(161 161 170);
  --accent: rgb(245 158 11);
  --track: rgb(63 63 70 / 0.92);
  --thumb: rgb(250 250 250);
  --shadow: 0 8px 18px rgb(0 0 0 / 0.28);
}

.mini-opacity-panel__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

strong {
  overflow: hidden;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

span {
  color: var(--text);
  font-family: var(--font-dashboard);
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

input {
  appearance: none;
  display: block;
  width: 100%;
  height: 8px;
  accent-color: var(--accent);
  background: transparent;
  cursor: pointer;
}

input::-webkit-slider-runnable-track {
  height: 2px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, var(--accent) var(--slider-progress), transparent 0),
    var(--track);
}

input::-webkit-slider-thumb {
  appearance: none;
  width: 8px;
  height: 8px;
  margin-top: -3px;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  background: var(--thumb);
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.18);
}

input:focus-visible {
  outline: none;
}

input:focus-visible::-webkit-slider-thumb {
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--accent) 24%, transparent),
    0 1px 4px rgb(0 0 0 / 0.18);
}
</style>
