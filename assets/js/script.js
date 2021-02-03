let SearchTerms;//creates dynamic search variable
let SongID;//Variable to call unique track ID used by MusixMatch 
let ResultsSection = document.getElementById('results');//links variable to results table
let BackButton = document.getElementById('back-button');//links variable to back-button table
let api_Key = "AIzaSyCdEPu6GK83lhXpfTuFAJtGyAdH0C23r-M";//Youtube API
let display = document.getElementById('video');//links variable to youtube video id


//runs when the user clicks on the search button
function checkRadio() {
    //links search variable to search id 
    SearchTerms = document.getElementById("search").value;
    //determines which filter to search by
    if ($("#ArtistRadioButton").is(":checked")) {
        getArtist();
    }
    else {
        getSong();
    }
}

//resets the results
function resetPage() {
    ResultsSection.innerHTML = "";
    BackButton.innerHTML = "";
    display.innerHTML= "";
}

//if 'song' radio button is selected
function getSong() {
    resetPage();
    $.ajax({type: "GET",
            data: {
                //calls parameters
                apikey: "afba597c516d1e26064dfec9f0e8c81b",//MusixMatch API
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
                let songResults = data.message.body.track_list;//gathers song list and places it in body
                console.log(data);
                ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Songs</th>
                                                  <th>Artists</th>
                                                  <th>Lyrics</th>
                                                </tr>
                                             </thead>`;
                //dynamically creates table of results                             
                songResults.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.track.track_name}</td>
                                                        <td>${item.track.artist_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getLyrics(${item.track.track_id},'getSong','${item.track.artist_name}','${item.track.track_name}')">Click here for lyrics/YouTube</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (songResults.length === 0) {
                    resetPage(); //clears the table header above
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>No songs found</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;
                                                    
                }
                
            },
        }
    );  
}

//if 'artist' radio button is selected
function getArtist() {
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "afba597c516d1e26064dfec9f0e8c81b",
                q_artist: SearchTerms, //searches by artist name
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50, //returns the top 50 results
                s_artist_rating: "DESC", //sorted by popularity of artist in order 

            },

            url: "https://api.musixmatch.com/ws/1.1/artist.search",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                let artistResults = data.message.body.artist_list;//gathers artist list and places it in body
                console.log(data);
                ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>Artists</th>
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
                    resetPage(); //clears the table header 
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>No artists found</th>
                                                    </tr>
                                                </thead>`;
                                            
                }

            },

        }

    );
    
}


//gets lyrics when song is selected
function getLyrics(SongID, goBack, artist_name, track_name) {
    let youSearch = (artist_name + track_name );
    videoSearch(youSearch,1)
    localStorage.setItem(artist_name, track_name);
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
            apikey: "afba597c516d1e26064dfec9f0e8c81b",
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
                    apikey: "afba597c516d1e26064dfec9f0e8c81b",
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
                    catch (error) { //if there are no lyrics to return, an error displays
                        ResultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th>No lyrics found</th>
                                                </tr>
                                             </thead>`;
                        return;

                    }
                    //lyrics are printed into the results div
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
                                                  <th>No lyrics found</th>
                                                </tr>
                                             </thead>`;
                        return;
                    }
                }
            });
        }
    });
}

//if user clicks to view an artist's albums by getArtist 
function getAlbumList(artistID) {
    window['currentArtist'] = artistID; //makes the artistID available to use with the Go Back button so page can display artists again
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "afba597c516d1e26064dfec9f0e8c81b",
                artist_id: artistID, //ID of the specified artist
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50, //returns the top 50 results
                g_album_name: 1 //groups albums of the same artist name into one result

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
                                                  <th>Album</th>
                                                  <th>Songs</th>
                                                </tr>
                                            </thead>`;
                albumList.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.album.album_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getSongList(${item.album.album_id})">Click here for a list of songs</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (albumList.length === 0) {
                    resetPage(); //necessary to clear the table header 
                    BackButton.innerHTML += `<button class="btn-srch" onclick="getArtist()">Go Back</button>`;
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>No albumss found</th>
                                                    </tr>
                                                </thead>`;
                }

            }
        }

    );
}

//if user clicks to view an album's tracks by getAlbumList
function getSongList(albumID) {
    window['currentAlbum'] = albumID; //makes the album ID available to use for the Go Back button on the lyrics page 
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "afba597c516d1e26064dfec9f0e8c81b",
                album_id: albumID, //ID of the specified album
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
                                                  <th>Songs</th>
                                                  <th>Lyrics</th>
                                                </tr>
                                             </thead>`;
                songResults.forEach(function(item) {
                    ResultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.track.track_name}</td>
                                                        <td>${item.track.artist_name}</td>
                                                        <td>
                                                            <button class="btn-result" onclick="getLyrics(${item.track.track_id}, 'getSongList','${item.track.artist_name}','${item.track.track_name}')">Click here for lyrics/YouTube</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (songResults.length === 0) {
                    resetPage(); //necessary to clear the table header 
                    BackButton.innerHTML += '<button class="btn-srch" onclick="getAlbumList(' + window['currentArtist'] + ')">Go Back</button>';
                    ResultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th>No songs found</th>
                                                    </tr>
                                                </thead>`;
                }

            }
        }

    );
}

//generates embedded YouTube link
function videoSearch(video,maxVideo) {
    $.get("https://www.googleapis.com/youtube/v3/search?key="+api_Key+"&type=video&part=snippet&maxResults="+maxVideo+"&q="+video,function(data){
        
        data.items.forEach(item => {
            video=`<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`
        });
        $("#video").append(video);
    })
}   

 
     
    
 