/*jshint esversion:6 */
/*jshint browser:true */
/*global $, jquery */

// display stream names and descriptions
function insertStream(stream, sliceDesc) {
  document.getElementById("streamers").innerHTML += "<div> <button value=\"" + stream.display_name + "\" onclick=\"swapStream(this.value)\"> <img class=\"profileImg\" src=\"" + stream.profile_image_url + "\"</img>" + stream.display_name + "</button>";
  sliceDesc = stream.description.slice(0, 75) + "...";
  document.getElementById("streamers").innerHTML += "<p>" + sliceDesc + "</p> </div>";
}

// Onclick, change the stream playing
function displayStream(streamName) {
  document.getElementById("vidFeed").innerHTML = "<iframe src=\"https://player.twitch.tv/?channel=" + streamName + "&muted=true\" height=\"495\" width=\"845\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"> </iframe>";
}

// Grabs the user's (me) ID to work on  
function getUserId() {
  "use strict";
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
  "use strict";
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
  "use strict";
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

    if (i === 0) // TODO: scale video size with screen size
      displayStream(currStream.display_name);
  }
}

var myId = getUserId();
myId.then(follows => getUserFollows(follows)
  .then(channels => setupStreams(channels)
    .then(streams => displayStreams(streams))));
