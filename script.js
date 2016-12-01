/*
 * This software is dual-licensed to the public domain and under the following
 * license: you are granted a perpetual, irrevocable license to copy, modify,
 * publish, and distribute this file as you see fit.
 */

 (function() {
"use strict";

function isRecommendedVideo(video, selector) {
    let viewCount = video.querySelector(selector);
    return viewCount && /Recommended for you/.test(viewCount.innerHTML);
}

function removeRecommendedVideos(parent, isPolymer) {
    let videos = parent.children;
    let selector = isPolymer ? "span.style-scope.ytd-video-meta-block" : "span.stat.view-count"
    var atleastOneVideoRemoved = false;

    for (var i = 0; i < videos.length; i++) {
        if (isRecommendedVideo(videos[i], selector)) {
          videos[i].style.display = "none";
          atleastOneVideoRemoved = true;
        }
    }

    return atleastOneVideoRemoved;
}

function getSidebar() {
    let sidebar = document.getElementById("watch-related");

    if (sidebar) {
        return { element: sidebar, isPolymer: false };
    }

    let newSidebar = document.getElementById("items");

    if (newSidebar) {
        return { element: newSidebar, isPolymer: true };
    }

    return null;
}

var throttle = false;
new MutationObserver((mutations) => {
    if (!throttle) {
        let sidebar = getSidebar();

        if (sidebar) {
            throttle = removeRecommendedVideos(sidebar.element, sidebar.isPolymer);

            if (throttle) {
                requestAnimationFrame(() => throttle = false);
            }
        }
    }
}).observe(document, { childList: true , subtree: true });

})();