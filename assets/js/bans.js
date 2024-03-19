$('#banuser').on('submit', function(e) {
	e.preventDefault();
	
   
    var url = $(this).attr('action');
     var sndData = $('#ban-user input').serialize();
     console.log(sndData);
     console.log("url should be "+url);
     //alert ($(this).attr('method'),true);
     //return;
     $.ajax({
		type: $(this).attr('method'),
		url: url,
		data: sndData,
		//async: false,
		dataType: "json",
		success:  function(data){
			console.log("in success");
			console.log(data);
        }
	});
});

 $('input[type=checkbox]').on('change', function(){
    var name =    $(this).attr('name');
    if($(this).is(':checked')){
    $('input[name= "' +name +'"]').val(true);
        $(this).val(true);
    }
    else{
       $(this).val(false);
       $('input[name= "' +name +'"]').val(false);
    }
    alert (name+" set to "+$(this).val(),true);
});
 
 