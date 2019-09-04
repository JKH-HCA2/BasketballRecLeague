"use strict";

$(function()
{
    // var stores the url params in a variable
    let urlParams = new URLSearchParams(location.search);
    // courseid is parsed from the url and stored in a variable
    let teamId = urlParams.get("teamid")
    let membId = urlParams.get("membid")

    let objs
    $.getJSON(`/api/teams/${teamId}/members/${membId}`, function(data) {
      objs = data;
      postData(objs);
    });

    $("#resetChanges").on("click", function()
    {
        postData(objs);
    })


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

    let backBtn = `<a class='btn btn-secondary ml-1 mt-4' id='cancelBtn' href=details.html?teamid=${teamId}>Back to Teams</a>`
    $("#detailBtnGroup").append(backBtn)
})

function postData(objs) {
  $("#memberIdInput").val(objs.MemberId);
  $("#emailInput").val(objs.Email);
  $("#phoneInput").val(objs.Phone);
  $("#memberNameInput").val(objs.MemberName);
  $("#contactNameInput").val(objs.ContactName);
  $("#playerAge").val(objs.Age);
  $("#genderInput").val(objs.Gender);
}