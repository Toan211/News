$(function() {
  $("form[name='login']").validate({
    rules: {
      username: {
        required: true,
      },
      password: {
        required: true,
      }
    },
    messages: {
      username: "Please enter username",
    
      password: {
        required: "Please enter password",
      }
    },
    submitHandler: function(form) {
      form.submit();
    }
  });
  hiddenNotify(".close");
});

function hiddenNotify(close_btn_selector){
  $(close_btn_selector).on('click', function(){
      $(this).parent().css({'display':'none'});
  })    
}

    