"use strict";

/*
*
* Function: Anonymous function that readies the JavaScript on-page-load
*
* Author: Jeremy Han
*
*/
$(function()
{
    // var stores the url params in a variable
    let urlParams = new URLSearchParams(location.search);
    // courseid is parsed from the url and stored in a variable
    let teamId = urlParams.get("teamid")
    let membId = urlParams.get("membid")

    let objs
    // Populates data fields with player info
    $.getJSON(`/api/teams/${teamId}/members/${membId}`, function(data) {
      objs = data;
      postData(objs);
    });

    // Reverts the data fields to the mostly recently posted data by the user
    $("#resetChanges").on("click", function()
    {
        $.getJSON(`/api/teams/${teamId}/members/${membId}`, function(data) {
            objs = data;
            postData(objs);
        })        
    })

    // Allows the user to intuitively edit the player info within the details page
    $("#editPlayerBtn").on("click", function()
    {
        $("#saveChanges").show();
        $("#resetChanges").show();
        $("form input").attr("readonly", false)
        $("#saveChanges").on("click", function()
        {
            $.ajax({
                url: `/api/teams/${teamId}/members`,
                data: $("#detailsForm").serialize(),
                method: 'PUT'
            })
            $("form input").attr("readonly", true)
            $("#saveChanges").hide();
            $("#resetChanges").hide();
        })
    })

    // Modal that confirms the user wants to delete the player
    $("#confirmDelete").on("click", function()
    {
        $.ajax({
            url: `/api/teams/${teamId}/members/${membId}`,
            type: 'DELETE',
            success: function() {
                location.href = "details.html?teamid=" + teamId
            }
        })
    })

    // Button that returns the user to the team details page
    let backBtn = `<a class='btn btn-secondary ml-1 mt-4' id='cancelBtn' href=details.html?teamid=${teamId}>Back to Teams</a>`
    $("#detailBtnGroup").append(backBtn)
})

// Helper function that posts data from the server to the relevant data fields
function postData(objs) {
  $("#memberIdInput").val(objs.MemberId);
  $("#emailInput").val(objs.Email);
  $("#phoneInput").val(objs.Phone);
  $("#memberNameInput").val(objs.MemberName);
  $("#contactNameInput").val(objs.ContactName);
  $("#playerAge").val(objs.Age);
  $("#genderInput").val(objs.Gender);
}