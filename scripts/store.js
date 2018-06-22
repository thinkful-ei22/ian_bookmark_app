'use strict';

const store = (function(){
    const bookmarks = [];
    const addingView = false;
    const filterByRating = 1;


    const addBookmark = function(bookmark) {
        bookmark.showDetail = false;
        this.bookmarks.push(bookmark);
        };

    const findById = function(id) {
        return this.bookmarks.find(bookmark => bookmark.id === id);
        };

    const findAndUpdate = function(id, newbookmark){
        let bookmark = this.findById(id);
        bookmark = newbookmark;
        bookmark.showDetail = false;
    }

    const findAndDelete = function(id) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
        };
        
    const toggleAddingView = function() {
        this.addingView = !this.addingView;
        };
    
    return {
        bookmarks, addingView, addBookmark, findById, findAndUpdate, findAndDelete,
        toggleAddingView, filterByRating
    }

}());