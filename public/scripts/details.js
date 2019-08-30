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

    let objs;
    // JSON get request pulls data from the coursesOffered.json file and points it into a var (objs)
    $.getJSON("/api/teams/" + teamId, function(data)
    {
        objs = data

        // Strings are created for every type of information pulled from the json file
        $("#teamNameInput").val(objs.TeamName)
        $("#leagueInput").val(objs.League)
        $("#managerNameInput").val(objs.ManagerName)
        $("#managerPhoneInput").val(objs.ManagerPhone)
        $("#managerEmailInput").val(objs.ManagerEmail)
        $("#minAge").val(objs.MinMemberAge)
        $("#maxAge").val(objs.MaxMemberAge)
        $("#maxMembers").val(objs.MaxTeamMembers)
        $("#genderInput").val(objs.TeamGender)
        // For loop statement runs through the students array and prints them to the student list table (if necessary)
        let len = objs.Members.length
        if (len != 0)
        {
            for (let i = 0; i < len;i++)
            {
                let str = "<tr><td>" + objs.Members[i].MemberName + "</td><td>" + objs.Members[i].Email + "</td></tr>"
                $("#memberTableBody").append(str)
            }
        }
        else
        {
            $("#membersTable").css("display", "none")
        }            
    })
    // Button is created dynamically to populate the course ID field on the registration page with data in the URL
    let regBtn = "<a class='btn btn-outline-primary mr-1 mt-4' id='registerBtn' href=register.html?teamid=" + teamId + ">Register</a>"
    $("#detailBtnGroup").append(regBtn)
    let editBtn = "<a class='btn btn-outline-warning mr-1 ml-1 mt-4' id='editBtn' href=edit.html?teamid=" + teamId + ">Edit</a>"
    $("#detailBtnGroup").append(editBtn)
    let cancelBtn = "<a class='btn btn-outline-danger ml-1 mt-4' id='cancelBtn' href=courses.html>Cancel</a>"
    $("#detailBtnGroup").append(cancelBtn)
})