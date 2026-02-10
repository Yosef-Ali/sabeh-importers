import { create } from 'zustand';

type UIState = {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  language: 'en' | 'am';
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setLanguage: (lang: 'en' | 'am') => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  language: 'en',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  setLanguage: (language) => set({ language }),
}));
