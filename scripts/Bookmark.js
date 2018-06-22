'use strict';

const Bookmark = (function(){
    const create = function(title, url, rating, description) {
        return {
          title: title,
          bmURL: url,
          rating: rating,
          desc: description,
          showDetail: false
        };
      };

    return {
        create
    }

}())