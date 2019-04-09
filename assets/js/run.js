var steamGlobal = {}

$(function () {

    $("input#getsteamstats").click(runsteam);
    $("input#getcsgostats").click(runcsgo);

});

// Get the global steam informations

//##################################
function getPlayerSummaries(steamid) {
    // Declare variables.
    var data = {}, steamGlobal = {};

    // First AJAX request:
    $.get({
        //cors.io to patch Cross-Origin Request blocked
        url: 'https://cors.io/?http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=6FCCD68CF567B34B85E74EE6237927DF&steamids=' + steamid,
        success: function (data) {
          var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};

          //console.log(data)

          //Because of cors.io we have to parse into json
          obj = JSON.parse(data);

          //Data we want to retrieve
          creationdate = obj.response.players[0].timecreated;
          lastlogoff = obj.response.players[0].lastlogoff;

            // On success, create a literal object for today's weather.
            steamGlobal = {
              avatar: obj.response.players[0].avatarfull,
              //Convert timestamp to date
              creationdate: new Date(creationdate*1000).toLocaleString('fr-FR', options),
              lastlogoff: new Date(lastlogoff*1000).toLocaleString('fr-FR', options),
            };
        },

    }).done(function () {
        // When the request is completed, display the card.
        addSteamStats(steamGlobal);

            });
}


function addSteamStats(data) {
    // Append the card to the <main></main> node.
    $("main").append(
        `<section>
            <div>
                <div><br>
                    <img src="${data.avatar}"/>
                    <p id="creationdate">Creation date : ${ data.creationdate }</p>
                    <p id="lastlogoff">Last Logoff : ${ data.lastlogoff }</p>
                </div>
            </div>
        </section>`
    );
}

function runsteam(e) {
    // Prevent submit tag behavior.
    e.preventDefault();

    // Retrieve the field value and call the API.
    var steamid = $("input#steamID").val();
    getPlayerSummaries(steamid);

}

//##################################




// Get the csgo stats

//##################################

function getcsgoStats(steamid) {
    // Declare variables.
    var data = {}, csgoGlobal = [];

    // First AJAX request:
    $.get({
        //cors.io to patch Cross-Origin Request blocked
        url: 'https://cors.io/?http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=6FCCD68CF567B34B85E74EE6237927DF&steamid=' + steamid,
        success: function (data) {

          //console.log(data)

          //Because of cors.io we have to parse into json
          obj = JSON.parse(data);
          for (var statsnumber in obj.playerstats.stats){
            csgoGlobal.push(
            [obj.playerstats.stats[statsnumber].name,
            obj.playerstats.stats[statsnumber].value])
          }
          console.log(csgoGlobal)
            // On success, create a literal object for today's weather.
          /*  csgoGlobal = {
              total_kills: obj.playerstats.stats[0].value,

            };*/
        },

    }).done(function () {
        // When the request is completed, display the card.
        addcsgoStats(csgoGlobal);

            });
}

function addcsgoStats(data) {
    // Append the card to the <main></main> node.
    for(i in data){
      $("p#csgostats").append(
          `<section>
              <div>
                  <div><br>
                      <p id="totalkills"> ${ data[i][0] }: ${ data[i][1] }</p>
                  </div>
              </div>
          </section>`
    );
  }
}

function runcsgo(e) {
    // Prevent submit tag behavior.
    e.preventDefault();


    // Retrieve the field value and call the API.
    var steamid = $("input#steamID").val();
    getcsgoStats(steamid);

}

//##################################

//Add chart



function renderChart(data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'This week',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
          scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
              }
        },
    });
}

$("#renderBtn").click(
    function () {
      var steamid = $("input#steamID").val();

      $.get({
          //cors.io to patch Cross-Origin Request blocked
          url: 'https://cors.io/?http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=6FCCD68CF567B34B85E74EE6237927DF&steamids=' + steamid,
          success: function (data) {

            //Because of cors.io we have to parse into json
            obj = JSON.parse(data);

            //Data we want to retrieve
            var name = obj.response.players[0].personaname;

          },

      }).done(function () {
          // When the request is completed, display the card.
          data = [20000, 14000];
          labels =  [obj.response.players[0].personaname, "monday"];
          renderChart(data, labels);

      });
    }
)
