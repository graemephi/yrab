/*
 * This software is dual-licensed to the public domain and under the following
 * license: you are granted a perpetual, irrevocable license to copy, modify,
 * publish, and distribute this file as you see fit.
 */

 /*
  * 1.2: Fix hiding the up next video in the polymer design, even if it's recommended.
  *      Fix an issue that caused videos loaded from the 'load more' button to not be
  *      hidden, or even hide the whole extra videos div
  *
  * 1.1: Fix missing recs when watching a playlist.
  * 1.0: Initial release.
  */

"use strict";

const VideoSelector_Classic = ":scope li.video-list-item";

const RecommendedSelector_Polymer = "ytd-compact-video-renderer #metadata-line span.style-scope.ytd-video-meta-block";
const RecommendedSelector_Classic = ":scope span.stat.view-count";

let sidebar = null;

function isRecommendedVideo(video, selector) {
    let viewCount = video.querySelector(selector);
    return viewCount && (viewCount.innerHTML.indexOf("Recommended for you") >= 0);
}

function removeRecommendedVideos(parent, isPolymer) {
    let videos = null;
    let selector = null;

    if (isPolymer) {
        videos = parent.children;
        selector = RecommendedSelector_Polymer;
    } else {
        videos = parent.querySelectorAll(VideoSelector_Classic);
        selector = RecommendedSelector_Classic;
    }

    let atleastOneVideoRemoved = false;
    for (let i = 0; i < videos.length; i++) {
        let video = videos[i];
        if (isRecommendedVideo(video, selector)) {
            video.style.display = "none";
            atleastOneVideoRemoved = true;
        }
    }

    return atleastOneVideoRemoved;
}

function getSidebar() {
    let newSidebar = document.querySelector("#items.ytd-watch-next-secondary-results-renderer");

    if (newSidebar) {
        return { element: newSidebar, isPolymer: true };
    }

    let oldSidebar = document.getElementById("watch-related");

    if (oldSidebar) {
        return { element: oldSidebar, isPolymer: false };
    }

    return null;
}

let throttle = false;
new MutationObserver((mutations) => {
    if (!throttle) {
        sidebar = sidebar || getSidebar();

        if (sidebar) {
            throttle = removeRecommendedVideos(sidebar.element, sidebar.isPolymer);

            if (throttle) {
                requestAnimationFrame(() => {
                    throttle = false;
                    sidebar = null;
                });
            }
        }
    }
}).observe(document, { childList: true, subtree: true });