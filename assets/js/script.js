let SearchTerms;
let SongID;
let ResultsSection = document.getElementById('results');
let BackButton = document.getElementById('back-button');
let api_Key = "AIzaSyCdEPu6GK83lhXpfTuFAJtGyAdH0C23r-M";
let display= "";


//runs when the user clicks on the search button
function checkRadio() {
    SearchTerms = document.getElementById("search").value;

    if ($("#ArtistRadioButton").is(":checked")) {
        getArtist();
    }
    else {
        getSong();
    }
}

//resets the page when results are displayed.
function resetPage() {
    ResultsSection.innerHTML = "";
    BackButton.innerHTML = "";
}

//if 'song' radio button is selected
function getSong() {
    resetPage();
    $.ajax({type: "GET",
            data: {
                apikey: "d246a1705459f6af7bcc9ca194674583",
                q_track: SearchTerms, //searches by song name
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50, //returns the top 50 results
                s_artist_rating: "DESC", //sorts by popularity of tracks in descending order

            },
            url: "https://api.musixmatch.com/ws/1.1/track.search",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                let songResults = data.message.body.track_list;
                console.log(data);
                ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Songs</th>
                                                  <th>Artists</th>
                                                  <th>Lyrics</th>
                                                </tr>
                                             </thead>`;
                songResults.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.track.track_name}</td>
                                                        <td>${item.track.artist_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getLyrics(${item.track.track_id},'getSong','${item.track.artist_name}','${item.track.track_name}')">Click here for lyrics/Youtube</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (songResults.length === 0) {
                    resetPage(); //clears the table header above
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>Problem has occurred</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>No results found</td>
                                                    </tr>
                                                </tbody>`;
                }
                
            },
        }
    );


        
}

//If 'artist' radio button is selected:
function getArtist() {
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "d246a1705459f6af7bcc9ca194674583",
                q_artist: SearchTerms, //queries by artist name
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50, //returns the top 50 results
                s_artist_rating: "DESC", //sorted by popularity of artist

            },

            url: "https://api.musixmatch.com/ws/1.1/artist.search",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                let artistResults = data.message.body.artist_list;
                console.log(data);
                ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Artist Name</th>
                                                  <th>Albums</th>
                                                </tr>
                                             </thead>`;
                artistResults.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                        <tr>
                                                        <td>${item.artist.artist_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getAlbumList(${item.artist.artist_id},'${item.artist.artist_name}')">Click here for a list of albums</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;

                });
                if (artistResults.length === 0) {
                    resetPage(); //necessary to clear the table header already printed above.
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>A problem has occurred</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>no results were found</td>
                                                    </tr>
                                                </tbody>`;
                }

            },

        }

    );
    
}

//gets lyrics when song is selected
function getLyrics(SongID, goBack, artist_name, track_name) {
    let youSearch = (artist_name + track_name );
    videoSearch(youSearch,1)
    resetPage();
    let songName;

    function createBackButton() {
        if (goBack == 'getSong') {
            BackButton.innerHTML += '<button class="btn-srch" onclick="getSong()">Go Back</button>';
        }
        else {
            BackButton.innerHTML += '<button class="btn-srch" onclick="getSongList()">Go Back</button>';
        }
    }
    createBackButton();
    $.ajax({
        type: "GET",
        data: {
            apikey: "d246a1705459f6af7bcc9ca194674583",
            track_id: SongID, //ID of the song
            format: "jsonp",
            callback: "jsonp_callback",

        },
        url: "https://api.musixmatch.com/ws/1.1/track.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function(data) {
            songName = data.message.body.track.track_name; //creates a variable holding the name of the selected song for use in the table heading
        },
        complete: function() {
            $.ajax({
                type: "GET",
                data: {
                    apikey: "d246a1705459f6af7bcc9ca194674583",
                    track_id: SongID, //ID of the song
                    format: "jsonp",
                    callback: "jsonp_callback",

                },
                url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
                dataType: "jsonp",
                jsonpCallback: 'jsonp_callback',
                contentType: 'application/json',
                success: function(data) {
                    try { //checks to make sure there are lyrics to return
                        var lyricResults = data.message.body.lyrics.lyrics_body;
                    }
                    catch (error) { //if there are no lyrics to return, an error is printed and the rest of the function is aborted
                        ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Problem occurred</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                <tr>
                                                    <td>No lyrics available</td>
                                                </tr>
                                             </tbody>`;
                        return;

                    }
                    //lyrics are printed into the results div.
                    ResultsSection.innerHTML += `<thead> 
                                                <tr>
                                                  <th>${songName}</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                <tr>
                                                    <td class="lyrics">${lyricResults}</td>
                                                </tr>
                                             </tbody>`;

                    if (lyricResults === "") {
                        resetPage();
                        createBackButton();
                        ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Problem occurred</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                <tr>
                                                    <td>No lyrics available</td>
                                                </tr>
                                             </tbody>`;
                        return;
                    }
                }
            });
        }
    });
}




