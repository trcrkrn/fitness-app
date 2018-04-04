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

let age;
let weight;
let height;
let weightKg;
let heightCm;

var ageSlider = document.getElementById("age-slider");
var ageOutput = document.getElementById("age-output");
ageOutput.innerHTML = ageSlider.value;
ageSlider.oninput = function() {
    age = this.value;
    $(ageOutput).html(age);
}

var weightSlider = document.getElementById("weight-slider");
var weightOutput = document.getElementById("weight-output");
weightOutput.innerHTML = weightSlider.value;
weightSlider.oninput = function() {
    weight = this.value;
    weightKg = Math.round(weight * 0.45359237);
    $(weightOutput).html(weight + ` lbs (${weightKg} kg)`);
};

var heightSlider = document.getElementById("height-slider");
var heightOutput = document.getElementById("height-output");
heightOutput.innerHTML = heightSlider.value;
heightSlider.oninput = function() {
    height = this.value;
    heightCm = Math.round(height * 2.54);
    $(heightOutput).html(height + ` in (${heightCm} cm)`)
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

function getNutrionixJson(url, query, callback, type) {
    return $.ajax({
        type: type, 
        dataType: "JSON",
        beforeSend: function(request) {
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

function getExerciseApi(searchTerm, callback) {
    const query = {
        "query": searchTerm,
        "gender": $('input[name="gender"]:checked').val(),
        "weight_kg": weightKm,
        "height_cm": heightCm,
        "age": age,
    };
    return getNutrionixJson(exerciseUrl, query, callback, "post")
};

//SEarch instant API

function getSearchInstant(searchTerm, callback) {
    const query = {
        "query": searchTerm,
        "branded": true ,
        "brand_ids": false,
        "self": true, //include users food log results
        "common": true, //include common food results
        "locale": "en_US",
        "detailed": false,
    //     "branded-region": null,
    //     "branded-type": null,
    };
    return getNutrionixJson(searchInstantUrl, query, callback, "get")
}

//Demo

$(function demoClick() {
    $("#demo-button").on("click", function() {
        $("#login-screen").hide();
        $("#profile-screen").show();
        console.log(height);
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



//buttons on screens

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

$(function addNewMeal() {
    $("#add-food").on("click", function() {
        let queryFoodTarget = $("form").find("#food-search");
        let food = queryFoodTarget.val();
        getSearchInstant(food, createMealLog)
    })
})

function createMealLog(food) {
    console.log(food);
    if (!food.branded) {
        return;
    } else {
        for (i = 0; i < food.branded.length; i++) {
            if (food.branded[i].photo.thumb == null) {
                $("#meal-log").append("<p>" + food.branded[i].food_name + "</p>");
            } else {
                $("#meal-log").append("<p>" + food.branded[i].food_name + "<img src=" + food.branded[i].photo.thumb + "></p>")
        };
    };
    if (!food.common) {
        return;
    } else {
        for (i = 0; i < food.common.length; i++) {
            if (food.common[i].photo.thumb == null) {
                $("#meal-log").append("<p>" + food.common[i].food_name + "</p>");
            } else {
                $("#meal-log").append("<p>" + food.common[i].food_name + "<img src=" + food.common[i].photo.thumb + "></p>")
                };
            };
        }; 
    };
};

let previousSearchTerm;

$(function autocompleteFood() {
    $(document).keypress(function(event) {
        console.log("keypressed: ", String.fromCharCode(event.charCode || event.keyCode));
        if (!$("#food-search:focus").length) return;
        let food = $(this).val();
        if (food === previousSearchTerm) return;
        console.log("Searching for: ", food);
        getNaturalNutrientsApi(food, createMealLog)
        previousSearchTerm = food;
    })
})

//use settimeout


// dropdown button 

// $(function dropdownFood () {
//     $("#food-search")
// })

// $(function searchFoodByLetter () {
//     $("#food-search").
// })