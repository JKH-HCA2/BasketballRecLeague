"use strict";

/*
*
* Function: Anonymous function that readies the JavaScript on-page-load
*
* Author: Jeremy Han
*
*/
$(function () {
    $("#searchBy").on("change", getFilter);
});

/*
*
* Function: Master function that controls the functionality of all the JavaScript on the page
*
* Author: Jeremy Han
*
*/
function getFilter() {
    // Remove block clears generated content whenever the function is fired
    $("#regBtn").remove();
    $("#searchFilter").remove();
    $("#dataTable").remove();
    // Variable stores the users desired filter
    let selected = $("#searchBy").val();

    // Table generation if user selects 'View All'
    if (selected == "All") {
        buildTableFrame();
        $.getJSON("/api/teams", teams => {
            $.each(teams, (index, team) => {
                getTableBody(team);
            });
            addRegBtn();
        });
    }
    // Secondary dropdown frame is dynamically created if the user *Doesn't* select 'View All'
    else {
        let str = `<div id="searchFilter">
                        <label for="filter">${selected}:</label>
                        <select class="selectors mt-2 custom-select" id="filter">
                            <option selected disabled>Choose One</option>
                        </select>
                    </div>`;
        $("#lookupContainer").append(str);
    }

    // Dropdown populates if the user searches by 'League'
    if (selected == "League") {
        $("#filter").on("change", getDataByLeague);
        $.getJSON("/api/leagues", leagues => {
            $.each(leagues, (index, league) => {
                $("#filter").append(
                    $("<option />")
                        .text(league.Name)
                        .attr("value", league.Name)
                );
            });
        });
    }

    // Dropdown populates if the user searches by 'Team'
    if (selected == "Team") {
        $("#filter").on("change", getDataByTeam);
        $.getJSON("/api/teams", teams => {
            $.each(teams, (index, team) => {
                if ($("#searchBy").val() == "Team") {
                    $("#filter").append(
                        $("<option />")
                            .text(team.TeamName)
                            .attr("value", team.TeamId)
                    );
                }
            });
        });
    }

    // Dropdown populates if the user searches by 'Number of Members'
    if ($("#searchBy").val() == "Number of Members") {
        $("#filter").on("change", getDataByMems);
        for (let i = 0; i < 16; i++) {
            $("#filter").append(
                $("<option />")
                    .text(i)
                    .attr("value", i)
            );
        }
    }
}

// Helper function that dynamically creates the table when the user filters by 'League'
function getDataByLeague() {
    let selected = $("#filter").val();

    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams/byleague/" + selected, teams => {
        $.each(teams, (index, team) => {
            getTableBody(team);
        });
        addRegBtn();
    });
}

// Helper function that dynamically creates the table when the user filters by 'Team'
function getDataByTeam() {
    let selected = $("#filter").val();

    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams/" + selected, team => {
        getTableBody(team);
    });
    addRegBtn();
}

// Helper function that dynamically creates the table when the user filters by 'Number of Members'
function getDataByMems() {
    let selected = $("#filter").val();

    $("#dataTable").remove();
    buildTableFrame();
    $.getJSON("/api/teams", teams => {
        $.each(teams, (index, team) => {
            if (team.Members.length == selected) {
                getTableBody(team);
            }
        });
        addRegBtn();
    });
}

// Helper function that builds the table, table header, and table body
function buildTableFrame() {
    let tableFrame = `<table class='table table-responsive table-hover text-center table-light table-bordered mt-3' id='dataTable'>
                                <thead class='thead-dark' id='tableHead'>
                                    <tr>   
                                        <th class='align-middle'>Team Name</th> 
                                        <th class='align-middle'>Team League</th>
                                        <th class='align-middle'>Number of Members</th>
                                        <th class='align-middle'>Details</th>
                                    <tr>
                                </thead> 
                                <tbody id='tableBody'> 
                                </tbody>    
                            </table>`;
    $("#tableContainer").append(tableFrame);
}

// Helper function that builds the body of the data table on the DOM
function getTableBody(team) {
    let str = `<tr>
                        <td class='align-middle'>${team.TeamName}</td>
                        <td class='align-middle'>${team.League}</td>
                        <td class='align-middle'>${team.Members.length}</td>
                        <td class='align-middle'><a role='button' class='btn btn-outline-primary' href='details.html?teamid=${team.TeamId}' >Details</a>
                        </td>                        
                    </tr>`;
    $("#tableBody").append(str);
}

// Helper function that generates a register button after the data table
function addRegBtn() {
    $("#regBtn").remove();
    $("#tableContainer").append(
        $("<a />")
            .attr("role", "button")
            .attr("class", "btn btn-success")
            .attr("href", "register.html")
            .attr("id", "regBtn")
            .text("Register a Team")
    );
}
