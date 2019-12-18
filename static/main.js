
$(document).ready(function(){
  BindControls();//Add autocomplete to the new field
  //HTML code of the input field to be added saved in a variable
  var fieldHTML = '<div class="form-row"><div class="col-5"> <input type="text" name="city[]" class="form-control city" placeholder="City" required> </div> <div class="col-4"> <input type="number" name="city[]" class="form-control" placeholder="Days" min="1" required> </div> <div class="col-2"> <button type="button" class="btn btn-danger remove">X</button> </div> </div> ';
  //HTML code of the button to be added saved in a variable
  var calculateButtonHTML = '<div class="form-row"><input type="submit" id="calculateButton" class="btn myColor" value="Calculate"> </div>';


  $("#loadingOut").append('<div id="loadingIn" class="loadingio-spinner-spinner-i8ngzccnmes"><div class="ldio-art9qaeoagl"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>');
  $("#loadingIn").hide();
  $("#accordion").hide();

  var currentHeight =   $("#full").height() + $("#calculator").height();
  $("#particles-js").css({ 'height': currentHeight + "px" });

  //When add button is clicked
  $("#addButton").click(function(){
    $("#calculateButton").parent('div').remove();//Remove calculateButtonHTML
    $('#toAppend').append(fieldHTML); //Add field html
    $('#toAppend').append(calculateButtonHTML); //Add calculateButtonHTML
    BindControls(); //Add autocomplete to the new field
    var currentHeight =   $("#full").height() + $("#calculator").height();
    $("#particles-js").css({ 'height': currentHeight + "px" });

  });

  //When remove button is clicked
  $('#toAppend').on('click', '.remove', function(e){
    e.preventDefault(); //Prevent page from refreshing
    $(this).parent('div').parent('div').remove(); //Remove fieldHTML
    BindControls(); //Add autocomplete to the new field
    var currentHeight =   $("#full").height() + $("#calculator").height();
    $("#particles-js").css({ 'height': currentHeight + "px" });
  });

  //When the form is submitted
  $('#toAppend').submit(function(e){
    e.preventDefault();
    $("#loadingIn").show();

    var currentHeight =   $("#full").height() + $("#calculator").height();
    $("#particles-js").css({ 'height': currentHeight + "px" });
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 1200);
    $.ajax({
      //Send a POST request to /handle_data URL
      url:'/handle_data',
      type:'post',
      data:$('#toAppend').serialize(),
      //When request returns a response
      success:function(response){
        console.log( response);

        var resultBest = response.Best;
        var resultSecond = response.Second;
        var resultThird = response.Third;
        console.log("Best");
        console.log(resultBest);
        console.log("Second");
        console.log(resultSecond);
        console.log("Third");
        console.log(resultThird);

        $("#loadingIn").hide();
        $("#appearHere").empty();
        $("#appearHere").append('<h4>You can click on result to display your cost and timeline.</h4>');
        $("#accordion").show();

        fillResults(resultBest,"1");
        fillResults(resultSecond,"2");
        if (Object.keys(response).length > 2){
          fillResults(resultThird,"3");
        }
        else {
          $("#results3").append('<h4>There are only 2 results add more cities to get alternative routes.</h4>');
        }



      }
    });
  });

  $("#scrollToDiv").click(function() {
    $('html, body').animate({
      scrollTop: $("#calculator").offset().top
    }, 1200);
  });

});

