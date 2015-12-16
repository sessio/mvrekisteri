$(function() {
  $("#form_submit").click(function(e) {
    e.preventDefault();
    var name = $("#name").val().trim().toLowerCase();
    var phone = $("#phone").val();
    var query = {};
    if (name) query.name = md5(name);
    if (phone) query.phone = md5(phone);
    setState("waiting");
    $.get('/api/find', { query: query }, function(data) {
      var results = data.results;
      $("#input_form").hide();
      if (results.length == 0) {
        $("#resultstext").text("Ei löytynyt tietoja.");
      } else {
        $("#resultstext").text("Löytyi "+results.length+ " tietuetta antamillasi tiedoilla. Pirauta fobballe!");
      }
      setState("finished");
    },
    "json");
    console.log("querying");
  });

  $("#reset_query").click(function(e) {
    e.preventDefault();
    setState("start");
  });
});

function setState(state) {
  if (state === "start") {
    $(".state_start").show();
    $(".state_results").hide();
    $(".state_waiting").hide();
  } else if (state === "finished") {
    $(".state_start").hide();
    $(".state_waiting").hide();
    $(".state_results").show();
  } else if (state === "waiting") {
    $(".state_start").hide();
    $(".state_results").hide();
    $(".state_waiting").show();
  }
};
;
