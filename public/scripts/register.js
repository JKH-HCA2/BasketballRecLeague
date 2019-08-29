"use strict";

$(function()
{
    getLeagues();

    $("input[name='regType']").on("change", function()
    {
        $("#registrationForm").remove()
        let selected = $("input[name='regType']:checked", "#formSelector").val()
        if (selected == "Team")
        {                        
            getTeamForm();
            $("#submitTeam").on("click", sendTeamData)
        }
        else
        {
            getMembForm();
            $("#submitMember").on("click", sendMembData)
        }
    })




})

function getTeamForm()
{
    let str = 
    `<form class='border border-primary rounded-lg mb-5' id="registrationForm">
        <h1 class='display-4 mx-auto'>Team Registration</h1>
        <div class="form-group">
            <label for="teamNameInput">Team Name</label>
            <input type="text" name="teamname" class="form-control" id="teamNameInput">
        </div>
        <div class="form-group">
            <label for="leagueSelector">League</label>
            <select name="leaguecode" id="leagueSelector" class="custom-select">
                <option disabled selected>Select a League</option>
            </select>
        </div>
        <div class="form-group">
            <label for="managerNameInput">Manager Name</label>
            <input type="text" name="managername" class="form-control" id="managerNameInput">
        </div>
        <div class="form-group">
            <label for="managerPhoneInput">Manager Phone Number</label>
            <input type="text" name="managerphone" class="form-control" id="managerPhoneInput">
        </div>
        <div class="form-group">
            <label for="managerEmailInput">Email Address</label>
            <input type="text" name="manageremail" class="form-control" id="managerEmailInput">
        </div>
        <div class="form-group">
            <label for="minAge">Minimum Age</label>
            <input type="number" min="0" max="100" name="minmemberage" class="form-control" id="minAge">
        </div>
        <div class="form-group">
            <label for="maxAge">Maximum Age</label>
            <input type="number" min="0" max="100" name="maxmemberage" class="form-control" id="maxAge">
        </div>
        <div class="form-group">
            <label for="maxMembers">Max Members</label>
            <input type="number" min="0" max="7" name="maxteammembers" class="form-control" id="maxMembers">
        </div>
        <div class="form-group">
            <label for="genderSelector">Gender</label>
            <select name="teamgender" id="genderSelector" class="custom-select">
                <option disabled selected>Choose One</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Any'>Any</option>
            </select>
        </div>
        <button type='button' id="submitTeam" class='btn btn-outline-primary'>Submit</button>
    </form>`
    $("#formContainer").append(str)
    getLeagues();
}

function getMembForm()
{
    let str = 
    `<form class='border border-primary rounded-lg' id="registrationForm">
        <h1 class='display-4 mx-auto'>Member Registration</h1>
        <div class="form-group">
            <label for="emailInput">Email Address</label>
            <input type="text" name="email" class="form-control" id="emailInput">
        </div>
        <div class="form-group">
            <label for="nameInput">Member Name</label>
            <input type="text" name="membername" class="form-control" id="nameInput">
        </div>
        <div class="form-group">
            <label for="contactNameInput">Contact Name</label>
            <input type="text" name="contactname" class="form-control" id="contactNameInput">
        </div>
        <div class="form-group">
            <label for="ageInput">Age</label>
            <input type="number" name="age" class="form-control" id="ageInput">
        </div>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary">
                <input type="radio" name="gender" id="male" value="Male" autocomplete="off"> Male
            </label>
            <label class="btn btn-secondary">
                <input type="radio" name="gender" id="female" value="Female" autocomplete="off"> Female
            </label>
        </div>
        <div class="form-group">
            <label for="phoneInput">Phone Number</label>
            <input type="text" name="phone" class="form-control" id="phoneInput">
        </div>
        <button type='button' id="submitMember" class='btn btn-outline-primary'>Submit</button>
    </form>`
    $("#formContainer").append(str)
}

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