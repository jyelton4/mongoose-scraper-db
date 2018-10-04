// When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        // title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#"+thisId).val()
        }
      })
      // With that done
      .then(function(data) {
        console.log(data);
        $.ajax({
          method: "GET", 
          url: "/"
        });
      });
  });

  $(document).on("click", ".delete-btn", function() {
    var thisId = $(this).attr('data-id');

    $.ajax({
      type: "POST",
      url: "/delete/" + thisId
    })
    .then(function(resp) {
      console.log(resp);
    })
  })