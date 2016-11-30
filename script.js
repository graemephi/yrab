/*
 * This software is dual-licensed to the public domain and under the following
 * license: you are granted a perpetual, irrevocable license to copy, modify,
 * publish, and distribute this file as you see fit.
 */

"use strict";

function isRecommendedVideo(video) {
    if (video.tagName === "LI") {
        let viewCount = video.querySelector("span.stat.view-count");
        return viewCount && /Recommended for you/.test(viewCount.innerHTML);
    }
}

function removeRecommendedVideos(parent) {
    let videos = parent.children;
    var atleastOneVideoRemoved = false;

    for (var i = 0; i < videos.length; i++) {
        if (isRecommendedVideo(videos[i])) {
          videos[i].style.display = "none";
          atleastOneVideoRemoved = true;
        }
    }

    return atleastOneVideoRemoved;
}

var throttle = false;
new MutationObserver((mutations) => {
    if (!throttle) {
        let sidebar = document.getElementById("watch-related");

        if (sidebar) {
            throttle = removeRecommendedVideos(sidebar);

            if (throttle) {
                requestAnimationFrame(() => throttle = false);
            }
        }
    }
}).observe(document, { childList: true , subtree: true });