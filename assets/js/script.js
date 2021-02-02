
let apiKey = "AIzaSyA7KzTPSJYBL6_Q-JZVLu05yEF1iZoBGuk";
let display= "";

$(document).ready(function () {
    $("#form").submit(function (event) {
        event.preventDefault();
        let youSearch = $("#search").val();
        videoSearch(apiKey, youSearch,2)
    })

    function videoSearch(key,video,maxVideo) {
        $.get("https://www.googleapis.com/youtube/v3/search?key="+key+"&type=video&part=snippet&maxResults="+maxVideo+"&q="+video,function(data){
            
            data.items.forEach(item => {
                video=`<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`
            });
            $("#video").append(video);
        })
    }
})

