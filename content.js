let problemListKey = "algozenith_problems";
newBookmark = window.location.href;

window.addEventListener("load", () => {
  addBookmarkButton();
});

function addBookmarkButton() {
  const bookmarkBtn = document.createElement("img");
  bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
  bookmarkBtn.className = "btn_ref";
  bookmarkBtn.title = "Click to bookmark current timestamp";
  bookmarkBtn.style.height = "30px";
  bookmarkBtn.style.width = "30px";
  // bookmarkBtn.style.cursor = pointer;
  azAskDoubt = document.getElementsByClassName("btn btn_ref text_white ml-1")[0]
    .parentElement.parentElement;
  azAskDoubt.appendChild(bookmarkBtn);

  bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
}
const addNewBookmarkEventHandler = async () => {
  currentProblemBookmarks = await fetchBookmarks();
  problemName =
    document.getElementsByClassName("col-8 my-auto")[0].lastChild.textContent;
  const newBookmarkObj = {
    url: newBookmark,
    desc: problemName,
  };
  let addNewToBookmark = true;
  for (let i = 0; i < currentProblemBookmarks.length; i++) {
    if (currentProblemBookmarks[i].url == newBookmark) {
      addNewToBookmark = false;
    }
  }
//   console.log(newBookmark);
  if (addNewToBookmark) {
    // if the condition addNewToBookmark is true, the code
    //will add a new bookmark object (newBookmarkObj) to the existing array of problem bookmarks (currentProblemBookmarks).
    // It will then convert the updated array to a JSON string and store it using the chrome.storage.sync.set method.
    chrome.storage.sync.set({
      [problemListKey]: JSON.stringify([
        ...currentProblemBookmarks,
        newBookmarkObj,
      ]),
    });
  }
};
/*chrome.storage.sync.set({: This line calls the set method of the chrome.storage.sync object, 
    which is used to store data synchronously in the user's browser. The sync storage area is used here,
    which means the data will be synced across multiple devices if the user is signed in with Chrome sync.*/
const fetchBookmarks = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([problemListKey], (obj) => {
      resolve(obj[problemListKey] ? JSON.parse(obj[problemListKey]) : []);
    });
  });
};
/*
return new Promise((resolve) => {: This line creates a new Promise object. A Promise is used for asynchronous operations and represents a value that may be available now, in the future, or never.
chrome.storage.sync.get([problemListKey], (obj) => {: This line calls the get method of the chrome.storage.sync object to retrieve the value associated with the problemListKey from the storage.
 The second argument is a callback function that will be executed when the retrieval is complete. The retrieved value will be passed to this callback as the obj parameter.
resolve(obj[problemListKey] ? JSON.parse(obj[problemListKey]) : []);: This line uses the resolve function to fulfill the Promise.
 It checks if the retrieved value exists (obj[problemListKey] is truthy), and if so, it parses the JSON string value using JSON.parse and resolves the Promise with the parsed array.
 If the retrieved value does not exist or cannot be parsed, it resolves the Promise with an empty array ([]).
*/
