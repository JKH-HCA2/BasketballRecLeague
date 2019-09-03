"use strict";

$(function () {
	// var stores the url params in a variable
	let urlParams = new URLSearchParams(location.search);
	// courseid is parsed from the url and stored in a variable
	let teamId = urlParams.get("teamid");

	getLeagues();

	let objs;
	
	if (teamId == null) {
		$("#membRegForm input").attr("readonly", true);
		$("input[name='gender']").prop("disabled", true);
		$("#submitMember").prop("disabled", true);
		$("#teamWarningDiv").show();

		$("#membRegForm").hide();
		$("#teamRegForm").show();
		
	} else {
		$.getJSON(`/api/teams/${teamId}`, function (data) {
			objs = data;
			let teamName = objs.TeamName;
			$("#teamName").val(teamName);

			$("#membRegForm").show();
			$("#teamRegForm").hide();

			// Dynamic Error Messages
			let error = `<p class="mb-0">Age must be between ${objs.MinMemberAge} and ${objs.MaxMemberAge}</p>`;
			$("#ageWarningDiv").append(error)
			if (objs.TeamGender == "Male" || objs.TeamGender == "Female")
			{
				error = `<p class="mb-0">The selected team is ${objs.TeamGender} only</p>`
				$("#genderWarningDiv").append(error)
			}
		});

		$("#submitMember").on("click", function () {
			$(".warning-div").hide();
			sendMembData(objs);
		});
		$("#submitTeam").on("click", function()
		{
			$(".warning-div").hide();
			sendTeamData(objs);			
		});
	}

	

	$("teamInput").val(teamId);

	$("input[name='regType']").on("change", function () {
		let selected = $("input[name='regType']:checked", "#formSelector").val();
		if (selected == "Team") {
			$("#membRegForm").hide();
			$("#teamRegForm").show();
		} else {
			$("#membRegForm").show();
			$("#teamRegForm").hide();
		}
	});
});

function getLeagues() {
	$.getJSON("/api/leagues", leagues => {
		$.each(leagues, (index, league) => {
			$("#leagueSelector").append(
				$("<option />")
					.text(league.Name)
					.attr("value", league.Name)
			);
		});
	});
}

function sendTeamData(objs) {
	let isok = teamFormValidation(objs)
	if (isok == false) {
		return;
	}

	// Data from the add course form is posted to the server
	$.post("/api/teams", $("#registrationForm").serialize(), function (data) {
		data = JSON.parse(data);
		location.href = "details.html?teamid=" + data.TeamId;
	});
	return false;
}

function sendMembData(objs) {
	let isok = memberFormValidation(objs);
	if (isok == false) {
		return;
	}
	// var stores the url params in a variable
	let urlParams = new URLSearchParams(location.search);
	// courseid is parsed from the url and stored in a variable
	let teamId = urlParams.get("teamid");

	$.post(
		`/api/teams/${teamId}/members`,
		$("#registrationForm").serialize(),
		function (data) {
			location.href = "details.html?teamid=" + teamId;
		}
	);
	return false;
}

