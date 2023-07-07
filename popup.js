let problemListKey = 'algozenith_problems';

document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.sync.get([problemListKey], (data) => {
        const currentBookmarks = data[problemListKey] ? JSON.parse(data[problemListKey]) : [];
        viewBookmarks(currentBookmarks);
    });
});
/*
Inside the event listener, the chrome.storage.sync.get([problemListKey], (data) => { ... }); 
code retrieves the value associated with the problemListKey from the chrome.storage.sync storage.
*/
const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");//add bookmarks to the div bookmarks of popup.html
    bookmarksElement.innerHTML = "";

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
    return;
};
const addNewBookmark = (bookmarks, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");//name of bookmark 
    const controlsElement = document.createElement("div");// contians play ands delete button 
    const newBookmarkElement = document.createElement("div");//parent div which contains the above two divs 

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.id = "bookmark-" + bookmark.url.toString().split("-").at(-1);//splits the url into an array  and accesses the lasr element of the array which os then concatenated with bookmark-
    newBookmarkElement.className = "bookmark";// each new bookmark has a classname 
    newBookmarkElement.setAttribute("url", bookmark.url);//each bookmark element has its own url attribute 

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);

    bookmarks.appendChild(newBookmarkElement);// bookmarks is the parent of newBookmarkElement
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");// play button inside control element div 
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

const onPlay = async e => {
    const bookmarUrl = e.target.parentNode.parentNode.getAttribute("url");
    window.open(bookmarUrl, "_blank");
};

const onDelete = async e => {
    const bookmarkUrl = e.target.parentNode.parentNode.getAttribute("url");
    console.log(bookmarkUrl);
    const bookmarkElementToDelete = document.getElementById(
        "bookmark-" + bookmarkUrl.toString().split("-").at(-1)
    );
    console.log(bookmarkElementToDelete);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    await removeFromMemory(bookmarkUrl);
};
async function removeFromMemory(urlToDelete) {
    let bookmarkData = []
    chrome.storage.sync.get([problemListKey], (data) => {
        bookmarkData = data[problemListKey] ? JSON.parse(data[problemListKey]) : [];

        let foundIndex = -1;
        for (let index = 0; index < bookmarkData.length; index++) {
            if (bookmarkData[index].url == urlToDelete) {
                foundIndex = index; break;
            }
        }

        if (foundIndex > -1) {
            bookmarkData.splice(foundIndex, 1);
            chrome.storage.sync.set({
                [problemListKey]: JSON.stringify(bookmarkData)
            });
        }
    });
}
