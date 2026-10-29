import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoadedPdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  arrayBuffer: ArrayBuffer;
  objectUrl: string;
  pageCount?: number;
  pageThumbnails?: string[];
  dimensions?: { width: number; height: number };
}

export interface TranslationConfig {
  sourceLang: string; // 'auto', 'en', 'vi', 'ja', 'zh', 'fr', etc.
  targetLang: string; // 'vi', 'en', etc.
  mode: "preserve_layout" | "bilingual" | "text_only";
  pageRangeMode: "all" | "custom";
  customPages: string; // e.g. "1-5, 8"
  provider: "local_layout" | "azure" | "google" | "gemini";
  preserveFormatting: boolean;
  preserveProperNames: boolean;
}

export interface WatermarkConfig {
  text: string;
  fontSize: number;
  opacity: number; // 0.1 to 1.0
  rotation: number; // -45, 0, 45, etc.
  color: string; // hex
}

export interface PageNumbersConfig {
  format: "page_x_of_y" | "page_x" | "x_slash_y";
  position: "bottom_center" | "bottom_right" | "bottom_left" | "top_center" | "top_right";
  startNumber: number;
  fontSize: number;
}

export interface SplitConfig {
  mode: "ranges" | "all_single_pages";
  ranges: string; // e.g. "1-3, 5, 7-10"
}

export interface RotateConfig {
  angle: 90 | 180 | 270;
  targetPages: "all" | "selected";
  selectedPages: number[];
}

export interface ProtectConfig {
  password: string;
  confirmPassword: string;
}

export interface MetadataConfig {
  title: string;
  author: string;
  subject: string;
  keywords: string;
}

export interface JobState {
  status: "idle" | "running" | "succeeded" | "failed";
  progress: number; // 0 to 100
  message: string;
  resultBlob?: Blob | null;
  resultUrl?: string | null;
  resultFilename?: string | null;
  error?: string | null;
}

export interface AppSettings {
  azureApiKey: string;
  azureRegion: string;
  azureEndpoint: string;
  googleCloudApiKey: string;
  geminiApiKey: string;
  autoCleanFiles: boolean;
  highQualityRender: boolean;
}

