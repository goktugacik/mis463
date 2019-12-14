

$(document).ready(function(){
  BindControls();
  var counter = 1; //Initial field counter is 1
  var addButton = $('.add_button'); //Add button selector
  var fieldHTML = '<div class="form-row"><div class="col-5"> <input type="text" name="city[]" class="form-control city" placeholder="City" required> </div> <div class="col-4"> <input type="number" name="city[]" class="form-control" placeholder="Days" min="1" required> </div> <div class="col-2"> <button type="button" class="btn btn-danger remove">X</button> </div> </div> '; //New input field html
  var calculateButtonHTML = '<div class="form-row"><input type="submit" id="calculateButton" class="btn btn-dark" value="Calculate"> </div>';

  //Once add button is clicked
  $("#addButton").click(function(){
    counter++; //Increment field counter
    $("#calculateButton").parent('div').remove();
    $('#toAppend').append(fieldHTML); //Add field html
    $('#toAppend').append(calculateButtonHTML); //Add calculateButton html
    BindControls();
  });


  //Once remove button is clicked
  $('#toAppend').on('click', '.remove', function(e){
    e.preventDefault();
    $(this).parent('div').parent('div').remove(); //Remove field html
    x--; //Decrement field counter
    BindControls();
  });


  $('#toAppend').submit(function(e){
    e.preventDefault();
    $.ajax({
      url:'/handle_data',
      type:'post',
      data:$('#toAppend').serialize(),
      success:function(response){
        console.log(response);
        var printable = JSON.stringify(response["Best"]);

        $('#results').empty();

        $('#results').append("***** <br>");
        $('#results').append(printable);
      }
    });
  });

});

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
    change: function(event, ui) {
      if (ui.item == null) {
        $(this).val("");
        $(this).focus();
      }
    }
  });
}
