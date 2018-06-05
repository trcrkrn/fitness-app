const suggestionFoodTemplate = function (suggestion) {
    return `<p>${suggestion.food_name}</p>`
}

function getFoodSuggestions(searchTerm, callback) {
    let foodSuggestions = [];
    let foodJson = getSearchInstant(searchTerm, callback);
    console.log(foodJson);
    if (!foodJson.branded) {
        return;
    } else {
        for (i = 0; i < foodJson.branded.length; i++) {
            foodSuggestions.push(foodJson.branded[i].food_name);
        };
    };
    if (!food.common) {
        return;
    } else {
        for (i = 0; i < foodJson.common.length; i++) {
            foodSuggestions.push(foodJson.common[i].food_name);
        };
    };
    if (foodSuggestions = []) return;
    else return {
        data: foodSuggestions
    };
};

let currentMeal = [];

//add meal to log with date, not sure if it works

function renderFood(food) {
    let dateCreated = new Date();
    console.log("inside renderFood", food);
    return ("<div class='fooditem'><h4>" + dateCreated + "</h4><p>" + food.food_name + "</p><p>" + food.nf_calories + "</p></div>")
}

// function addFood(food) {
//     $("#meal-log").append(renderFood(food))
// }

function addFood(food) {
    currentMeal.push(food);
    $("#meal-log").html(currentMeal.map(renderFood));
}

//
function addFoodSuggestion(suggestion) {
    $("#meal-log").append("<p>" + suggestion + "</p>")
}

$(function autocompleteFood() {
    let foodSuggestions = [];
    $('#food-search').typeahead({
        minLength: 3,
        highlight: true,
        name: 'food',
        limit: 6,
        templates: {
            notFound: notFoundTemplate,
            pending: pendingTemplate,
            header: headerTemplate,
            footer: footerTemplate,
            suggestion: suggestionFoodTemplate
        },
        async: true,
        source: function (query, syncResults, asyncResults) {
            console.log("typeahead searching on: " + query);
            getFoodSuggestions(query, function (results) {
                foodSuggestions.length = 0;
                for (i = 0, j = 0; i < results.branded.length || j < results.common.length; i++, j++) {
                    if (i < results.branded.length) {
                        foodSuggestions.push(results.branded[i])
                    }
                    if (j < results.common.length) {
                        foodSuggestions.push(results.common[j])
                    }
                };
                console.log("found food suggestion: " + foodSuggestions);
                syncResults(foodSuggestions.map(food => food.food_name));
            });
        },
        afterSelect: function (suggestion) {
            getNaturalNutrientsApi(suggestion, function (results) {
                console.log("user selected nutrients: " + suggestion, results)
                //translate into food object
                let food;
                if (Array.isArray(results.foods)) {
                    food = results.foods.find(f => f.food_name === suggestion)
                }
                else {
                    food = {food_name: "food not found", nf_calories: 0, created: Date()};
                }
                addFood(food);
            });
        }
    });
})

//get full nutitrionix object, get from nutr
function getFoodsFromForm() {
    //gets current meal array and transform
    return currentMeal.map(function(food) {
        return {
            "calories": food.nf_calories,
            "servings": Number,
            "description": String,
            "name": String,
            "date": Date,
            "foodId": Number,
        }
    })
}

function postMealsApi(meal, callback) {
    const query = {
        "calories": meal.nf_calories,
        "description": meal.sugestion,
        "name": meal.name,
        "foods": meal.foods
        //later ask user for date on client side before submitting to my api and maybe nutrionix
    };
    return $.ajax({
        type: "POST",
        dataType: "JSON",
        url: "/api/meals",
        data: query,
        success: callback
    });
}

$(function submitMeal() {
    $("#meal-form").on("submit", function() {
        postMealsApi({
            "name": $("#meal-name").val().trim(),
            "foods": getFoodsFromForm(),
        }, function successResponse(response){

        })

        .fail(function(error){
            console.log(error)
        })
    });
})



//have global array of current meal for addFood