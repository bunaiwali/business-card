var count = {
  base_url: null,
  viewCount: 0, 
  type: "",
  showDefaultColor: false,
  init: () => {
    $("#countViewBox").hide();
    if(window.location.href.includes('t=demo')){
      $("#countViewBox").show();
      $("#countView").text('Views : 0');
    }
    else{
      $.ajax({
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          cardLink: window.location.href,
          url: window.location.href,

        }),
        url: "/viewCount?cardLink=" + window.location.href,
        success: function (data) {
          if (data.showViewCount) {
            $("#countViewBox").show();
            $("#countView").text(`Views : ${data.result.views}`);
            $("#countView").css("color", "#000");
            $(".countView").css("width", "100px")
            $("#countView").css("font-size", "10px");
          }
          else {
            $("#countViewBox").hide();
          }

        }
      });
    }
  }
}