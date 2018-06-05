function getUserActivityCalories(user, date) {
    let filteredActivities = MOCK_ACTIVITY.activityLog;
    filteredActivities = filteredActivities.filter(activity => activity.user === user && activity.date === date);
    let userActivityCalories = [];
    filteredActivities.forEach(function (activity) {
        let ratio = activity.calories / activity.duration;
        userActivityCalories.push(ratio * activity.userDuration);
    })
    // to do: filter events based on user and date
    return userActivityCalories.reduce(function (total, num) {
        return Math.round(total + num)
        //figure out user calories based on an activity using getUserActivityCalories() and getUserFoodCalories()
    })
}

function getUserFoodCalories(user, date) {
    let filteredFood = MOCK_FOOD.food_log;
    filteredFood = filteredFood.filter(food => food.user === user && food.date === date);
    let userFoodCalories = [];
    filteredFood.forEach(function (food) {
        userFoodCalories.push(food.nf_calories * food.user_qty)
    })
    return userFoodCalories.reduce(function (total, num) {
        return Math.round(total + num)
    })
}

function getLogObject(user, date) {
    return {
        "id": Date.now(),
        "caloriesBurned": getUserActivityCalories(user, date),
        "date": date,
        "caloriesConsumed": getUserFoodCalories(user, date),
    }
}

function getRecentLogs(callback) {
    //replace with real database call
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

$(function () {
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
ageSlider.oninput = function () {
    age = this.value;
    $(ageOutput).html(age);
}

var weightSlider = document.getElementById("weight-slider");
var weightOutput = document.getElementById("weight-output");
weightOutput.innerHTML = weightSlider.value + " lbs";
weightSlider.oninput = function () {
    weight = this.value;
    weightKg = Math.round(weight * 0.45359237);
    $(weightOutput).html(weight + ` lbs (${weightKg} kg)`);
};

var heightSlider = document.getElementById("height-slider");
var heightOutput = document.getElementById("height-output");
heightOutput.innerHTML = heightSlider.value + " in";
heightSlider.oninput = function () {
    height = this.value;
    heightCm = Math.round(height * 2.54);
    $(heightOutput).html(height + ` in (${heightCm} cm)`)
}

// var durationSlider = document.getElementById("duration-slider");
// var durationOutput = document.getElementById("duration-output");
// durationOutput.innerHTML = durationSlider.value;
// durationSlider.oninput = function () {
//     durationOutput.innerHTML = this.value;
// }

//Demo

$(function demoClick() {
    $("#demo-button").on("click", function () {
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
}



//buttons on screens

$(function showPassword() {
    $("#password-checkbox").on("click", function () {
        let password = document.getElementById("password");
        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        };
    });
})

$(function signUp() {
    $("#sign-up-button").on("click", function () {
        $("#login-screen").hide();
        $("#profile-screen").show()
    })
})

$(function loginButton() {
    $("#login-button").on("click", function () {
        $("#login-screen").hide();
        $("#home-screen").show();
    })
})

$(function profileSubmit() {
    $("#profile-submit").on("click", function () {
        findMr();
        $("#profile-screen").hide();
        $("#home-screen").show();
        $("#recommended-calories").append((
            `<span>Recommended daily caloric intake: ${adjustedMr}</span>`
        ))
    });
})

$(function newActivity() {
    $("#new-activity").on("click", function () {
        $("#home-screen").hide();
        $("#activity-screen").show();
    })
})

$(function newMeal() {
    $("#new-meal").on("click", function () {
        $("#home-screen").hide();
        $("#meal-screen").show();
    })
});

$(function newInfo() {
    $("#new-info").on("click", function () {
        $("#home-screen").hide();
        $("#profile-screen").show();
    })
})

$(function submitNewActivity() {
    $("#submit-new-activity").on("click", function () {
        $("#activity-screen").hide();
        $("#home-screen").show();

    })
})

$(function submitNewMeal() {
    $("#submit-new-meal").on("click", function () {
        $("#meal-screen").hide();
        $("#home-screen").show();
    })
})

