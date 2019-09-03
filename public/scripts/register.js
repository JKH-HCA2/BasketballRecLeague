"use strict";

$(function()
{
    // var stores the url params in a variable
    let urlParams = new URLSearchParams(location.search);
    // courseid is parsed from the url and stored in a variable
    let teamId = urlParams.get("teamid");

    getLeagues();

    $.getJSON(`/api/teams/${teamId}`, function(data)
    {
        let objs = data
        let teamName = objs.TeamName;
        $("#teamName").val(teamName)
        if ($("#teamName").val() == "") {
          $("#membRegForm input").attr("readonly", true);
          let warning =
            "<div class='warningDiv'><p>Select a Team from the Team Search page to register <a href='teams.html'>Here</a></p></div>";
          $("#teamRegForm").append(warning);
        }    
    })
  
   


    $("teamInput").val(teamId)
    
    if (teamId == null)
    {
        $("#membRegForm").hide();
        $("#teamRegForm").show();
        $("#submitTeam").on("click", sendTeamData) 
    }
    else
    {
        $("#membRegForm").show();
        $("#teamRegForm").hide();
        $("#submitMember").on("click", sendMembData)

    }
    

    $("input[name='regType']").on("change", function()
    {
        let selected = $("input[name='regType']:checked", "#formSelector").val()
        if (selected == "Team")
        {                        
            $("#membRegForm").hide();
            $("#teamRegForm").show();
        }
        else
        {
            $("#membRegForm").show();
            $("#teamRegForm").hide();
            
        }
    })

    
})

function getLeagues()
{
    $.getJSON("/api/leagues", leagues => {
        $.each(leagues, (index, league) => {   
            $("#leagueSelector").append(
                $("<option />")
                    .text(league.Name)
                    .attr("value", league.Name)
            );   
        })
    });
}

function sendTeamData()
{
    // Data from the add course form is posted to the server
    $.post("/api/teams", $("#registrationForm").serialize(),
    function(data)
    {
        data = JSON.parse(data);
        location.href = "details.html?teamid=" + data.TeamId;
    })
    return false;
}

function sendMembData()
{
    // var stores the url params in a variable
    let urlParams = new URLSearchParams(location.search);
    // courseid is parsed from the url and stored in a variable
    let teamId = urlParams.get("teamid");
    
    $.post(`/api/teams/${teamId}/members`, $("#registrationForm").serialize(),
    function(data)
    {
        location.href = "details.html?teamid=" + teamId;
    })
    return false;
}