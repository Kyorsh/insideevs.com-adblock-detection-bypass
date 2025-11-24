// ==UserScript==
// @name         InsideEVs Anti-Adblock Popup Remover (Admiral)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remove the Admiral adblock popup on insideevs.com
// @match        https://insideevs.com/*
// @match        https://www.insideevs.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Block Admiral scripts BEFORE they execute
    const blockedPatterns = [
        "getadmiral.com",
        "admiral-loader",
        "admiral"
    ];

    const origCreateElement = document.createElement;
    document.createElement = function(tag) {
        const el = origCreateElement.call(this, tag);

        if (tag === "script") {
            Object.defineProperty(el, "src", {
                set: function(value) {
                    if (blockedPatterns.some(b => value.includes(b))) {
                        console.warn("Blocked Admiral script:", value);
                        return; // block loading
                    }
                    el.setAttribute("src", value);
                }
            });
        }
        return el;
    };

    // Remove the popup DOM elements
    function removePopup() {
        const selectors = [
            'div.fEy1Z2XT',          // main overlay container
            'div[class*="fEy1Z"]',   // obfuscated variants
            'img[src*="getadmiral"]',// Admiral popup images
            'button[class*="_2Sbg_-vS"]' // popup button
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                console.log("Removing InsideEVs adblock popup:", el);
                el.remove();
            });
        });

        // Remove body scroll lock if they apply it
        document.body.style.overflow = "auto";
    }

    // Initial removal
    document.addEventListener("DOMContentLoaded", removePopup);

    // Continuous removal (Admiral re-inserts aggressively)
    const observer = new MutationObserver(removePopup);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();