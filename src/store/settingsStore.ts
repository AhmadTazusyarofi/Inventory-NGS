import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  appName: string;
  appLogo: string;
  setAppName: (name: string) => void;
  setAppLogo: (logo: string) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  appName: 'NGS',
  appLogo: '',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setAppName: (name) => set({ appName: name }),
      setAppLogo: (logo) => set({ appLogo: logo }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'app-settings',
    }
  )
);
