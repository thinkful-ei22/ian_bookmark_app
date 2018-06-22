'use strict';

/* global store */

const bookmarkList = (function(){

    const addingFormElement = `
        <form class="js-adding">
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
        <button class="js-adding" type="submit">Add this Bookmark</button>
        </form>
    `;

    const generateBookmarkElement = function(bookmark){
        if (bookmark.showDetail === false){
            return `
            <li class="li-result list-group-item" data-item-id="${bookmark.id}">
            <h3>${bookmark.title}  ${bookmark.rating}</h3>
            <button class="btn btn-primary js-li-result show-details">Show Details</button>
            </li>
          `
        }
        else {
            return `
            <li class="li-result list-group-item" data-item-id="${bookmark.id}">
                <h3>${bookmark.title}</h3>
                <p class="rating">${bookmark.rating}</p>
                <p class="li-description">${bookmark.desc}</p>
                <a class="btn btn-primary js-li-result" href="${bookmark.url} role="button">Go to Website!</a>
                <button class="btn btn-primary js-li-result show-details">Hide Details</button>
                <button class="btn btn-primary js-li-result remove" type="remove">Remove Bookmark</button>
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
        console.log("render ran");
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
            console.log(newBookmarkRating);

            console.log(newBookmarkTitle);
            console.log(newBookmarkURL);
            console.log(newBookmarkDescription);
            $('#title-input').val('');
            $('#url-input').val('');
            $('#description').val('');
            $('.radio-rating').val('');
            api.createBookmark(newBookmarkTitle, newBookmarkURL,
                newBookmarkDescription, 5, (newBookmark) => {
                    store.addBookmark(newBookmark);
                    console.log(store.bookmarks);
                    render();
                });
        });
    };

    const getBookmarkIdFromElement = function(bookmark){
        return $(bookmark).closest('.list-group-item').data('item-id');
    }

    const handleDeleteBookmarkClicked = function(){
        $('.js-bookmarks-list').on('click', '.remove', (event) => {
            let id = getBookmarkIdFromElement(event.currentTarget);
            api.deleteBookmark(id, () => {
                store.findAndDelete(id);
                render();
            });
        });
    };

    const handleAddBookmarkToggle = function(){
        $('.add-form').click(() => {
            store.addingView = !store.addingView;
            render();
            console.log(store.addingView);
        });
        
    }

    const handleShowDetailToggle = function(){
        $('.list-group').on('click', '.show-details', (event) => {
            let id = getBookmarkIdFromElement(event.currentTarget);
            let bookmark = store.findById(id);
            bookmark.showDetail = !bookmark.showDetail;
            render();
        })
    }

    const bindEventListeners = function(){
        handleAddBookmarkToggle();
        handleShowDetailToggle();
        handleNewBookmarkSubmit();
        handleDeleteBookmarkClicked();
    }



    return {
        generateBookmarkElement, generateBookmarksString, render, bindEventListeners
    }

}());