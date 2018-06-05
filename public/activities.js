//autocomplete activities

const suggestionActivityTemplate = function (suggestion) {
    return `<div>${suggestion.activity_name}</div>`
}

function getActivitySuggestions(searchTerm, callback) {
    let activitiesSuggestions = [];
    let activitiesJson = getActivitiesApi(searchTerm, callback);
    console.log(activitiesJson);
    if (!activitiesJson) {
        return;
    } else {
        for (i = 0; i < activitiesJson.length; i++) {
            activitiesSuggestions.push(activitiesJson[i].activity_name);
        };
    };
};

// function getNutrionixJson(url, query, callback, type) {
//     return $.ajax({
//         type: type,
//         dataType: "JSON",
//         beforeSend: function (request) {
//             request.setRequestHeader("x-app-id", applicationId);
//             request.setRequestHeader("x-app-key", nutrionixApiKey);
//             request.setRequestHeader("x-remote-user-id", 0)
//         },
//         url: url,
//         data: query,
//         success: callback
//     });
// }

function postActivityApi(exercise, callback) {
    const query = {
        "calories": exercise.nf_calories,
        "duration": exercise.duration_min,
        "description": exercise.sugestion,
        "name": exercise.name,
        "activityId": exercise.tag_id,
        //later ask user for date on client side before submitting to my api and maybe nutrionix
    };
    return $.ajax({
        type: "POST",
        dataType: "JSON",
        url: "/api/activities",
        data: query,
        success: callback
    });
}

$(function submitActivity() {
    $("#activity-form").on('submit',function(event) {
        let suggestion = $("#activity-search").val();
            console.log("user selected: " + suggestion);
            getActivitiesApi(suggestion, function (results) {
                //converting from nutritionix api to my api
                console.log("user selected activities: " + suggestion, results)
                if (results.exercises && results.exercises.length) {
                    //later check for multiple search results and treat it as a suggestion list for later clicking
                    let excercise = results.exercises[0];
                    exercise.suggestion = suggestion;
                    postActivityApi(exercise, function(response) {
                        //all done, add to users activity log, trigger refresh of ui showing new acitivity in log
                        //add rendered ativity to list or get whole list of activities and redraw
                        console.log("finished posting new activity", response)
                    })
                }
            });
    });
})

