$(document).ready(function(){
    var counter = 1; //Initial field counter is 1
    var addButton = $('.add_button'); //Add button selector
    var fieldHTML = '<div class="form-row"> <div class="col-4"> <input type="text" name="city[]" class="form-control" placeholder="City"> </div> <div class="col-2"> <input type="text" name="city[]" class="form-control" placeholder="Days"> </div> <div class="col-2"> <button type="button" class="btn btn-danger remove">X</button> </div> </div> '; //New input field html
    var calculateButtonHTML = '<div class="form-row"><input type="submit" id="calculateButton" class="btn btn-dark" value="Calculate"> </div>';

  //Once add button is clicked
    $("#addButton").click(function(){

          counter++; //Increment field counter
          $("#calculateButton").parent('div').remove();
          $('#toAppend').append(fieldHTML); //Add field html
          $('#toAppend').append(calculateButtonHTML); //Add calculateButton html

  });


    //Once remove button is clicked
    $('#toAppend').on('click', '.remove', function(e){
        e.preventDefault();
        $(this).parent('div').parent('div').remove(); //Remove field html
        x--; //Decrement field counter
    });


    $('#toAppend').submit(function(e){
    e.preventDefault();
    $.ajax({
        url:'/handle_data',
        type:'post',
        data:$('#toAppend').serialize(),
        success:function(response){
            console.log(response);
        }
    });
});

});
