"use strict";

$(function()
{
    $("#searchBy").on("change", getFilter);
})

function getFilter()
{
    $("#regBtn").remove();
    $("#searchFilter").remove();
    $("#dataTable").remove();
    let selected = $("#searchBy").val();
    if (selected == "All") {
        buildTableFrame();    
        $.getJSON("/api/teams", teams => {            
            $.each(teams, (index, team) => {
                let str = 
                   `<tr>
                        <td>${team.TeamName}</td>
                        <td>${team.League}</td>
                        <td><a role='button' class='btn btn-outline-primary' href='details.html?teamid=${team.TeamId}' >Details</a>
                        </td>
                        <td><a role='button' class='btn btn-outline-danger' href='edit.html?teamid=${team.TeamId}' >Edit</a>
                        </td>
                    </tr>`
                $("#tableBody").append(str)
                addRegBtn();
            })
        })
    }
    else {
        let str = `<div id="searchFilter">
                        <label for="filter">${selected}:</label>
                        <select class="selectors custom-select" id="filter">
                            <option selected disabled>Choose One</option>
                        </select>
                    </div>`
        $("#lookupContainer").append(str)
    }
    

    // Table Display if the user searches by 'League'
    if (selected == "Leagues")
    {
        $("#filter").on("change", getDataByLeague)
        $.getJSON("/api/leagues", leagues => {
            $.each(leagues, (index, league) => {   
                $("#filter").append(
                    $("<option />")
                        .text(league.Name)
                        .attr("value", league.Name)
                );   
            })
        });
    }
    
    $.getJSON("/api/teams", teams => {
        $.each(teams, (index, team) => {
            if ($("#searchBy").val() == "Teams")
            {
                $("#filter").append(
                    $("<option />")
                        .text(team.TeamName)
                        .attr("value", team.TeamId)
                )
            }
        })
    })

    if ($("#searchBy").val() == "Number of Members")
    {
        for (let i = 0; i < 8; i++)
        {
            $("#filter").append(
                $("<option />")
                    .text(i)
                    .attr("value", (i))
            )
        }
    }
    
}

function getDataByLeague()
{

    let selected = $("#filter").val();
    
    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams/byleague/" + selected, teams => {
        let str;
        $.each(teams, (index, team) => {
            str = 
                   `<tr>
                        <td>${team.TeamName}</td>
                        <td>${team.League}</td>
                        <td>${team.Members.length}</td>
                        <td><a role='button' class='btn btn-outline-primary' href='details.html?teamid=${team.TeamId}' >Details</a>
                        </td>                        
                        <td><a role='button' class='btn btn-outline-danger' href='edit.html?teamid=${team.TeamId}' >Edit</a>
                        </td>
                    </tr>`
            $("#tableBody").append(str)
        })
        addRegBtn();
    })
    
}

function buildTableFrame()
{
    let tableFrame = `<table class='table text-center table-hover table-bordered mt-5' id='dataTable'>
                                <thead id='tableHead'>
                                    <tr>   
                                        <th>Team Name</th> 
                                        <th>Team League</th>
                                        <th>Number of Members</th>
                                        <th>Details</th>
                                        <th>Edit</th>
                                    <tr>
                                </thead> 
                                <tbody id='tableBody'> 
                                </tbody>    
                            </table>`;
    $("#tableContainer").append(tableFrame)
}

function addRegBtn()
{
    $("#regBtn").remove();
    $("#tableContainer").append(
        $("<a />")
            .attr("role", "button")
            .attr("class", "btn btn-outline-success")
            .attr("href", "register.html")
            .attr("id", "regBtn")
            .text("Register")
    )
}