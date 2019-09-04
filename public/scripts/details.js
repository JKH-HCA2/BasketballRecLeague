"use strict";

/*
*
* Function: Anonymous function that readies the JavaScript on-page-load
*
* Author: Jeremy Han
*
*/
$(function () {
    // var stores the url params in a variable
    let urlParams = new URLSearchParams(location.search);
    // courseid is parsed from the url and stored in a variable
    let teamId = urlParams.get("teamid")

    let objs;
    // JSON get request pulls data from the coursesOffered.json file and points it into a var (objs)
    $.getJSON("/api/teams/" + teamId, function (data) {
        objs = data


        postData(objs)
        // For loop statement runs through the students array and prints them to the student list table (if necessary)
        let len = objs.Members.length
        if (len != 0) {
            for (let i = 0; i < len; i++) {
                let str = `<tr><td class="align-middle">${objs.Members[i].MemberName}</td><td class="align-middle">${objs.Members[i].Email}</td><td><a role="button" href="playerdetails.html?teamid=${objs.TeamId}&membid=${objs.Members[i].MemberId}" class="btn btn-outline-danger">
                Edit
              </a></td></tr>`
                $("#memberTableBody").append(str)
            }
        }
        else {
            $("#membersTable").css("display", "none")
        }
    })
    // Button is created dynamically to populate the course ID field on the registration page with data in the URL
    let regBtn = "<a class='btn btn-primary mr-1 mt-4' id='registerBtn' href=register.html?teamid=" + teamId + ">Register</a>"
    $("#detailBtnGroup").prepend(regBtn)

    $("#resetChanges").on('click', function () {
        $.getJSON("/api/teams/" + teamId, function(data) {
            let objs = data;
            postData(objs);
        })    
    })

    // Edit button allows the user to intuitively edit the team info on the details page
    $("#editBtn").on("click", function () {
        $("form input").attr("readonly", false)
        $("#saveChanges").show();
        $("#resetChanges").show();
        $("#saveChanges").on("click", function () {
            $("#errorDiv").hide();
            let isok = teamFormValidation();
            if (isok == false) {
                $("#errorDiv").show();
                return;
            }
            $.ajax({
                url: '/api/teams',
                data: $("#detailsForm").serialize(),
                method: 'PUT',
                success: function () {
                    //document.location.href = "courses.html?instr=" + $.urlParam('instr');
                }
            })
            $("form input").attr("readonly", true)
            $("#resetChanges").hide();
            $("#saveChanges").hide();
        })
    })
    // Modal popup that confirms whether the user wants to delete the team
    $("#confirmDelete").on("click", function () {
        $.ajax({
            url: `/api/teams/${teamId}`,
            type: 'DELETE',
            success: function () {
                location.href = "teams.html"
            }
        })
    })
})

// Helper function that posts data from the server to the relevant data fields
function postData(objs) {

    // Strings are created for every type of information pulled from the json file
    $("#teamId").val(objs.TeamId);
    $("#teamNameInput").val(objs.TeamName);
    $("#leagueInput").val(objs.League);
    $("#managerNameInput").val(objs.ManagerName);
    $("#managerPhoneInput").val(objs.ManagerPhone);
    $("#managerEmailInput").val(objs.ManagerEmail);
    $("#minAge").val(objs.MinMemberAge);
    $("#maxAge").val(objs.MaxMemberAge);
    $("#maxMembers").val(objs.MaxTeamMembers);
    $("#genderInput").val(objs.TeamGender);

    
}

// Helper function that validates user data when they attempt to edit the team
function teamFormValidation() {
    let emailTest = /^([a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})){1}(;[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,}))*$/;
    let nameTest = /^([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]*)+[ ]([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]+)+$/;
    let phoneTest = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/

    let isok = true;

    let teamName = $.trim($("#teamNameInput").val());
    if (teamName == "") {
        isok = false;
    } else if (teamName.length < 5) {
        isok = false;
    }

    let managerName = $.trim($("#managerNameInput").val());
    if (managerName == "") {
        isok = false;
    } else if (nameTest.test(managerName) == false) {
        isok = false;
    }

    let managerPhone = $.trim($("#managerPhoneInput").val())
    if (managerPhone == "") {
        isok = false;
    } else if (phoneTest.test(managerPhone) == false) {
        isok = false;
    }

    let managerEmail = $.trim($("#managerEmailInput").val());
    if (managerEmail == "") {
        isok = false;
    } else if (emailTest.test(managerEmail) == false) {
        isok = false;
    }

    let minInputAge = Number($.trim($("#minAge").val()));
    let maxInputAge = Number($.trim($("#maxAge").val()));
    if (minInputAge == "" || minInputAge < 0 || minInputAge > 100 || minInputAge > maxInputAge) {
        isok = false;
    }   
    if (maxInputAge == "" || maxInputAge < 0 || maxInputAge > 100 || maxInputAge < minInputAge) {
        isok = false;
    }

    let maxMembers = $.trim($("#maxMembers").val())
    if (maxMembers < 5 || maxMembers > 15) {
        isok = false;
    }
    return isok;
}