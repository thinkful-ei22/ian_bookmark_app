'use strict';

const store = (function(){
    const bookmarks = [];
    const addingView = false;


    const addBookmark = function(bookmark) {
        bookmark.showDetail = false;
        this.bookmarks.push(bookmark);
        console.log(this.bookmarks);
        };

    const findById = function(id) {
        return this.bookmarks.find(bookmark => bookmark.id === id);
        };

    const findAndUpdate = function(id, newData){
        let bookmark = this.findById(id)
        console.log(bookmark);
        let newbookmark = Object.assign(bookmark, newData);
        item = newbookmark;
    }

    const findAndDelete = function(id) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
        };
        
    const toggleAddingView = function() {
        this.addingView = !this.addingView;
        };
    
    return {
        bookmarks, addingView, addBookmark, findById, findAndUpdate, findAndDelete,
        toggleAddingView
    }

}());