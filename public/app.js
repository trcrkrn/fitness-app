var MOCK_FOOD = {
    "food_log": [
        {
            "id": 11122,
            "brand_name": "Similac",
            "item_name": "Formula, Soy, for Diarrhea, Ready-to-Feed",
            "item_id": "51db37c3176fe9790a899200",
            "nf_servings_per_container": null,
            "nf_serving_size_qty":  5,
            "nf_serving_size_unit":"fl oz",
            "metric_qty": null,
            "metric_uom": null,
            "nf_calories": 100,
            "user": 1234,
            "date": Date(1521060237),
            "comment": "mmm, tastes great",
            "user_qty": 1,
        },
        {
            "id": 11122,
            "brand_name": "Similac",
            "item_name": "Formula, Soy, for Diarrhea, Ready-to-Feed",
            "item_id": "51db37c3176fe9790a899200",
            "nf_servings_per_container": null,
            "nf_serving_size_qty":  5,
            "nf_serving_size_unit":"fl oz",
            "metric_qty": null,
            "metric_uom": null,
            "nf_calories": 100,
            "user": 1234,
            "date": Date(1521062237),
            "comment": "mmm, tastes great",
            "user_qty": 2
        }
    ]
}

var MOCK_ACTIVITY = {
    "activityLog": [
        {
        "activityId": 18240,
        "calories":1476,
        "description":"",
        "distance":0,
        "duration":10983000,
        "name":"Swimming laps, freestyle, slow, moderate or light effort",
        "user": 1234,
        "date": Date(1521060237),
        "comment": "swam",
        "userDuration": 1800000
    },
    {
        "activityId": 18240,
        "calories":1476,
        "description":"",
        "distance":0,
        "duration":10983000,
        "name":"Swimming laps, freestyle, slow, moderate or light effort",
        "user": 1234,
        "date": Date(1521080237),
        "comment": "swam",
        "userDuration": 1000000
    },
    {
        "activityId": 18240,
        "calories":1476,
        "description":"",
        "distance":0,
        "duration":10983000,
        "name":"Swimming laps, freestyle, slow, moderate or light effort",
        "user": 1235,
        "date": Date(1521070237),
        "comment": "swam",
        "userDuration": 1500000
    }]
}

function getUserActivityCalories(user, date) {
    let filteredActivities = MOCK_ACTIVITY.activityLog;
    filteredActivities = filteredActivities.filter(activity => activity.user === user && activity.date === date);
    let userActivityCalories = [];
    filteredActivities.forEach(function(activity) {
        let ratio = activity.calories / activity.duration;
        userActivityCalories.push(ratio * activity.userDuration);
    })
// to do: filter events based on user and date
    return userActivityCalories.reduce(function(total, num) {
        return Math.round(total + num)
    //figure out user calories based on an activity using getUserActivityCalories() and getUserFoodCalories()
    })
}

function getUserFoodCalories(user, date) {
    let filteredFood = MOCK_FOOD.food_log;
    filteredFood = filteredFood.filter(food => food.user === user && food.date === date);
    let userFoodCalories = [];
    filteredFood.forEach(function(food) {
        userFoodCalories.push(food.nf_calories * food.user_qty)
    })
    return userFoodCalories.reduce(function (total, num) {
        return Math.round(total + num)
    })
}

function getLogObject(user, date) {
    return { "id": Date.now(),
        "caloriesBurned": getUserActivityCalories(user,date), 
        "date": date, 
        "caloriesConsumed": getUserFoodCalories(user, date),
    }
}

function getRecentLogs(callback) {
    //replace with real datavase call
    let logs = [getLogObject(1234, Date(1521070237))];
    callback(logs);
}

function displayLogs(dataLogs) {
    for (index in dataLogs) {
        $('#daily-calories').append(
            `<p>Calories burned: ${dataLogs[index].caloriesBurned}</p>
            <p>Calories consumed: ${dataLogs[index].caloriesConsumed}</p>`
        )
    }
}

function getAndDisplayLogs() {
    getRecentLogs(displayLogs);
}

$(function() {
    getAndDisplayLogs();
})

//sliders

