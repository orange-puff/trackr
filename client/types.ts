// Common types for the browser extension

export interface WebExtensionAPI {
  storage: {
    local: {
      get: (keys?: string | string[] | null) => Promise<{ [key: string]: any }>;
      set: (items: { [key: string]: any }) => Promise<void>;
    };
  };
  runtime: {
    onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void) => void;
    };
    sendMessage: (message: any) => Promise<any>;
  };
  tabs: {
    query: (queryInfo: { [key: string]: any }) => Promise<Tab[]>;
    onUpdated: {
      addListener: (callback: (tabId: number, changeInfo: { [key: string]: any }, tab: Tab) => void) => void;
    };
    onRemoved: {
      addListener: (callback: (tabId: number) => void) => void;
    };
  };
}

export interface Tab {
  id: number;
  url?: string;
  [key: string]: any;
}

export interface Message {
  action: string;
  website?: string;
}

// Global browser API declaration
declare global {
  var browser: WebExtensionAPI;
}