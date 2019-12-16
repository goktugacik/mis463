
$(document).ready(function(){
  BindControls();//Add autocomplete to the new field
  //HTML code of the input field to be added saved in a variable
  var fieldHTML = '<div class="form-row"><div class="col-5"> <input type="text" name="city[]" class="form-control city" placeholder="City" required> </div> <div class="col-4"> <input type="number" name="city[]" class="form-control" placeholder="Days" min="1" required> </div> <div class="col-2"> <button type="button" class="btn btn-danger remove">X</button> </div> </div> ';
  //HTML code of the button to be added saved in a variable
  var calculateButtonHTML = '<div class="form-row"><input type="submit" id="calculateButton" class="btn btn-dark" value="Calculate"> </div>';

  //When add button is clicked
  $("#addButton").click(function(){
    $("#calculateButton").parent('div').remove();//Remove calculateButtonHTML
    $('#toAppend').append(fieldHTML); //Add field html
    $('#toAppend').append(calculateButtonHTML); //Add calculateButtonHTML
    BindControls(); //Add autocomplete to the new field
  });

  //When remove button is clicked
  $('#toAppend').on('click', '.remove', function(e){
    e.preventDefault(); //Prevent page from refreshing
    $(this).parent('div').parent('div').remove(); //Remove fieldHTML
    BindControls(); //Add autocomplete to the new field
  });

  //When the form is submitted
  $('#toAppend').submit(function(e){
    e.preventDefault();
    $.ajax({
      //Send a POST request to /handle_data URL
      url:'/handle_data',
      type:'post',
      data:$('#toAppend').serialize(),
      //When request returns a response
      success:function(response){
        var totalCost = 0;
        var totalFligtCost = 0;
        var totalHotelCost = 0;
        console.log(response);
        console.log(typeof response +  " " + typeof response.Best);
        var resultBest = response.Best;

        var resultArray = [];

        for(var i in resultBest){
          var inner = []
          for(var j in resultBest [i]){
            inner.push(resultBest [i][j]);
          }
          inner.push(i);
          resultArray.push(inner);
        }

        console.log("Before: " + resultArray);
        resultArray.sort(function(a,b) {
                        return a[0]-b[0]
                    });
        console.log(resultArray);

        $('#results').empty();
        var resultDate = new Date($('#datePicker').val());
        resultDateFormatted = getFormattedDate(resultDate);
        var currentCity = $('#startCity').val();
        $('#results').append( '<div class="timeContainer left"><div class="content"><h6>'+resultDateFormatted+'</h6><p>You have started your trip from <strong>'+currentCity+'</strong> </p></div></div>' );

        for (var i = 0; i < resultArray.length; i++)
        { var cityArray = resultArray[i];
          var day = cityArray[0];
          var flightCost = cityArray[1];
          var hotelCost = cityArray[2];
          var currentCity = cityArray[3];
          totalFligtCost += flightCost;
          totalHotelCost += hotelCost;
          totalCost += totalFligtCost+totalHotelCost;
          currentDate = addDays(resultDate, day-1);
          currentDate = getFormattedDate(currentDate);
          if (i==resultArray.length-1)
          $('#results').append( '<div class="timeContainer left"><div class="content"><h6>'+currentDate+'</h6><p>You have returned to <strong>'+currentCity+' </strong></p><p>You have spent<strong> '+flightCost+'&#8378</strong>for this flight </p></div></div>' );
          else if (i%2==1)
          $('#results').append( '<div class="timeContainer left"><div class="content"><h6>'+currentDate+'</h6><p>You have flied to <strong>'+currentCity+' </strong></p><p>You have spent <strong>'+flightCost+'&#8378</strong> for this flight </p><p>You have spent <strong>'+hotelCost+'&#8378</strong> for accomodaiton </p></div></div>' );
          else
          $('#results').append( '<div class="timeContainer right"><div class="content"><h6>'+currentDate+'</h6><p>You have flied to <strong>'+currentCity+' </strong></p><p>You have spent <strong>'+flightCost+'&#8378</strong> for this flight </p><p>You have spent <strong>'+hotelCost+'&#8378</strong> for accomodaiton </p></div></div>' );
        }

      }
    });
  });

});

//Adds autocomplete to fields
function BindControls() {
  var Cities = [
    "Amsterdam",
    "Vienna",
    "Milan",
    "Paris",
    "Prague",
    "Rome",
    "Dublin",
    "Barcelona",
    "London"
  ];

  $('.form-control.city').autocomplete({
    source: Cities,
    minlength: 1,
    //If selected items value does not match an item from the list removes it
    change: function(event, ui) {
      if (ui.item == null) {
        $(this).val("");
        $(this).focus();
      }
    }
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
