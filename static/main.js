
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

        var resultBest = JSON.stringify(response.Best);
        console.console.log(typeof resultBest);
        console.log(resultBest["Route Details"]);

        $('#results').empty();
        var resultDate = new Date($('#datePicker').val());
        $('#results').append( resultDate );
        $('#results').append( $('#startCity').val() );

        $('.form-control.city').each(function(){
          var resultCity = $(this).val();

          console.log();
        });

        $('#results').append("<br> ***** <br>");
        $('#results').append(resultBest);
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
