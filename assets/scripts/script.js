$(document).ready(function () { //DOM ready function
    //Menu Items
        //Food
        $('#food').click(function(){
            event.preventDefault();
            foodPage();
        });
        //Drink
        $('#drink').click(function(){
            event.preventDefault();
            drinkPage();
        });

    //FoodButton displays food search page
    $('#foodButton').click(function(){
        foodPage();
    });

    function foodPage(){
            //1. Empty the contents of the main container
            $('#mainContainer').empty();
    
            //2. Build food search page
            var foodSearchDiv = $('<div>').attr('class', 'ui raised very padded text container segment');
            $('#mainContainer').append(foodSearchDiv);
            var foodSearchHeader = $('<h2>').attr('class', 'ui header').text('Search for what you\'re craving');
            foodSearchDiv.append(foodSearchHeader);
            var foodInputDiv = $('<div>').attr('class', 'ui fluid action input');
            foodSearchDiv.append(foodInputDiv);
            var foodSearchInput = $('<input>').attr({type: 'text', id: 'foodInputValue', placeholder: 'What are you in the mood for..?'});
            foodInputDiv.append(foodSearchInput);
            var foodSearchButton = $('<div>').attr({class: 'ui button foodSearch', id: 'startFoodSearch'}).text('Search');
            foodInputDiv.append(foodSearchButton);
    
            //3. Add event listener to the search button
            $('#startFoodSearch').on('click', function(){
                event.preventDefault();
                event.stopPropagation();
                    console.log('Food search button was clicked');
                var searchIngredient = $('#foodInputValue').val();
                    console.log('The search ingredient is: ', searchIngredient);
                var ingredientURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + searchIngredient;
                    console.log('This search URL = ', ingredientURL);
                var theseMealResults = [];    
                    console.log('theseMealResults before the ajax call = ', theseMealResults);
                $.ajax({
                    url: ingredientURL,
                    method: "GET",
                    success: function(result){
                            console.log('This is the meal result object', result);
                            console.log('This is the result.meals array ', result.meals);
                            console.log('The result.meals length = ', (result.meals).length);
                        for (var i = 0; i < (result.meals).length; i++){
                            //4. Loop through the results to retrieve necessary variables.
                            //5. Create an array of objects
                            var thisMealName = result.meals[i].strMeal;
                                console.log('thisMealName ' + i + ' = ' + thisMealName);
                            var thisMealPic = result.meals[i].strMealThumb;
                                console.log('thisMealPic ' + i + ' = ' + thisMealPic);
                            var thisMealObject = {'name': thisMealName, 'pic': thisMealPic} ;
                                //console.log('thisMealObject ' + i + ' = ' + JSON.stringify(thisMealObject));
                            theseMealResults.push(thisMealObject);   
                                console.log('theseMealResults after iteration ' + i + ' = ' + theseMealResults);
                        }
                        //6. Pass these results to a function that can render the results onto the page.
                        renderFoodResults(theseMealResults, searchIngredient);
                    },
                    error: function(){
                        alert('There has been an error.');
                    }
                });  
                
            });
    };

    function renderFoodResults(myData, searchIngredient){
        //Empty main container
        $('#mainContainer').empty();
        //Parse object
        console.log('This is myData inside the renderFoodResults function: ', myData);
        //Build search results cards
        var foodResultMainContainer = $('<div>').attr('class', 'ui two column grid');
        $('#mainContainer').append(foodResultMainContainer);
        var foodResultHeading = $('<h2>').attr('class', 'ui header').text('Your Results for: ' + searchIngredient);
        foodResultMainContainer.append(foodResultHeading);

        for(var i = 0; i < myData.length; i++){
            //Retrieve data from meal results object
            var mealResultCardTitle = myData[i].name;
                console.log('Meal name ', i,  ' = ', mealResultCardTitle);
            var mealResultCardPic = myData[i].pic;
                console.log('Meal pic ' + i + ' = ' + mealResultCardPic);
                
            //Build result cards
            var resultCardContainer = $('<div>').attr('class', 'column');
            foodResultMainContainer.append(resultCardContainer);

            var innerCardContainer = $('<div>').attr('class', 'ui fluid card');
            resultCardContainer.append(innerCardContainer);

            var mealResultImageContainer = $('<div>').attr('class', 'image');
            innerCardContainer.append(mealResultImageContainer);

            var mealResultImage = $('<img>').attr({src: mealResultCardPic, id: i});
            mealResultImageContainer.append(mealResultImage);

            var mealResultTitleContainer = $('<div>').attr('class', 'content');
            innerCardContainer.append(mealResultTitleContainer);

            var mealResultTitle = $('<h2>').attr('class', 'header').text(mealResultCardTitle);
            mealResultTitleContainer.append(mealResultTitle);

            var saveMealStar = $('<i>').attr('class', 'right floated star icon');
            saveMealStar.attr('data-index', i);
            mealResultTitle.append(saveMealStar);
        }

        $('img').click(function(){
            //$('#mainContainer').empty();
                console.log('The food image has been clicked.')
            var thisID = $(this).attr('id');
                console.log('This image has an id = ', thisID);
            var recipeSearchValue = myData[thisID].name;
                console.log('This recipeSearchValue = ', recipeSearchValue);
            var thisRecipeURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + recipeSearchValue;
                console.log('This recipeURL = ', thisRecipeURL);

            //call the API to retrieve the recipe
            $.ajax({
                url: thisRecipeURL,
                method: "GET",
                success: function(result){
                        console.log('This is the recipe result object', result);
                        console.log('This is the result.meals array ', result.meals);
                        console.log('The result.meals length = ', (result.meals).length);
                    
                        //4. Loop through the results to retrieve necessary variables.
                        var myRecipes = [];

                        for (var i = 0; i < (result.meals).length; i++ ){
                        
                        var thisRecipeName = result.meals[i].strMeal;
                            console.log('thisRecipeName ' + i + ' = ' + thisRecipeName);
                        var thisRecipePic = result.meals[i].strMealThumb;
                            console.log('thisRecipePic ' + i + ' = ' + thisRecipePic);
                        var thisRecipeYouTube = result.meals[i].strYoutube;
                            console.log('thisRecipeYouTube ' + i + ' = ' + thisRecipeYouTube);
                        var thisRecipeDirections = (result.meals[i].strInstructions).split('\r\n');
                            console.log('thisRecipeDirectionsArray = ', thisRecipeDirections );
                        var thisRecipeIngredients = [];

                        for (j = 1; j < 21; j++){ 
                                var thisStrMeasure = ('strMeasure' + j);
                                    console.log('thisStrMeasure = ', thisStrMeasure);
                                var thisStrIngredient = ('strIngredient' + j);
                                    console.log('thisStrIngredient = ', thisStrIngredient);
                            if (result.meals[i][thisStrMeasure] !== '' && result.meals[i][thisStrMeasure] !== null){
                                var thisMeasure = result.meals[i][thisStrMeasure];
                                    console.log('This measaure ' + j + ' = ', thisMeasure);
                                var thisIngredient = result.meals[i][thisStrIngredient];
                                    console.log('This ingredient ' + j + ' = ' + thisIngredient);
                                var finalIngredient = (thisMeasure + ' ' + thisIngredient);
                                    console.log('finalIngredien ' + j + ' = ' + finalIngredient);
                                thisRecipeIngredients.push(finalIngredient);
                                    console.log('thisRecipeIngredients after iteration ' + i + ' = ' + thisRecipeIngredients);
                            } else {
                                break;
                            }

                        }
                        var thisRecipeObject = {'recipeName': thisRecipeName, 
                        'recipePic': thisRecipePic,
                        'recipeYouTube': thisRecipeYouTube,
                        'recipeDirections' : thisRecipeDirections,
                        'recipeIngredients' : thisRecipeIngredients
                        } ;
                        
                        myRecipes.push(thisRecipeObject);   
                            console.log('thisRecipeObject after iteration ' + i + ' = ' + JSON.stringify(thisRecipeObject));
                    }
                    //6. Pass these results to a function that can render the results onto the page.
                    //renderRecipeResults(thisRecipeObject);
                },
                error: function(){
                    alert('There has been an error.');
                }
            }); 

        });

        $('.star').click(function(){
            console.log('The star has been clicked.')
            var recipeToSave = $(this).attr('data-index');
            console.log('The id for the recipe = ', recipeToSave);

            //setLocalStorage(theseMealResults, recipeToSave);
        });
    }

///////////////////***DRINK SECTION***///////////////////
$('#drinkButton').click(function(){
    drinkPage();
});

function drinkPage(){
    //1. Empty the contents of the main container
    $('#mainContainer').empty();

    //2. Build drink search page
    var drinkSearchDiv = $('<div>').attr('class', 'ui raised very padded text container segment');
    $('#mainContainer').append(drinkSearchDiv);
    var drinkSearchHeader = $('<h2>').attr('class', 'ui header').text('What are you thirsty for?');
    drinkSearchDiv.append(drinkSearchHeader);
    var drinkInputDiv = $('<div>').attr('class', 'ui fluid action input');
    drinkSearchDiv.append(drinkInputDiv);
    var drinkSearchInput = $('<input>').attr({type: 'text', id: 'drinkInputValue', placeholder: 'Enter your beverage...'});
    drinkInputDiv.append(drinkSearchInput);
    var drinkSearchButton = $('<div>').attr({class: 'ui button drinkSearch', id: 'startDrinkSearch'}).text('Search');
    drinkInputDiv.append(drinkSearchButton);

    //3. Add event listener to the search button
    $('#startDrinkSearch').on('click', function(){
        event.preventDefault();
        event.stopPropagation();
            console.log('Drink search button was clicked');
        var searchIngredient = $('#drinkInputValue').val();
            console.log('The search ingredient is: ', searchIngredient);
        var ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchIngredient;
            console.log('This search URL = ', ingredientURL);
        var theseDrinkResults = [];    
            console.log('theseDrinkResults before the ajax call = ', theseDrinkResults);
        $.ajax({
            url: ingredientURL,
            method: "GET",
            success: function(result){
                    console.log('This is the drink result object', result);
                    console.log('This is the result.drinks array ', result.drinks);
                    console.log('The result.drinks length = ', (result.drinks).length);
                for (var i = 0; i < (result.drinks).length; i++){
                    //4. Loop through the results to retrieve necessary variables.
                    //5. Create an array of objects
                    var thisDrinkName = result.drinks[i].strDrink;
                        console.log('thisDrinkName ' + i + ' = ' + thisDrinkName);
                    var thisDrinkPic = result.drinks[i].strDrinkThumb;
                        console.log('thisDrinkPic ' + i + ' = ' + thisDrinkPic);
                    var thisDrinkObject = {'name': thisDrinkName, 'pic': thisDrinkPic} ;
                        //console.log('thisDrinkObject ' + i + ' = ' + JSON.stringify(thisDrinkObject));
                    theseDrinkResults.push(thisDrinkObject);   
                        console.log('theseDrinkResults after iteration ' + i + ' = ' + theseDrinkResults);
                }
                //6. Pass these results to a function that can render the results onto the page.
                renderDrinkResults(theseDrinkResults, searchIngredient);
            },
            error: function(){
                alert('There has been an error.');
            }
        });  
        
    });
};

function renderDrinkResults(myData, searchIngredient){
    //Empty main container
    $('#mainContainer').empty();
    //Parse object
    //console.log('This is myData for the drink inside the renderDrinkResults function: ', myData);
    //Build search results cards
    var drinkResultMainContainer = $('<div>').attr('class', 'ui two column grid');
    $('#mainContainer').append(drinkResultMainContainer);
    var drinkResultHeading = $('<h2>').attr('class', 'ui header').text('Your Results for: ' + searchIngredient);
    drinkResultMainContainer.append(drinkResultHeading);

    for(var i = 0; i < myData.length; i++){
        //Retrieve data from meal results object
        var drinkResultCardTitle = myData[i].name;
            console.log('Drink name ', i,  ' = ', drinkResultCardTitle);
        var drinkResultCardPic = myData[i].pic;
            console.log('Drink pic ' + i + ' = ' + drinkResultCardPic);
            
        //Build result cards
        var resultCardContainer = $('<div>').attr('class', 'column');
        drinkResultMainContainer.append(resultCardContainer);

        var innerCardContainer = $('<div>').attr('class', 'ui fluid card');
        resultCardContainer.append(innerCardContainer);

        var drinkResultImageContainer = $('<div>').attr('class', 'image');
        innerCardContainer.append(drinkResultImageContainer);

        var drinkResultImage = $('<img>').attr({src: drinkResultCardPic, id: i});
        drinkResultImageContainer.append(drinkResultImage);

        var drinkResultTitleContainer = $('<div>').attr('class', 'content');
        innerCardContainer.append(drinkResultTitleContainer);

        var drinkResultTitle = $('<h2>').attr('class', 'header').text(drinkResultCardTitle);
        drinkResultTitleContainer.append(drinkResultTitle);

        var saveDrinkStar = $('<i>').attr('class', 'right floated star icon');
        saveDrinkStar.attr('data-index', i);
        drinkResultTitle.append(saveDrinkStar);
    }

    $('img').click(function(){
        //$('#mainContainer').empty();
            console.log('The drink image has been clicked.')
        var thisID = $(this).attr('id');
            console.log('This image has an id = ', thisID);
        var drinkSearchValue = myData[thisID].name;
            console.log('This drinkSearchValue = ', drinkSearchValue);
        var thisDrinkURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + drinkSearchValue;
            console.log('This drinkURL = ', thisDrinkURL);

        //call the API to retrieve the recipe
        $.ajax({
            url: thisDrinkURL,
            method: "GET",
            success: function(result){
                    console.log('This is the drink result object', result);
                    console.log('This is the result.drinks array ', result.drinks);
                    console.log('The result.drinks length = ', (result.drinks).length);
                
                    //4. Loop through the results to retrieve necessary variables.
                    var myDrinks = [];

                    for (var i = 0; i < (result.drinks).length; i++ ){
                    
                    var thisDrinkName = result.drinks[i].strDrink;
                        console.log('thisDrinkName ' + i + ' = ' + thisDrinkName);
                    var thisDrinkPic = result.drinks[i].strDrinkThumb;
                        console.log('thisDrinkPic ' + i + ' = ' + thisDrinkPic);
                    var thisDrinkDirections = (result.drinks[i].strInstructions).split('\r\n');
                        console.log('thisDrinkDirectionsArray = ', thisDrinkDirections );
                    var thisDrinkIngredients = [];

                    for (j = 1; j < 21; j++){ 
                            var thisStrMeasure = ('strMeasure' + j);
                                console.log('thisStrMeasure = ', thisStrMeasure);
                            var thisStrIngredient = ('strIngredient' + j);
                                console.log('thisStrIngredient = ', thisStrIngredient);
                        if (result.drinks[i][thisStrMeasure] !== '' && result.drinks[i][thisStrMeasure] !== null){
                            var thisMeasure = result.drinks[i][thisStrMeasure];
                                console.log('This measaure ' + j + ' = ', thisMeasure);
                            var thisIngredient = result.drinks[i][thisStrIngredient];
                                console.log('This ingredient ' + j + ' = ' + thisIngredient);
                            var finalIngredient = (thisMeasure + ' ' + thisIngredient);
                                console.log('finalIngredient ' + j + ' = ' + finalIngredient);
                            thisDrinkIngredients.push(finalIngredient);
                                console.log('thisDrinkIngredients after iteration ' + i + ' = ' + thisDrinkIngredients);
                        } else {
                            break;
                        }

                    }
                    var thisDrinkObject = {'drinkName': thisDrinkName, 
                    'drinkPic': thisDrinkPic,
                    'drinkDirections' : thisDrinkDirections,
                    'drinkIngredients' : thisDrinkIngredients
                    } ;
                    
                    myDrinks.push(thisDrinkObject);   
                        console.log('thisDrinkObject after iteration ' + i + ' = ' + JSON.stringify(thisDrinkObject));
                }
                //6. Pass these results to a function that can render the results onto the page.
                //renderDrinkResults(thisDrinkObject);
            },
            error: function(){
                alert('There has been an error.');
            }
        }); 

    });

    $('.star').click(function(){
        console.log('The star has been clicked.')
        var drinkToSave = $(this).attr('data-index');
        console.log('The id for the drink = ', drinkToSave);

        //setLocalStorage(theseDrinkResults, drinkToSave);
    });
}

}); //close Document Ready Function