var ageSlider = document.getElementById("age-slider");
var ageOutput = document.getElementById("age-output");
ageOutput.innerHTML = ageSlider.value;
ageSlider.oninput = function() {
    ageOutput.innerHTML = this.value;
}

var weightSlider = document.getElementById("weight-slider");
var weightOutput = document.getElementById("weight-output");
weightOutput.innerHTML = weightSlider.value;
weightSlider.oninput = function() {
    weightOutput.innerHTML = this.value;
}

var heightSlider = document.getElementById("height-slider");
var heightOutput = document.getElementById("height-output");
heightOutput.innerHTML = heightSlider.value;
heightSlider.oninput = function() {
    heightOutput.innerHTML = this.value;
}

var durationSlider = document.getElementById("duration-slider");
var durationOutput = document.getElementById("duration-output");
durationOutput.innerHTML = durationSlider.value;
durationSlider.oninput = function() {
    durationOutput.innerHTML = this.value;
}

//Natural nutrients api

const nutrionixApiKey = "3ccd5cb21784384417d0b108f86f90e0";

const applicationId = "cb91c8a4";

function getLoggedInUsername() {
    return "trckrn"
}

const naturalNutrientsUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients";
const searchInstantUrl = "https://trackapi.nutritionix.com/v2/search/instant";
const exerciseUrl = "https://trackapi.nutritionix.com/v2/natural/exercise";

function getNaturalNutrientsApi(searchTerm, callback) {
    const query = {
        "query": searchTerm,
        "x-app-id": applicationId,
        "x-app-key": nutrionixApiKey,
        "x-remote-user-id": getLoggedInUsername()
    };
    return jQuery.getJSON(naturalNutrientsUrl, query, callback)  
};

//Exercise API

function getExerciseApi(searchTerm, callback) {
    const query = {
        "query": searchTerm,
        "x-user-jwt": ,
        "gender": ,
        "weight_kg",
        "height_cm":,
        "age":,
    };
    return jQuery.getJSON(exerciseUrl, query, callback)
};



//Demo

$(function demoClick() {
    $("#demo-button").on("click", function() {
        $("#login-screen").hide();
        $("#profile-screen").show();
    });
})

//BMR calculation

let bmr;
let adjustedMr;

function findMr() {
    let adjustedWeight;
    let height = heightSlider.value;
    if ($('input[name="gender"]:checked').val() == "female") {
        if (height >= 60) {
            adjustedWeight = 100 + (5 * (height - 60));
        };
        if (height < 60) {
            adjustedWeight = 100 - (-5 * (height - 60))
        }; 
        bmr = adjustedWeight * 10;
        adjustedMr = bmr + bmr * ($('input[name="activity-level"]:checked').val());
    };
    if ($('input[name="gender"]:checked').val() == "male") {
        if (height >= 60) {
            adjustedWeight = 100 + (6 * (height - 60))
        };
        if (height < 60) {
            adjustedWeight = 100 - (-6 * (height - 60))
        }; 
        bmr = adjustedWeight * 11;
        adjustedMr = bmr + bmr * ($('input[name="activity-level"]:checked').val());
    };
    console.log(adjustedMr);
}

$(function profileSubmit() {
    $("#profile-submit").on("click", function() {
        findMr();
        $("#profile-screen").hide();
        $("#home-screen").show();
        $("#recommended-calories").append((
            `<span>Recommended daily caloric intake: ${adjustedMr}</span>`
        ))
    });
})

//buttons on acreens

$(function newActivity() {
    $("#new-activity").on("click", function() {
        $("#home-screen").hide();
        $("#activity-screen").show();
    })
})

$(function newMeal() {
    $("#new-meal").on("click", function() {
        $("#home-screen").hide();
        $("#meal-screen").show();
    })
});

$(function newInfo() {
    $("#new-info").on("click", function() {
        $("#home-screen").hide();
        $("#profile-screen").show();
    })
})

$(function submitNewActivity() {
    $("#submit-new-activity").on("click", function() {
        $("#activity-screen").hide();
        $("#home-screen").show();
    })
})

$(function submitNewMeal() {
    $("#submit-new-meal").on("click", function() {
        $("#meal-screen").hide();
        $("#home-screen").show();
    })
})

