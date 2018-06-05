//Natural nutrients api

const nutrionixApiKey = "3ccd5cb21784384417d0b108f86f90e0";
const applicationId = "cb91c8a4";

function getLoggedInUsername() {
    return "trckrn"
}

const naturalNutrientsUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients";
const searchInstantUrl = "https://trackapi.nutritionix.com/v2/search/instant";
const exerciseUrl = "https://trackapi.nutritionix.com/v2/natural/exercise";

function getNutrionixJson(url, query, callback, type) {
    return $.ajax({
        type: type,
        dataType: "JSON",
        beforeSend: function (request) {
            request.setRequestHeader("x-app-id", applicationId);
            request.setRequestHeader("x-app-key", nutrionixApiKey);
            request.setRequestHeader("x-remote-user-id", 0)
        },
        url: url,
        data: query,
        success: callback
    });
}

function getNaturalNutrientsApi(searchTerm, callback) {
    const query = {
        "query": searchTerm,
    };
    return getNutrionixJson(naturalNutrientsUrl, query, callback, "post")
};

//Exercise API



function getActivitiesApi(searchTerm, callback) {
    const query = {
        "query": searchTerm,
        "gender": $('input[name="gender"]:checked').val(),
        "weight_kg": $('input[name="weight-slider"]').val(),
        "height_cm": $('input[name="height-slider"]').val(),
        "age": $('input[name="age-slider"]').val(),
    };
    return getNutrionixJson(exerciseUrl, query, callback, "post")
};

//Search instant API

function getSearchInstant(searchTerm, callback) {
    const query = {
        "query": searchTerm,
        "branded": true,
        "brand_ids": false,
        "self": true, //include users food log results
        "common": true, //include common food results
        "locale": "en_US",
        "detailed": false,
        //     "branded-region": null,
        //     "branded-type": null,
    };
    if (query === null) return;
    return getNutrionixJson(searchInstantUrl, query, callback, "get")
}