//If user opts to view an artist's albums via the getArtist function:
function getAlbumList(artistID) {
    window['currentArtist'] = artistID; //makes the artistID available to use with the Go Back button on the track list results (from getSongList)(assistance from mentor CZ on this line)
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "d246a1705459f6af7bcc9ca194674583",
                artist_id: artistID, //unique ID of the specified artist
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 100, //returns the top 100 results
                g_album_name: 1 //groups albums of the same name into one result

            },
            url: "https://api.musixmatch.com/ws/1.1/artist.albums.get",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                var albumList = data.message.body.album_list;
                BackButton.innerHTML += `<button class="btn-srch" onclick="getArtist()">Go Back</button>`;
                ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Album Name</th>
                                                  <th>Track List</th>
                                                </tr>
                                            </thead>`;
                albumList.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.album.album_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getSongList(${item.album.album_id})">Click here for a list of tracks</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (albumList.length === 0) {
                    resetPage(); //necessary to clear the table header already printed above.
                    BackButton.innerHTML += `<button class="btn-srch" onclick="getArtist()">Go Back</button>`;
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>A problem has occurred</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>no results were found</td>
                                                    </tr>
                                                </tbody>`;
                }




            }
        }

    );
}

//If user opts to view an album's tracks via the getAlbumList function:
function getSongList(albumID) {
    window['currentAlbum'] = albumID; //makes the album ID available to use for the Go Back button on the lyrics page (getLyrics)
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "d246a1705459f6af7bcc9ca194674583",
                album_id: albumID, //unique ID of the specified album
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50, //returns the top 50 results

            },
            url: "https://api.musixmatch.com/ws/1.1/album.tracks.get",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                var songResults = data.message.body.track_list;
                BackButton.innerHTML += '<button class="btn-srch" onclick="getAlbumList(' + window['currentArtist'] + ')">Go Back</button>';
                ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Track Name</th>
                                                  <th>Lyrics</th>
                                                </tr>
                                             </thead>`;
                songResults.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.track.track_name}</td>
                                                        <td>${item.track.artist_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getLyrics(${item.track.track_id}, 'getSongList','${item.track.artist_name}','${item.track.track_name}')">Click here for lyrics</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (songResults.length === 0) {
                    resetPage(); //necessary to clear the table header already printed above.
                    BackButton.innerHTML += '<button class="btn-srch" onclick="getAlbumList(' + window['currentArtist'] + ')">Go Back</button>';
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>A problem has occurred</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>no results were found</td>
                                                    </tr>
                                                </tbody>`;
                }

            }
        }

    );
}


    // let youSearch = (item.track.artist_name + item.track.track_id);
    // videoSearch(youSearch,1)


function videoSearch(video,maxVideo) {
    $.get("https://www.googleapis.com/youtube/v3/search?key="+api_Key+"&type=video&part=snippet&maxResults="+maxVideo+"&q="+video,function(data){
        
        data.items.forEach(item => {
            video=`<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`
        });
        $("#video").append(video);
    })
}   






// $(document).ready(function () {
//     $("#form").submit(function (event) {
//         event.preventDefault();
//         let youSearch = $("#search").val();
//         videoSearch(apiKey, youSearch,2)
//     })

//     function videoSearch(key,video,maxVideo) {
//         $.get("https://www.googleapis.com/youtube/v3/search?key="+key+"&type=video&part=snippet&maxResults="+maxVideo+"&q="+video,function(data){
            
//             data.items.forEach(item => {
//                 video=`<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`
//             });
//             $("#video").append(video);
//         })
//     }
// })