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

    // Table generation if user selects 'View All'
    if (selected == "All") {
        buildTableFrame();    
        $.getJSON("/api/teams", teams => {            
            $.each(teams, (index, team) => {
                getTableBody(team)                
            })
            addRegBtn();
        })
    }
    // Secondary dropdown frame is dynamically created if the user *Doesn't* select 'View All'
    else {
        let str = `<div id="searchFilter">
                        <label for="filter">${selected}:</label>
                        <select class="selectors custom-select" id="filter">
                            <option selected disabled>Choose One</option>
                        </select>
                    </div>`
        $("#lookupContainer").append(str)
    }
    

    // Dropdown populates if the user searches by 'League'
    if (selected == "League")
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
    
    // Dropdown populates if the user searches by 'Team'
    if (selected == "Team")
    {
        $("#filter").on("change", getDataByTeam)
        $.getJSON("/api/teams", teams => {
            $.each(teams, (index, team) => {
                if ($("#searchBy").val() == "Team")
                {
                    $("#filter").append(
                        $("<option />")
                            .text(team.TeamName)
                            .attr("value", team.TeamId)
                    )
                }
            })
        })
    }

    if ($("#searchBy").val() == "Number of Members")
    {
        $("#filter").on("change", getDataByMems)
        for (let i = 0; i < 8; i++)
        {
            $("#filter").append(
                $("<option />")
                    .text(i)
                    .attr("value", i)
            )
        }
    }
    
}

// Helper function that dynamically creates the table when the user filters by 'League'
function getDataByLeague()
{

    let selected = $("#filter").val();
    
    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams/byleague/" + selected, teams => {
        $.each(teams, (index, team) => {
            getTableBody(team)
        });
        addRegBtn();
    })    
}

function getDataByTeam()
{
    let selected = $("#filter").val();

    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams/" + selected, team => {
        getTableBody(team)        
    })
    addRegBtn();
}

function getDataByMems()
{
    let selected = $("#filter").val();

    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams", teams => {
        $.each(teams, (index, team) => {
            if (team.Members.length == selected)
            {
                getTableBody(team);              
            }            
        })
        addRegBtn();
    })
}

// Helper function that builds the table, table header, and table body
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

function getTableBody(team)
{
    let str =         `<tr>
                        <td>${team.TeamName}</td>
                        <td>${team.League}</td>
                        <td>${team.Members.length}</td>
                        <td><a role='button' class='btn btn-outline-primary' href='details.html?teamid=${team.TeamId}' >Details</a>
                        </td>                        
                        <td><a role='button' class='btn btn-outline-danger' href='edit.html?teamid=${team.TeamId}' >Edit</a>
                        </td>
                    </tr>`;
    $("#tableBody").append(str);
}


// Helper function that generates a register button after the data table
function addRegBtn()
{
    $("#regBtn").remove();
    $("#tableContainer").append(
        $("<a />")
            .attr("role", "button")
            .attr("class", "btn btn-outline-success")
            .attr("href", "register.html")
            .attr("id", "regBtn")
            .text("Register a Team")
    )
}