function memberFormValidation(objs) {
	let emailTest = /^([a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})){1}(;[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,}))*$/;
	let nameTest = /^([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]*)+[ ]([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]+)+$/;
	let phoneTest = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/

	let isok = true;

	if (objs.Members.length = objs.MaxTeamMembers) {
		$("#teamFullDiv").show()
		isok = false;
	}
	
	let userEmail = $.trim($("#emailInput").val());
	if (userEmail == "") {
		$("#emailWarningDiv").show();
		isok = false;
	} else if (emailTest.test(userEmail) == false) {
		$("#emailWarningDiv").show();
		isok = false;
	}

	let userName = $.trim($("#nameInput").val());
	if (userName == "") {
		$("#nameWarningDiv").show();
		isok = false;
	} else if (nameTest.test(userName) == false) {
		$("#nameWarningDiv").show();
		isok = false;
	}

	let userContactName = $.trim($("#contactNameInput").val());
	if (userContactName == "") {
		$("#contactWarningDiv").show();
		isok = false;
	} else if (nameTest.test(userContactName) == false) {
		$("#contactWarningDiv").show();
		isok = false;
	}

	let userAge = Number($.trim($("#ageInput").val()));
	if (userAge == "") {
		$("#ageWarningDiv").show();
		isok = false;
	} else if (userAge < Number(objs.MinMemberAge)) {		
		$("#ageWarningDiv").show();
		isok = false;
	} else if (userAge > Number(objs.MaxMemberAge)) {
		$("#ageWarningDiv").show();
		isok = false;
	}

	let userGender = $("input[name='gender']:checked")
	if (checkRadioBtn() == false) {
		$("#genderWarningDiv").show();
		isok = false;
	}
	else if (objs.TeamGender == "Male" || objs.TeamGender == "Female")
	{
		if (userGender != objs.TeamGender)
		{
			$("#genderWarningDiv").show()
			isok = false;
		}
	}

	let userPhone = $.trim($("#phoneInput").val())
	if (userPhone == "") {
		$("#phoneWarningDiv").show();
		isok = false;
	} else if (phoneTest.test(userPhone) == false) {
		$("#phoneWarningDiv").show();
		isok = false;
	}
	return isok;
}

function teamFormValidation(objs)
{
	let emailTest = /^([a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})){1}(;[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,}))*$/;
	let nameTest = /^([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]*)+[ ]([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]+)+$/;
	let phoneTest = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/

	let isok = true;

	

	let teamName = $.trim($("#teamNameInput").val());
	if (teamName == "") {
		$("#teamNameWarningDiv").show();
		isok = false;
	} else if (teamName.length < 5) {
		$("#teamNameWarningDiv").show();
		isok = false;
	}

	if (checkLeagueDropdown() == false) {
		$("#leagueWarningDiv").show();
		isok = false;
	}

	let managerName = $.trim($("#managerNameInput").val());
	if (managerName == "") {
		$("#managerNameWarningDiv").show();
		isok = false;
	} else if (nameTest.test(managerName) == false) {
		$("#managerNameWarningDiv").show();
		isok = false;
	}

	let managerPhone = $.trim($("#phoneInput").val())
	if (managerPhone == "") {
		$("#managerPhoneWarningDiv").show();
		isok = false;
	} else if (phoneTest.test(managerPhone) == false) {
		$("#managerPhoneWarningDiv").show();
		isok = false;
	}

	let managerEmail = $.trim($("#managerEmailInput").val());
	if (managerEmail == "") {
		$("#managerEmailWarningDiv").show();
		isok = false;
	} else if (emailTest.test(managerEmail) == false) {
		$("#managerEmailWarningDiv").show();
		isok = false;
	}

	let minInputAge = Number($.trim($("#minAge").val()));
	if (minInputAge == "" || minInputAge < 0 || minInputAge > 100 || minInputAge > maxInputAge) {
		$("#minAgeWarningDiv").show();
		isok = false;
	}
	let maxInputAge = Number($.trim($("#maxAge").val()));
	if (maxInputAge == "" || maxInputAge < 0 || maxInputAge > 100 || maxInputAge < minInputAge) {
		$("#maxAgeWarningDiv").show();
		isok = false;
	}

	let maxMembers = $.trim($("#maxMembers").val())
	if (maxMembers < 5 || maxMembers > 15 ) {
		$("#maxMembersWarningDiv").show()
		isok = false;
	}

	if (checkGenderDropdown() == false) {
		$("#genderSelectWarningDiv").show();
		isok = false;
	}

	
	return isok;
}

function checkRadioBtn() {
	return $("input[type=radio]:checked").length > 0;
}

function checkLeagueDropdown()
{
	return $("select[name='leaguecode'] option:selected").index() > 0;
}

function checkGenderDropdown()
{
	return $("select[name='teamgender'] option:selected").index() > 0;
}
