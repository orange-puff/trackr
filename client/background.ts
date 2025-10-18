// Background script for managing intervals
import type { Tab, Message } from './types.js';
import { normalizeWebsiteName, matchesTrackedWebsite } from './utils.js';

console.log('Background script loaded');

// Store active intervals to prevent duplicates
const activeIntervals = new Map<string, number>();

// Function to create interval for a specific site
function createIntervalForSite(site: string, _tabId: number): void {
    // Check if interval already exists for this site
    if (activeIntervals.has(site)) {
        console.log(`Interval already exists for ${site}`);
        return;
    }

    console.log(`Creating interval for ${site}`);

    // Create interval that runs every 5 seconds (5000ms)
    const intervalId = setInterval(() => {
        console.log(`Interval tick for ${site} - ${new Date().toISOString()}`);

        // You can add more specific tracking logic here, such as:
        // - Recording time spent
        // - Checking if user is active
        // - Storing usage data
    }, 5000) as unknown as number; // 5 seconds = 5000 milliseconds

    // Store the interval
    activeIntervals.set(site, intervalId);

    console.log(`Interval created for ${site}`);
}

// Function to check existing tabs when a new website is added to tracking
function checkExistingTabsForSite(site: string): void {
    browser.tabs.query({}).then((tabs: Tab[]) => {
        tabs.forEach((tab) => {
            if (tab.url && matchesTrackedWebsite(tab.url, [site])) {
                console.log(`Found existing tab for ${site}: ${tab.url}`);
                createIntervalForSite(site, tab.id);
            }
        });
    }).catch((error: Error) => {
        console.error('Error querying tabs:', error);
    });
}

// Listen for messages from popup and content scripts
browser.runtime.onMessage.addListener((message: Message, _sender: any, sendResponse: (response?: any) => void) => {
    console.log('Background received message:', message);

    if (message.action === 'websiteAdded') {
        // When a website is added to tracking, check existing tabs
        const site = message.website;
        if (site) {
            console.log(`Website added to tracking: ${site}`);
            checkExistingTabsForSite(site);
        }
        sendResponse({ status: 'success' });
    }
});

// Listen for tab updates to handle navigation within tabs
browser.tabs.onUpdated.addListener((tabId: number, changeInfo: { [key: string]: any }, tab: Tab) => {
    // Only process when the tab has finished loading and URL is available
    if (changeInfo.status === 'complete' && tab.url) {
        console.log(`Tab ${tabId} updated to: ${tab.url}`);

        // Get tracked sites and check if this tab should have an interval
        browser.storage.local.get(['trackedSites']).then((result) => {
            const trackedSites: string[] = result.trackedSites || [];
            const matchedSite = matchesTrackedWebsite(tab.url!, trackedSites);

            if (matchedSite) {
                console.log(`Tab navigation to tracked site: ${matchedSite}`);
                createIntervalForSite(matchedSite, tabId);
            }
        }).catch((error: Error) => {
            console.error('Error checking tracked sites on tab update:', error);
        });
    }
});

// Clean up intervals when tabs are closed
browser.tabs.onRemoved.addListener((tabId: number) => {
    console.log(`Tab ${tabId} closed`);
    // Note: Intervals will automatically clean themselves up when no matching tabs are found
    // during their next execution cycle
});

console.log('Background script initialization complete!');