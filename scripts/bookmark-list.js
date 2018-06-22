'use strict';

/* global store */

const bookmarkList = (function(){

    const addingFormElement = `
        <form class="js-adding form-group">
        <div class="form-group">
        <label for="title">Title</label>
        <input type="title" class="form-control" id="title-input" placeholder="World Cup Highlights">
        </div>
        <div class="form-group radio-rating">
        <label for="rating">Rating: </label>
        <span class="form-check">
            <input class="form-check-input" name="rating" type="radio" id="1star" value="1">
            <label class="form-check-label" for="rating">1 Star *</label>
        </span>
        <span class="form-check">
            <input class="form-check-input" name="rating" type="radio" id="2star" value="2">
            <label class="form-check-label" for="rating">2 Stars * *</label>
        </span>
        <span class="form-check">
            <input class="form-check-input" name="rating" type="radio" id="3star" value="3">
            <label class="form-check-label" for="rating">3 Stars * * *</label>
        </span>
        <span class="form-check">
            <input class="form-check-input" name="rating" type="radio" id="4star" value="4">
            <label class="form-check-label" for="rating">4 Stars * * * *</label>
        </span>
        <span class="form-check">
            <input class="form-check-input" name="rating" type="radio" id="5star" value="5">
            <label class="form-check-label" for="rating">5 Stars * * * * *</label>
        </span>
        </div>
        <div class="form-group">
            <label for="URL">Bookmark URL</label>
            <input type="URL" class="form-control" id="url-input" placeholder="http://www.youtube.com/watchworldcuphighlights.....">
        </div>
        <div class="form-group">
        <label for="desc">Description</label>
        <textarea class="form-control" id="desc" placeholder="this is a great place to watch highlghts..." rows="3"></textarea>
        </div>
        <button class="js-adding btn btn-primary" type="submit">Add this Bookmark</button>
        </form>
    `;

    const generateBookmarkElement = function(bookmark){
        if (bookmark.showDetail === false){
            let stars = [];
            for(let i = 1; i <= bookmark.rating; i++){
                stars.push('<span class="glyphicon glyphicon-star" aria-hidden="true"></span>');
            }
            stars.join("");
            console.log(stars);
            
            return `
            <li class="li-result list-group-item" data-item-id="${bookmark.id}">
            <h3>${bookmark.title}</h3>
            <h4>${stars}</h4>
            <button class="btn btn-primary js-li-result show-details">Show Details</button>
            </li>
          `
        }
        else {
            return `
            <li class="li-result list-group-item" data-item-id="${bookmark.id}">
            <form class="js-edit-item">
                <div class="form-group">
                    <label for="title">Title:</label>
                    <input class="bookmark-title form-control" id="title" type="text" value="${bookmark.title}" />
                </div>
                <div class="form-group">
                    <label for="rating">Rating:</label>
                    <input class="bookmark-rating form-control" id="rating" type="text" value="${bookmark.rating}" />
                </div>
                <div class="form-group">
                    <label for="url">URL:</label>
                    <input class="bookmark-url form-control" id="url" type="text" value="${bookmark.url}" />
                </div>
                <div class="form-group">
                    <label for="desc">Description:</label>
                <input class="bookmark-description form-control" id="desc" type="text" value="${bookmark.desc}" />
                </div>
                <button class="btn btn-primary edit" type="submit">Update Bookmark</button>
                <a class="btn btn-primary js-li-result" href="${bookmark.url} role="button">Go to Website!</a>
                <button class="btn btn-primary js-li-result show-details">Hide Details</button>
                <button class="btn btn-primary js-li-result remove" type="remove">Remove Bookmark</button>
            </form>
            </li>`
        }
    };

    const generateBookmarksString = function(bookmarks){
        const bookmarkElements = bookmarks.map((bookmark) => generateBookmarkElement(bookmark));
        return bookmarkElements.join('');
    }

    const render = function(){
        $('#adding-section').html('');
        let bookmarks = store.bookmarks;
        const bookmarksString = generateBookmarksString(bookmarks);
        $('.js-bookmarks-list').html(bookmarksString);
        if(store.addingView === true){
            $('#adding-section').html(addingFormElement);
        }
    }

    const handleNewBookmarkSubmit = function(){
        $('#adding-section').submit(function(event){
            event.preventDefault();
            const newBookmarkTitle = $('#title-input').val();
            const newBookmarkURL = $('#url-input').val();
            const newBookmarkDescription = $('#desc').val();
            const newBookmarkRating = $("input[type='radio']:checked").val();
            $('#title-input').val('');
            $('#url-input').val('');
            $('#description').val('');
            $('.radio-rating').val('');
            api.createBookmark(newBookmarkTitle, newBookmarkURL,
                newBookmarkDescription, newBookmarkRating, (newBookmark) => {
                    store.addBookmark(newBookmark);
                    render();
                },
                () => {
                    alert('must enter all field correctly!');
                }
            )
        });
    };

    const getBookmarkIdFromElement = function(bookmark){
        return $(bookmark).closest('.list-group-item').data('item-id');
    }

    const handleDeleteBookmarkClicked = function(){
        $('.js-bookmarks-list').on('click', '.remove', (event) => {
            event.preventDefault();
            let id = getBookmarkIdFromElement(event.currentTarget);
            api.deleteBookmark(id, () => {
                store.findAndDelete(id);
                render();
            });
        });
    };

    const handleAddBookmarkToggle = function(){
        $('.add-form').click((event) => {
            event.preventDefault();
            store.addingView = !store.addingView;
            render();
        });
        
    }

    const handleShowDetailToggle = function(){
        $('.list-group').on('click', '.show-details', (event) => {
            event.preventDefault();
            let id = getBookmarkIdFromElement(event.currentTarget);
            let bookmark = store.findById(id);
            bookmark.showDetail = !bookmark.showDetail;
            render();
        })
    }


    const handleEditBookmarkSubmit = function(){
        $('.js-bookmarks-list').on('click','.edit', (event) => {
            event.preventDefault();
            const id = getBookmarkIdFromElement(event.currentTarget);
            const newTitle = $('.bookmark-title').val();
            const newURL = $('.bookmark-url').val();
            const newDescription = $('.bookmark-description').val();
            const newRating = $('.bookmark-rating').val();
            api.updateBookmark(id, { title: newTitle, url: newURL, desc: newDescription,
                rating: newRating}, (() => {
                    api.getBookmarks((updatedBookmarks) => {
                        console.log(updatedBookmarks);
                        //let item = store.findById(id);
                        //$('.bookmark-title').val(item.title);
                        //$('.bookmark-url').val(item.url);
                        //$('.bookmark-description').val(item.desc);
                        //$('.bookmark-rating').val(item.rating);
                        render();
                    })
                    //store.addBookmark(updatedBookmark);
                    //store.findAndUpdate(id, updatedBookmark);
                    
                }),
                () => {
                    alert("must enter all fields correctly!");
                }
            )
            
          })
    };

    //HOW DO YOU GET VALUE OUT OF DROPDOWN?????
    const handleFilterbyRating = function(){
        $('.dropdown-item').click('value', (event) => {
            let filterRating = event.currentTarget.val();
            console.log(filterRating);
        })
    }

    const bindEventListeners = function(){
        handleAddBookmarkToggle();
        handleShowDetailToggle();
        handleEditBookmarkSubmit();
        handleFilterbyRating();
        handleNewBookmarkSubmit();
        handleDeleteBookmarkClicked();
    }



    return {
        generateBookmarkElement, generateBookmarksString, render, bindEventListeners
    }

}());