// Import types and utilities
import type { Message } from './types.js';
import { normalizeWebsiteName } from './utils.js';

document.addEventListener('DOMContentLoaded', function(): void {
    console.log('Trackr extension loaded');

    // Tab switching functionality
    const tabBtns = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
    const tabContents = document.querySelectorAll<HTMLElement>('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function(): void {
            const targetTab = this.getAttribute('data-tab');
            if (!targetTab) return;

            // Remove active class from all tabs and buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetElement = document.getElementById(targetTab);
            if (targetElement) {
                targetElement.classList.add('active');
            }

            // Load tracked sites when switching to tracking tab
            if (targetTab === 'tracking') {
                loadTrackedSites();
            }
        });
    });

    // Tracking functionality
    const form = document.getElementById('trackingForm') as HTMLFormElement;
    const websiteInput = document.getElementById('websiteName') as HTMLInputElement;
    const validationMessage = document.getElementById('validation-message');
    const successMessage = document.getElementById('success-message');
    const sitesList = document.getElementById('sitesList');

    // Load existing tracked sites on page load
    loadTrackedSites();

    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e: Event): void {
            e.preventDefault();

            const websiteName = websiteInput.value.trim();

            if (validateWebsiteName(websiteName)) {
                addWebsiteToStorage(websiteName);
            }
        });
    }

    // Website name validation function
    function validateWebsiteName(input: string): boolean {
        // Clear previous messages
        hideMessage(validationMessage);
        hideMessage(successMessage);

        if (!input) {
            showMessage(validationMessage, 'Please enter a website name or URL.');
            return false;
        }

        // Regex patterns for validation
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        const domainPattern = /^([\da-z\.-]+)\.([a-z\.]{2,6})$/i;

        // Check if it's a valid URL or domain
        if (!urlPattern.test(input) && !domainPattern.test(input)) {
            showMessage(validationMessage, 'Please enter a valid website URL or domain name (e.g., example.com or https://example.com).');
            return false;
        }

        return true;
    }

    // Add website to browser storage
    function addWebsiteToStorage(websiteName: string): void {
        // Normalize the website name (remove protocol, www, trailing slash)
        const normalizedName = normalizeWebsiteName(websiteName);

        // Get existing tracked sites
        browser.storage.local.get(['trackedSites']).then(function(result): void {
            let trackedSites: string[] = result.trackedSites || [];

            // Check if site is already tracked
            if (trackedSites.includes(normalizedName)) {
                showMessage(validationMessage, 'This website is already being tracked.');
                return;
            }

            // Add new site
            trackedSites.push(normalizedName);

            // Save to storage
            browser.storage.local.set({ trackedSites: trackedSites }).then(function(): void {
                showMessage(successMessage, 'Website added successfully!');
                websiteInput.value = '';
                loadTrackedSites(); // Refresh the list

                // Notify background script that a new website was added
                browser.runtime.sendMessage({
                    action: 'websiteAdded',
                    website: normalizedName
                } as Message).then((response: any) => {
                    console.log('Background script notified of new website:', response);
                }).catch((error: Error) => {
                    console.error('Error notifying background script:', error);
                });

                // Hide success message after 3 seconds
                setTimeout(() => hideMessage(successMessage), 3000);
            });
        }).catch(function(error: Error): void {
            console.error('Error saving to storage:', error);
            showMessage(validationMessage, 'Error saving website. Please try again.');
        });
    }


    // Load and display tracked sites
    function loadTrackedSites(): void {
        if (!sitesList) return;

        browser.storage.local.get(['trackedSites']).then(function(result): void {
            const trackedSites: string[] = result.trackedSites || [];
            displayTrackedSites(trackedSites);
        }).catch(function(error: Error): void {
            console.error('Error loading tracked sites:', error);
        });
    }

    // Display tracked sites in the list
    function displayTrackedSites(sites: string[]): void {
        if (!sitesList) return;

        sitesList.innerHTML = '';

        if (sites.length === 0) {
            sitesList.innerHTML = '<p style="color: #666; font-style: italic; font-size: 12px;">No websites tracked yet.</p>';
            return;
        }

        sites.forEach(function(site: string, index: number): void {
            const siteItem = document.createElement('div');
            siteItem.className = 'site-item';

            siteItem.innerHTML = `
                <span class="site-name">${site}</span>
                <button class="remove-btn" data-index="${index}">×</button>
            `;

            sitesList!.appendChild(siteItem);
        });

        // Add event listeners for remove buttons
        const removeButtons = sitesList.querySelectorAll<HTMLButtonElement>('.remove-btn');
        removeButtons.forEach(function(button: HTMLButtonElement): void {
            button.addEventListener('click', function(): void {
                const indexStr = this.getAttribute('data-index');
                if (indexStr !== null) {
                    const index = parseInt(indexStr);
                    removeWebsiteFromStorage(index);
                }
            });
        });
    }

    // Remove website from storage
    function removeWebsiteFromStorage(index: number): void {
        browser.storage.local.get(['trackedSites']).then(function(result): void {
            let trackedSites: string[] = result.trackedSites || [];

            if (index >= 0 && index < trackedSites.length) {
                trackedSites.splice(index, 1);

                browser.storage.local.set({ trackedSites: trackedSites }).then(function(): void {
                    loadTrackedSites(); // Refresh the list
                });
            }
        }).catch(function(error: Error): void {
            console.error('Error removing website from storage:', error);
        });
    }

    // Utility functions
    function showMessage(element: HTMLElement | null, message: string): void {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideMessage(element: HTMLElement | null): void {
        if (element) {
            element.style.display = 'none';
        }
    }
});