// Shared utility functions

/**
 * Normalize website name using URL object
 * Removes protocol, www prefix, and trailing slash
 */
export function normalizeWebsiteName(input: string): string {
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

/**
 * Check if a URL matches any of the tracked websites
 */
export function matchesTrackedWebsite(url: string, trackedSites: string[]): string | null {
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