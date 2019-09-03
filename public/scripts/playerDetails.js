"use strict";

$(function()
{
    // var stores the url params in a variable
    let urlParams = new URLSearchParams(location.search);
    // courseid is parsed from the url and stored in a variable
    let teamId = urlParams.get("teamid")
    let membId = urlParams.get("membid")

    let objs
    $.getJSON(`/api/teams/${teamId}/members/${membId}`, function(data)
    {
        objs = data;

        $("#memberIdInput").val(objs.MemberId);
        $("#emailInput").val(objs.Email);
        $("#phoneInput").val(objs.Phone);
        $("#memberNameInput").val(objs.MemberName);
        $("#contactNameInput").val(objs.ContactName);
        $("#playerAge").val(objs.Age);
        $("#genderInput").val(objs.Gender);
    })

    $("#editPlayerBtn").on("click", function()
    {
        $("#saveChanges").remove();
        $("form input").attr("readonly", false)
        let saveBtn = `<button type="button" class="btn btn-outline-success mr-1 ml-1 mt-2" id="saveChanges">Save Changes</button>`
        $("#detailsForm").append(saveBtn)
        $("#saveChanges").on("click", function()
        {
            $.ajax({
                url: `/api/teams/${teamId}/members`,
                data: $("#detailsForm").serialize(),
                method: 'PUT',
                success: function()
                {
                    //document.location.href = "courses.html?instr=" + $.urlParam('instr');
                }
            })
            $("form input").attr("readonly", true)
            $("#saveChanges").remove();
        })
    })

})