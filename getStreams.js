/*jshint esversion:6 */
/*jshint browser:true */
/*jshint devel:true */
/*global $, jquery */

// I don't know why, but the chat doesn't work the first time
// display stream names and descriptions
function insertStream(stream, sliceDesc) {
    document.getElementById("streamers").innerHTML += "<div class=\"streamers\"> <button value=\"" + stream.display_name + "\" onclick=\"displayStream(this.value)\"> <img class=\"profileImg\" src=\"" + stream.profile_image_url + "\"</img>" + stream.display_name + "</button>";
    sliceDesc = stream.description.slice(0, 75) + "...";
    document.getElementById("streamers").innerHTML += "<p class=\"streamers\">" + sliceDesc + "</p> </div>";
}

// Onclick, change the stream playing
function displayStream(streamName) {
    document.getElementById("chatbtn").value = streamName;
    displayChat(streamName);
    document.getElementById("vidFeed").innerHTML = "<iframe value=\"" + streamName + "\" id=\"frame\" src=\"https://player.twitch.tv/?channel=" + streamName + "&muted=true\" frameborder=\"0\" scrolling=\"yes\" allowfullscreen=\"true\"> </iframe>";
}

// Grabs the user's (me) ID to work on  
function getUserId() {
    return $.ajax({
        url: "https://api.twitch.tv/helix/users?login=kobark",
        dataType: 'json',
        headers: {
            'Client-ID': "wi16r9f9rqnrnl67iicuxpvcrakgj2"
        },
        success: function (channel) {} // should also include error function
    });
}

// Grabs users' followed channels
function getUserFollows(myId) {
    var link = 'https://api.twitch.tv/helix/users/follows?from_id=' + myId.data[0].id;
    return $.ajax({
        url: link,
        dataType: 'json',
        headers: {
            'Client-ID': "wi16r9f9rqnrnl67iicuxpvcrakgj2"
        },
        success: function (follows) {}
    });
}

// Takes followed channels' ids and puts their data in array
function setupStreams(streamArr) {
    var orderArr = [];
    for (let i = 0; i < streamArr.data.length; i++) {
        let url = "https://api.twitch.tv/helix/users?id=";
        url += streamArr.data[i].to_id;
        orderArr.push(
            $.ajax({
                url: url,
                dataType: 'json',
                headers: {
                    'Client-ID': "wi16r9f9rqnrnl67iicuxpvcrakgj2"
                },
                success: function (data) {
                    return data;
                },
            }));
    }
    return Promise.all(orderArr).then(function () {
        return (orderArr);
    });
}

// Inserts the stream onto the page
function displayStreams(streams) {
    var currStream;
    var sliceDesc;
    for (let i = 0; i < streams.length; i++) {

        currStream = streams[i].responseJSON.data[0];
        insertStream(currStream, sliceDesc);

        if (i === 0)
            displayStream(currStream.display_name);
    }
    document.getElementById("streamList").setAttribute("style", "background-color: #551A8B");
}

function displayChat(streamName) {
    document.getElementById("chat").innerHTML = "<iframe frameborder=\"0\" scrolling=\"no\"   id=\"chat_embed\" src=\"https://www.twitch.tv/" + streamName + "/chat\"> </iframe>";
    $("#chat_embed").css("height", $("#vidFeed").height() - 43);
    $("#chat_embed").css("width", $("#optList").width());
    
}

function reChat() {
    $("#streamers").hide();
    $("#chat").show();
}
function reStream() {
    $("#chat").hide();
    $("#streamers").show();
}
if (matchMedia) {
    const mq = window.matchMedia("(min-width: 1200px)");
    //mq.addListener(changedWidth);
    //changedWidth(mq);
}

/*function changedWidth(mq) {
    if (mq.matches) {

    } else {
        document.getElementById("bars").innerHTML = "<button class=\"options\" id=\"streamOpt\" onclick=\"reStream()\">Streamers</button> <button> <img class=\"dropdown\" src=\"https://image.flaticon.com/icons/svg/60/60995.svg\"/> </button>";
    }
}*/


var myId = getUserId();
myId.then(follows => getUserFollows(follows)
    .then(channels => setupStreams(channels)
        .then(streams => displayStreams(streams))));
