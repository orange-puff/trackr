// Background script for managing intervals
console.log('Background script loaded');

// Store active intervals to prevent duplicates
let activeIntervals = new Map();

// Utility function to normalize website names using URL object
function normalizeWebsiteName(input) {
    try {
        // Add protocol if missing for URL parsing
        let urlString = input;
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
            urlString = 'https://' + input;
        }

        const url = new URL(urlString);
        return url.hostname.replace(/^www\./, '').toLowerCase();
    } catch (e) {
        // Fallback to regex-based approach for invalid URLs
        return input
            .toLowerCase()
            .replace(/^https?:\/\//, '') // Remove protocol
            .replace(/^www\./, '')       // Remove www
            .replace(/\/$/, '');         // Remove trailing slash
    }
}

// Function to check if a URL matches a tracked website
function matchesTrackedWebsite(url, trackedSites) {
    if (!url || !trackedSites) return null;

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace(/^www\./, '').toLowerCase();

        for (const site of trackedSites) {
            const normalizedSite = site.toLowerCase();
            if (hostname === normalizedSite || hostname.endsWith('.' + normalizedSite)) {
                return site;
            }
        }
    } catch (e) {
        // Fallback to original logic if URL parsing fails
        const normalizedUrl = normalizeWebsiteName(url);
        for (const site of trackedSites) {
            if (normalizedUrl.includes(site) || site.includes(normalizedUrl.split('/')[0])) {
                return site;
            }
        }
    }

    return null;
}

// Function to create interval for a specific site
function createIntervalForSite(site, tabId) {
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
    }, 5000); // 5 seconds = 5000 milliseconds

    // Store the interval
    activeIntervals.set(site, intervalId);

    console.log(`Interval created for ${site}`);
}

// Function to check existing tabs when a new website is added to tracking
function checkExistingTabsForSite(site) {
    browser.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
            if (tab.url && matchesTrackedWebsite(tab.url, [site])) {
                console.log(`Found existing tab for ${site}: ${tab.url}`);
                createIntervalForSite(site, tab.id);
            }
        });
    }).catch((error) => {
        console.error('Error querying tabs:', error);
    });
}

// Listen for messages from popup and content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);

    if (message.action === 'websiteAdded') {
        // When a website is added to tracking, check existing tabs
        const site = message.website;
        console.log(`Website added to tracking: ${site}`);
        checkExistingTabsForSite(site);
        sendResponse({ status: 'success' });

    }
});

// Listen for tab updates to handle navigation within tabs
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only process when the tab has finished loading and URL is available
    if (changeInfo.status === 'complete' && tab.url) {
        console.log(`Tab ${tabId} updated to: ${tab.url}`);

        // Get tracked sites and check if this tab should have an interval
        browser.storage.local.get(['trackedSites']).then((result) => {
            const trackedSites = result.trackedSites || [];
            const matchedSite = matchesTrackedWebsite(tab.url, trackedSites);

            if (matchedSite) {
                console.log(`Tab navigation to tracked site: ${matchedSite}`);
                createIntervalForSite(matchedSite, tabId);
            }
        }).catch((error) => {
            console.error('Error checking tracked sites on tab update:', error);
        });
    }
});

// Clean up intervals when tabs are closed
browser.tabs.onRemoved.addListener((tabId) => {
    console.log(`Tab ${tabId} closed`);

    // Get tracked sites and check if any intervals should be cleared
    browser.storage.local.get(['trackedSites']).then((result) => {
        const trackedSites = result.trackedSites || [];

        // Check each tracked site to see if it still has active tabs
        for (const site of trackedSites) {
            if (activeIntervals.has(site)) {
                browser.tabs.query({}).then((tabs) => {
                    const activeTabs = tabs.filter(tab => tab.url && matchesTrackedWebsite(tab.url, [site]));

                    if (activeTabs.length === 0) {
                        // No more tabs for this site, clear the interval
                        console.log(`No active tabs for ${site}, clearing interval`);
                        clearInterval(activeIntervals.get(site));
                        activeIntervals.delete(site);
                    }
                }).catch((error) => {
                    console.error(`Error querying tabs for ${site}:`, error);
                });
            }
        }
    }).catch((error) => {
        console.error('Error getting tracked sites:', error);
    });
});

console.log('Background script initialization complete');