interface AppStoreState {
  // Navigation & Layout
  leftSidebarCollapsed: boolean;
  rightSidebarOpen: boolean;
  mobileMenuOpen: boolean;
  toggleLeftSidebar: () => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  toggleRightSidebar: () => void;
  setRightSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Active files in current workspace
  files: LoadedPdfFile[];
  activeFileIndex: number;
  addFiles: (newFiles: LoadedPdfFile[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setActiveFileIndex: (index: number) => void;
  reorderFiles: (files: LoadedPdfFile[]) => void;
  moveFile: (fromIndex: number, toIndex: number) => void;
  updateFileMetadata: (id: string, metadata: Partial<LoadedPdfFile>) => void;

  // Tool Specific Configurations
  translationConfig: TranslationConfig;
  setTranslationConfig: (config: Partial<TranslationConfig>) => void;

  watermarkConfig: WatermarkConfig;
  setWatermarkConfig: (config: Partial<WatermarkConfig>) => void;

  pageNumbersConfig: PageNumbersConfig;
  setPageNumbersConfig: (config: Partial<PageNumbersConfig>) => void;

  splitConfig: SplitConfig;
  setSplitConfig: (config: Partial<SplitConfig>) => void;

  rotateConfig: RotateConfig;
  setRotateConfig: (config: Partial<RotateConfig>) => void;

  protectConfig: ProtectConfig;
  setProtectConfig: (config: Partial<ProtectConfig>) => void;

  metadataConfig: MetadataConfig;
  setMetadataConfig: (config: Partial<MetadataConfig>) => void;

  // Current Job
  currentJob: JobState;
  setJobState: (state: Partial<JobState>) => void;
  resetJob: () => void;

  // Favorites & History (Persisted)
  favorites: string[]; // tool slugs
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;

  recentTools: string[]; // tool slugs
  addRecentTool: (slug: string) => void;

  // App Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Language Localization (Persisted)
  language: "vi" | "en";
  setLanguage: (lang: "vi" | "en") => void;

  // Policy / Terms / Contact Modal
  policyModal: {
    isOpen: boolean;
    tab: "terms" | "privacy" | "contact";
  };
  openPolicyModal: (tab?: "terms" | "privacy" | "contact") => void;
  closePolicyModal: () => void;
}

export type PolicyTab = "terms" | "privacy" | "contact";

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // Layout defaults: Left expanded, Right open for workspace
      leftSidebarCollapsed: false,
      rightSidebarOpen: true,
      mobileMenuOpen: false,

      toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),
      setLeftSidebarCollapsed: (collapsed) =>
        set({ leftSidebarCollapsed: collapsed }),
      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
      setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Files
      files: [],
      activeFileIndex: 0,
      addFiles: (newFiles) =>
        set((state) => {
          const updated = [...state.files, ...newFiles];
          return {
            files: updated,
            activeFileIndex: state.files.length === 0 ? 0 : state.activeFileIndex,
          };
        }),
      removeFile: (id) =>
        set((state) => {
          const updated = state.files.filter((f) => f.id !== id);
          return {
            files: updated,
            activeFileIndex: Math.min(
              state.activeFileIndex,
              Math.max(0, updated.length - 1)
            ),
          };
        }),
      clearFiles: () => {
        const { files } = get();
        files.forEach((f) => {
          if (f.objectUrl) URL.revokeObjectURL(f.objectUrl);
        });
        set({ files: [], activeFileIndex: 0 });
      },
      setActiveFileIndex: (index) => set({ activeFileIndex: index }),
      reorderFiles: (newFiles) => set({ files: newFiles }),
      moveFile: (fromIndex, toIndex) =>
        set((state) => {
          if (
            fromIndex < 0 ||
            fromIndex >= state.files.length ||
            toIndex < 0 ||
            toIndex >= state.files.length
          ) {
            return state;
          }
          const updated = [...state.files];
          const [movedItem] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, movedItem);
          return { files: updated, activeFileIndex: toIndex };
        }),
      updateFileMetadata: (id, metadata) =>
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, ...metadata } : f)),
        })),

      // Configurations
      translationConfig: {
        sourceLang: "auto",
        targetLang: "vi",
        mode: "preserve_layout",
        pageRangeMode: "all",
        customPages: "",
        provider: "local_layout",
        preserveFormatting: true,
        preserveProperNames: true,
      },
      setTranslationConfig: (config) =>
        set((state) => ({
          translationConfig: { ...state.translationConfig, ...config },
        })),

      watermarkConfig: {
        text: "BẢN QUYỀN",
        fontSize: 48,
        opacity: 0.25,
        rotation: 45,
        color: "#0284C7",
      },
      setWatermarkConfig: (config) =>
        set((state) => ({
          watermarkConfig: { ...state.watermarkConfig, ...config },
        })),

      pageNumbersConfig: {
        format: "page_x_of_y",
        position: "bottom_center",
        startNumber: 1,
        fontSize: 10,
      },
      setPageNumbersConfig: (config) =>
        set((state) => ({
          pageNumbersConfig: { ...state.pageNumbersConfig, ...config },
        })),

      splitConfig: {
        mode: "ranges",
        ranges: "1-3",
      },
      setSplitConfig: (config) =>
        set((state) => ({
          splitConfig: { ...state.splitConfig, ...config },
        })),

      rotateConfig: {
        angle: 90,
        targetPages: "all",
        selectedPages: [],
      },
      setRotateConfig: (config) =>
        set((state) => ({
          rotateConfig: { ...state.rotateConfig, ...config },
        })),

      protectConfig: {
        password: "",
        confirmPassword: "",
      },
      setProtectConfig: (config) =>
        set((state) => ({
          protectConfig: { ...state.protectConfig, ...config },
        })),

      metadataConfig: {
        title: "",
        author: "",
        subject: "",
        keywords: "",
      },
      setMetadataConfig: (config) =>
        set((state) => ({
          metadataConfig: { ...state.metadataConfig, ...config },
        })),

      // Jobs
      currentJob: {
        status: "idle",
        progress: 0,
        message: "",
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
        error: null,
      },
      setJobState: (partialState) =>
        set((state) => ({
          currentJob: { ...state.currentJob, ...partialState },
        })),
      resetJob: () => {
        const { currentJob } = get();
        if (currentJob.resultUrl) URL.revokeObjectURL(currentJob.resultUrl);
        set({
          currentJob: {
            status: "idle",
            progress: 0,
            message: "",
            resultBlob: null,
            resultUrl: null,
            resultFilename: null,
            error: null,
          },
        });
      },

      // Favorites
      favorites: ["translate-pdf", "merge-pdf", "split-pdf", "page-numbers"],
      toggleFavorite: (slug) =>
        set((state) => {
          const exists = state.favorites.includes(slug);
          return {
            favorites: exists
              ? state.favorites.filter((s) => s !== slug)
              : [...state.favorites, slug],
          };
        }),
      isFavorite: (slug) => get().favorites.includes(slug),

      // Recent
      recentTools: ["translate-pdf", "merge-pdf"],
      addRecentTool: (slug) =>
        set((state) => {
          const filtered = state.recentTools.filter((s) => s !== slug);
          return { recentTools: [slug, ...filtered].slice(0, 10) };
        }),

      // Settings
      settings: {
        azureApiKey: "",
        azureRegion: "southeastasia",
        azureEndpoint: "",
        googleCloudApiKey: "",
        geminiApiKey: "",
        autoCleanFiles: true,
        highQualityRender: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Language Localization
      language: "vi",
      setLanguage: (lang) => set({ language: lang }),

      // Policy / Terms / Contact Modal State
      policyModal: {
        isOpen: false,
        tab: "terms",
      },
      openPolicyModal: (tab = "terms") =>
        set({ policyModal: { isOpen: true, tab } }),
      closePolicyModal: () =>
        set((state) => ({ policyModal: { ...state.policyModal, isOpen: false } })),
    }),
    {
      name: "hipdf-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        recentTools: state.recentTools,
        settings: state.settings,
        leftSidebarCollapsed: state.leftSidebarCollapsed,
        language: state.language,
      }),
    }
  )
);
