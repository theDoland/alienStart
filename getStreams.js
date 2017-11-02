function getUserId()
{
        return $.ajax({
          url: "https://api.twitch.tv/helix/users?login=kobark",
          dataType: 'json',
          headers: {
            'Client-ID': "wi16r9f9rqnrnl67iicuxpvcrakgj2"
          },
          success: function(channel) // should also include error function
          {
          },          
        });
}
function getUserFollows(magic)
{
        var link = 'https://api.twitch.tv/helix/users/follows?from_id=' + magic.data[0].id;
        return $.ajax({
          url: link,
          dataType: 'json',
          headers: {
            'Client-ID': "wi16r9f9rqnrnl67iicuxpvcrakgj2"
          },
          success: function(follows)
          {
          },
        });
}
function setupStreams(streamArr)
{
        
        var orderArr = [];
        for(let i = 0; i < streamArr.data.length; i++)
        {
          let url= "https://api.twitch.tv/helix/users?id=";
          url += streamArr.data[i].to_id;
          orderArr.push(
            $.ajax({
            url: url,
            dataType: 'json',
            headers: {
              'Client-ID': "wi16r9f9rqnrnl67iicuxpvcrakgj2"
            },
            success: function(data)
            {
              return data;
            },
          }));
        }
        return Promise.all(orderArr).then(function()
        {
          return(orderArr);
        });
}
function displayStreams(streams)
{
        var currStream;
        var sliceDesc;
        console.log(streams.length);
        for(let i = 0; i < streams.length; i++)
        {
          
          currStream = streams[i].responseJSON.data[0];
		document.getElementById("streamers").innerHTML += "<div id=\"substream\"> <img class=\"profileImg\" src=\"" + currStream.profile_image_url + "\"</img>" + currStream.display_name;
          sliceDesc = currStream.description.slice(0,75) + "...";
          document.getElementById("streamers").innerHTML += "<p>" + sliceDesc + "</p>" + "</div>";
          if(i == 0)
          {
            document.getElementById("vidFeed").innerHTML = "<iframe src=\"https://player.twitch.tv/?channel=" + currStream.display_name + "&muted=true\" height=\"495\" width=\"845\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"> </iframe>";
          } //not quite satisfied with the way the video size is being handled, probably need to scale with screen size
          
        }
}
var magic = getUserId();
magic.then(follows => getUserFollows(follows)
     .then(channels => setupStreams(channels)
     .then(streams => displayStreams(streams)
)));