//Adds autocomplete to fields
function BindControls() {
  var Cities = [
    "Amsterdam ",
    "Barcelona ",
    "Dublin ",
    "London ",
    "Milan ",
    "Paris ",
    "Prague ",
    "Rome ",
    "Vienna "
  ];
  var selectedCities=[];
  $('#toAppend *').filter(':input').each(function(){
    selectedCities.push(this.value);
  });
  var difference = Cities.filter(x => !selectedCities.includes(x));

  $('.form-control.city').autocomplete({
    minlength: 0,
    source: difference,

    //If selected items value does not match an item from the list removes it
    change: function(event, ui) {
      selectedCities=[];
      $('#toAppend *').filter(':input').each(function(){
        selectedCities.push(this.value);
      });
      difference = Cities.filter(x => !selectedCities.includes(x));
      //console.log(difference);

      $('.form-control.city').autocomplete("option", { source: difference });

      if (ui.item == null) {
        $(this).val("");
        $(this).focus();
      }
    }
  }).focus(function() {
    //console.log("current2"+$(this).val());
    $(this).autocomplete("search", " ");
  });

  $(".collapse").on('shown.bs.collapse', function(){
    console.log("shown");
    var currentHeight =   $("#full").height() + $("#calculator").height();
    console.log(currentHeight);
    $("#particles-js").css({ 'height': currentHeight + "px" });
  });

  $(".collapse").on('hidden.bs.collapse', function(){
    console.log("hidden");
    var currentHeight =   $("#full").height() + $("#calculator").height();
    console.log(currentHeight);
    $("#particles-js").css({ 'height': currentHeight + "px" });
  });


}

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return day + '/' + month + '/' + year;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function fillResults(resultBest,index){
  var totalCost = 0;
  var totalFligtCost = 0;
  var totalHotelCost = 0;
  var resultArray = [];
  var selector = "#results"+index;

  for(var i in resultBest){
    var inner = []
    for(var j in resultBest [i]){
      inner.push(resultBest [i][j]);
    }
    inner.push(i);
    resultArray.push(inner);
  }


  resultArray.sort(function(a,b) {
    return a[2]-b[2]
  });
  var lasT=resultArray[resultArray.length-1];
  lasT.splice( 5, 0, lasT[lasT.length-1]);
  console.log(resultArray);

  $(selector).empty();
  var resultDate = new Date($('#datePicker').val());
  resultDateFormatted = getFormattedDate(resultDate);
  var currentCity = $('#startCity').val();
  $(selector).append( '<div class="timeContainer left"><div class="content"><h6>'+resultDateFormatted+'</h6><p>You have started your trip from <strong>'+currentCity+'</strong> </p></div></div>' );

  for (var i = 0; i < resultArray.length; i++)
  { var cityArray = resultArray[i];
    var arrivalTime = cityArray[0];
    var companyName = cityArray[1];
    var day = cityArray[2];
    var departureTime = cityArray[3];
    var flightCost = cityArray[4];
    var hotelName = cityArray[5];
    var hotelCost = cityArray[6];
    var currentCity = cityArray[7];
    totalFligtCost += flightCost;
    totalHotelCost += hotelCost;

    currentDate = addDays(resultDate, day-1);
    currentDate = getFormattedDate(currentDate);

    if(i>0){
      var fromCityArray = resultArray[i-1];
      var fromCity = fromCityArray[7];
    }


    if (i==resultArray.length-1)
    $(selector).append('<div class="timeContainer left"> <div class="content"> <h6>'+currentDate+'</h6> <p>You have flied from <strong>'+fromCity+' </strong> to <strong>'+currentCity+' </strong></p> <p>Flight Info > Departure: <strong>'+departureTime+' </strong> Arrival: <strong>'+arrivalTime+' </strong> Company: <strong>'+companyName+'</p></strong> <p>You have spent <strong>'+flightCost+'&#8378</strong> for this flight </p> </div></div>');
    else  if(i==0)
    $(selector).append( '<div class="timeContainer left"><div class="content"><h6>'+currentDate+'</h6><p>You have flied from <strong>'+$('#startCity').val()+' </strong> to <strong>'+currentCity+' </strong></p><p>Flight Info > Departure: <strong>'+departureTime+' </strong> Arrival: <strong>'+arrivalTime+' </strong> Company: <strong>'+companyName+'</p></strong> <p>You have spent <strong>'+flightCost+'&#8378</strong> for this flight </p><p>You have spent <strong>'+hotelCost+'&#8378</strong> for accommodation in <strong>'+currentCity+' </strong> at <strong>'+hotelName+'</strong></p></div></div>' );
    else
    $(selector).append( '<div class="timeContainer left"><div class="content"><h6>'+currentDate+'</h6><p>You have flied from <strong>'+fromCity+' </strong> to <strong>'+currentCity+' </strong></p><p>Flight Info > Departure: <strong>'+departureTime+' </strong> Arrival: <strong>'+arrivalTime+' </strong> Company: <strong>'+companyName+'</p></strong> <p>You have spent <strong>'+flightCost+'&#8378</strong> for this flight </p><p>You have spent <strong>'+hotelCost+'&#8378</strong> for accommodation in <strong>'+currentCity+' </strong> at <strong>'+hotelName+'</strong></p></div></div>' );

  }
  var prependString=""
  prependString += '<div class="row"><div class="col"><h4>Cost for flights:<br> <span class="badge myColor">' + totalFligtCost + '₺</span></h4></div>' ;
  prependString += '<div class="col"><h4>Cost for hotel:<br> <span class="badge myColor">' + totalHotelCost + '₺</span></h4></div>' ;
  totalCost=totalFligtCost+totalHotelCost;
  prependString += '<div class="col"><h4>Total cost:<br> <span class="badge myColor">'+totalCost+'₺</span></h4></div></div>';
  $(selector).prepend(prependString);

  var currentHeight =   $("#full").height() + $("#calculator").height();
  $('#accordion').show();
  $("#particles-js").css({ 'height': currentHeight + "px" });
  return;
}
