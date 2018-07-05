var results = $("#results")
var xhr;
var newUrl;
var infiniteScroll = location.search.indexOf('scroll=infinite') > -1;

$("#go").on("click", () => {
    spotifySearch();
})

$(document).on('keydown', e => {
    if (e.keyCode === 13) {
        spotifySearch();
        e.preventDefault();
    }
});

function spotifySearch() {
    if (xhr) {
        xhr.abort();
    }
    xhr = $.ajax({
        url: 'https://elegant-croissant.glitch.me/spotify',
        data: {
            q: $("input").val(),
            type: $('select').val()
        },
        success: function (data) {
            xhr = null;
            data = data.artists || data.albums;
            var myResults = ''
            for (var i = 0; i < data.items.length; i++) {
                myResults += '<div class="result">';
                myResults += '<a href="' + data.items[i].external_urls.spotify + '">';
                if (data.items[i].images[0]) {
                    myResults += '<img src="' + data.items[i].images[0].url + '">'
                } else {
                    myResults += '<img src="default.jpg">'
                }
                // myResults += data.items[i].name;
                myResults += '</a></div>';
            }
            if (data.next) {
                if (infiniteScroll) {
                    setTimeout(checkScrollPos, 333);
                } else {
                    myResults += '<button id="more">More</button>'
                }
                newUrl = data.next.replace('api.spotify.com/v1/search', 'elegant-croissant.glitch.me/spotify');
            }

            if (data.items.length == 0) {
                results.html("No Results")
            } else {
                results.html(myResults);
            }

            if (data.next) {
                console.log(data.next)
                $(document).on("click", "#more", function() {
                    $("#more").hide();
                    getMore();
                })
            }
        }
    });
}

function getMore() {
    console.log("getMore is running!")
    if (xhr) {
        xhr.abort();
    }
    console.log(newUrl);
    xhr = $.ajax({
        url: newUrl,
        success: function (data) {
            xhr = null;
            data = data.artists || data.albums;
            var myResults = ''
            for (var i = 0; i < data.items.length; i++) {
                myResults += '<div class="result">';
                myResults += '<a href="' + data.items[i].external_urls.spotify + '">';
                if (data.items[i].images[0]) {
                    myResults += '<img src="' + data.items[i].images[0].url + '">'
                } else {
                    myResults += '<img src="default.jpg">'
                }
                // myResults += data.items[i].name;
                myResults += '</a></div>';
            }
            if (data.next) {
                console.log("theres more to the more!")
                console.log(data.next)
                newUrl = data.next.replace('api.spotify.com/v1/search', 'elegant-croissant.glitch.me/spotify');

                if (infiniteScroll) {
                    checkScrollPos();
                } else {
                    myResults += '<button id="more">More</button>'
                }


            }
            results.append(myResults);
        }
    })
}

function checkScrollPos() {
    console.log("infinite scroll on: check scroll position is runnin!")
    if ($(document).height() == $(document).scrollTop() + $(window).height()) { //scroll reached the bottom
        console.log ("bottom of the window: get more!")
        getMore();
    } else {
        setTimeout(checkScrollPos, 1000)
    }
}
