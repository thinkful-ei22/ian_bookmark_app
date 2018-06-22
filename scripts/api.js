'use strict';

const api = (function(){
    const BASE_URL = "https://thinkful-list-api.herokuapp.com/ian/bookmarks";

    const getBookmarks = function(callback){
        $.getJSON(BASE_URL, callback);
    };

    const createBookmark = function(title, bmURL, description, rating, callback){
        let newData = JSON.stringify({ title: title, url: bmURL, desc: description,
        rating: rating});
        $.ajax({
            url: BASE_URL,
            method: 'POST',
            contentType: 'application/json',
            data: newData,
            success: callback
        });
    };

    const updateBookmark = function(id, updateData, callback){
        $.ajax({
            url: `${BASE_URL}/${id}`,
            method: 'PATCH',
            contentType: 'application',
            data: JSON.stringify(updateData),
            success: callback
        });
    };

    const deleteBookmark = function(id, callback){
        $.ajax({
            url: `${BASE_URL}/${id}`,
            method: 'DELETE',
            contentType: "application/json",
            success: callback
        })
    }


    return {
        getBookmarks, createBookmark, updateBookmark, deleteBookmark
    }


}())