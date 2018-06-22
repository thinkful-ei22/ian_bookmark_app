'use strict';
/* global bookmarkList */

$(document).ready(function(){
    bookmarkList.bindEventListeners();
    bookmarkList.render();
    api.getBookmarks((responseItems) => {
        responseItems.forEach((responseItem) => store.addBookmark(responseItem));
        bookmarkList.render();
    });
});