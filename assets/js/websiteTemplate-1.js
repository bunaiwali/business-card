//js file
$(document).ready(function () {
  // For User Contact Form
  $("#submit").on("click", function (e) {
    $("#submitForm").validate({
      rules: {
        userName: {
          required: true,
        },
        userNumber: {
          required: true,
          minlength: 10,
          maxlength: 10,
        },
        userEmail: {
          required: true,
          email: true,
        },
        message: {
          required: true,
        },
      },

      messages: {
        userName: {
          required: "Enter Your Name",
        },
        userNumber: {
          required: "Enter Your Mobile Number",
        },
        userEmail: {
          required: "Enter Your Email Address",
        },
        message: {
          required: "Enter Your Message",
        },
      },
      submitHandler: function () {
        submitForm();
        $("#submitForm").trigger("reset");
      },
    });

    function submitForm() {
      let object = {
        userName: $("#userName").val(),
        userEmail: $("#userEmail").val(),
        userNumber: $("#userNumber").val(),
        message: $("#message").val(),
        senderMail: $(".emailPara").text(),
      };

      $.ajax({
        type: "POST",
        url: `${baseUrl}/api/sendMail`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(object),
        success: function (data) {
          toastr.success("Enquiry Sent Successfully!");
        },
        error: function (xhr, textStatus, errorThrown) {
          toastr.error("Error sending the enquiry. Please try again.");
        },
      });
    }
  });

  $("#userNumber").on("keypress", function (event) {
    const pattern = /[0-9]/; // Only allow numeric characters
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  let lastId = window.location.href;

  // let lastId = window.location.href.split("/").pop();

  // if (lastId.includes("?t=")) {
  //     lastId = lastId.split("?")[0];
  // }

  // for scrolling section
  setTimeout(() => {
    let scrollUrl = window.location.href.split("/").pop();

    if (scrollUrl.includes("#contactUs")) {
      window.scrollBy(0, 1800);
    } else if (scrollUrl.includes("#home")) {
      window.scrollBy(0, 0);
    } else if (scrollUrl.includes("#about")) {
      window.scrollBy(0, 500);
    } else if (scrollUrl.includes("#imageGallery")) {
      window.scrollBy(0, 1100);
    } else if (scrollUrl.includes("#UPI")) {
      window.scrollBy(0, 1600);
    }
  }, 100);

  let pageType = params.t;

  const validateUrl = (str) => {
    var tarea = str;
    if (!tarea) {
      return "";
    }
    if (tarea.indexOf("http://") == 0 || tarea.indexOf("https://") == 0) {
      return str;
    } else {
      return "http://" + str;
    }
  };

  const liveData = async (lastId) => {
    try {
        let response = await $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: `${baseUrl}/getWebsiteCardDetailsById?cardLink=${lastId}`,
        });

        if (!response.data) {
console.log("Inisde")
            const modifiedLastId = lastId.replace('www.', '');
            if (modifiedLastId) { // Ensure modification was done
                response = await $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: `${baseUrl}/getWebsiteCardDetailsById?cardLink=${modifiedLastId}`,
                });
            }
        }

        if (response.data) {
console.log("Else")
            renderLiveData(response);
        } else {
            console.log("No data found for both original and modified IDs.");
        }
    } catch (err) {
        console.log(err);
    }
};


  async function renderLiveData(data){
      let businessLogo = data.data.cardInfo.logo;
      let company_name = data.data.cardInfo.name;
      let business_tagline = data.data.cardInfo.tagline;
      let business_extra_info = data.data.cardInfo.extra_information
        ? data.data.cardInfo.extra_information
        : "";
      let customFile = data.data.customFile;
      let customFilePath = data.data.customFilePath;

      if (data.data.isPurchased === true) {
        $(".bg-img2").hide();
        $("#downloadPdf").show();
        $(".container").hide();
        $(".conatctUs .formWrapper").css({
          margin: "20px auto !important",
        });
      } else {
        $("#downloadPdf").show();
        $(".bg-img2").show();
        $(".container").show();
        $(".conatctUs .formWrapper").css({
          margin: "20px auto 120px auto",
        });
      }

      if (customFile != null && customFile != "") {
        $(".fileCta").show();

        $(".fileUrl").attr("href", customFile);
        $(".fileUrl").html(data.data.fileLabel);
      }

      if (data.data.showWatermark) {
        $(".adb-footer").css({
          display: "flex",
        });
      }

      $(".businessLogo").attr("src", businessLogo);
      $(".businessName").text(company_name);

      if (business_tagline === "" || !business_tagline) {
        $(".businessTitle").hide();
      } else {
        $(".businessTitle").show();
      }

      if (business_extra_info === "" || !business_extra_info) {
        $(".businessDesc").find("p").hide();
      } else {
        $(".businessDesc").find("p").show();
      }

      $(".businessTitle").text(business_tagline);
      $(".businessDesc").text(business_extra_info);

      if (
        data.data.cardInfo.mobileNumber == "" ||
        !data.data.cardInfo.mobileNumber
      ) {
        $("#mobileNumber").remove();
      }
      let mobileNumber = data.data.cardInfo.mobileNumber;
      if (mobileNumber.length === 10) {
        mobileNumber = "+91" + mobileNumber;
      } else if (mobileNumber.length === 12) {
        mobileNumber = "+" + mobileNumber;
      }
      $("#mobileNumber").attr("href", `tel:${mobileNumber}`);
      $("#mobileNumber")
        .find(".contactpara")
        .text(data.data.cardInfo.mobileNumber);

      if (data.data.cardInfo.email == "" || !data.data.cardInfo.email) {
        $("#Email").remove();
      }
      $("#Email").attr("href", `mailto:${data.data.cardInfo.email}`);
      $("#Email").find(".emailPara").text(`${data.data.cardInfo.email}`);

      if (data.data.cardInfo.website == "" || !data.data.cardInfo.website) {
        $("#Website").remove();
      } else {
        $("#Website").show();
      }
      $("#Website").attr(
        "href",
        `${validateUrl(data.data.cardInfo.website)}`
      );

      $(".websitePara").text(
        data.data.cardInfo.website.startsWith("https://")
          ? data.data.cardInfo.website.slice("https://".length)
          : data.data.cardInfo.website
      );

      if (data.data.business_address == "" || !data.data.business_address) {
        $("#locationPara").remove();
      }

      $("#Location")
        .find(".locationPara")
        .text(`${data.data.cardInfo.address}`);
      if (
        !data.data.cardInfo.addressUrl ||
        data.data.cardInfo.addressUrl == ""
      ) {
        $("#Location").attr(
          "href",
          `https://maps.google.com/?q=${data.data.cardInfo.address}`
        );
      } else {
        $("#Location").attr(
          "href",
          validateUrl(data.data.cardInfo.addressUrl)
        );
      }

      //   facebook
      if (data.data.cardInfo.facebook == "" || !data.data.cardInfo.facebook) {
        $("#facebook").remove();
      } else {
        $("#facebook").show();
      }
      $("#facebook")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.facebook));

      // justDial
      // if (
      //     data.data.cardInfo.facebook == "" ||
      //     !data.data.cardInfo.facebook
      // ) {
      //     $("#justDial").remove();
      // } else {
      //     $("#justDial").show();
      // }
      // $("#justDial")
      //     .find("a")
      //     .attr("href", validateUrl(""));

      // telegram
      if (data.data.cardInfo.telegram == "" || !data.data.cardInfo.telegram) {
        $("#telegram").remove();
      } else {
        $("#telegram").show();
      }
      $("#telegram")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.telegram));

      // instagram
      if (
        data.data.cardInfo.instagram == "" ||
        !data.data.cardInfo.instagram
      ) {
        $("#instagram").remove();
      } else {
        $("#instagram").show();
      }
      $("#instagram")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.instagram));

      // Whatsapp
      if (
        data.data.cardInfo.whatsappNumber == "" ||
        !data.data.cardInfo.whatsappNumber
      ) {
        $("#Whatsapp").remove();
      } else {
        $("#Whatsapp").show();
      }
      $("#Whatsapp")
        .find("a")
        .attr(
          "href",
          `https://api.whatsapp.com/send/?phone=%2B91${data.data.cardInfo.whatsappNumber}&text=Hello from Digital Business Card&app_absent=0`
        );

      // youtube
      if (data.data.cardInfo.youtube == "" || !data.data.cardInfo.youtube) {
        $(".mediaIcons").append("");
        $("#youtube").remove();
      } else {
        $("#youtube").show();
      }
      $("#youtube")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.youtube));

      // twitter
      if (data.data.cardInfo.twitter == "" || !data.data.cardInfo.twitter) {
        $("#twitter").remove();
      } else {
        $("#twitter").show();
      }
      $("#twitter")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.twitter));

      //   linkedIn
      if (data.data.cardInfo.linkedIn == "" || !data.data.cardInfo.linkedIn) {
        $("#linkedIn").remove();
      } else {
        $("#linkedIn").show();
      }
      $("#linkedIn")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.linkedIn));

      //  gmbusiness
      if (
        data.data.cardInfo.googleMyBusiness == "" ||
        !data.data.cardInfo.googleMyBusiness
      ) {
        $("#gmbusiness").remove();
      } else {
        $("#gmbusiness").show();
      }
      $("#gmbusiness")
        .find("a")
        .attr("href", validateUrl(data.data.cardInfo.googleMyBusiness));

      //  download VCF
      // let lastId = window.location.href.split("/").pop();
      $("#saveContact")
        .find("a")
        .attr("href", `${baseUrl}/generateWebsiteVcf?cardLink=${lastId}`);
      // for website-8
      $("#saveContact").attr(
        "href",
        `${baseUrl}/generateWebsiteVcf?cardLink=${lastId}`
      );

      // For Payment

      const payment = [
        {
          phonePe: data.data.cardInfo.phonePe,
          bharatPe: data.data.cardInfo.bharatPe,
          paytm: data.data.cardInfo.paytm,
          gPay: data.data.cardInfo.gPay,
          amazonPay: data.data.cardInfo.amazonPay,
        },
      ];

      const paymentIds = payment[0];

      for (const [key, value] of Object.entries(paymentIds)) {
        switch (key) {
          case "amazonPay":
            if (value == "" || !value) {
              $("#amazonPay").remove();
            }
            $(".amazonPaytxt").text(value);
            break;

          case "bharatPe":
            if (value == "" || !value) {
              $("#bharatPay").remove();
            }
            $(".bharatPaytxt").text(value);
            break;
          case "gPay":
            if (value == "" || !value) {
              $("#gpay").remove();
            }
            $(".gpaytxt").text(value);
            break;

          case "paytm":
            if (value == "" || !value) {
              $("#paytm").remove();
            }
            $(".paytmtxt").text(value);
            break;

          case "phonePe":
            if (value == "" || !value) {
              $("#phonePe").remove();
            }
            $(".phonePetxt").text(value);
            break;
          default:
        }
      }

      if (
        (paymentIds.amazonPay == "" || !paymentIds.amazonPay) &&
        (paymentIds.bharatPe == "" || !paymentIds.bharatPe) &&
        (paymentIds.gPay == "" || !paymentIds.gPay) &&
        (paymentIds.paytm == "" || !paymentIds.paytm) &&
        (paymentIds.phonePe == "" || !paymentIds.phonePe)
      ) {
        $("#UPI").remove();

        $("#footerUpi").remove();
      }

      // For Product and Services
      let products = data.data.cardInfo.products;

      if (products.length <= 0) {
        $("#productServices").remove();
      }

      for (let i = 0; i < products.length; i++) {
        let productsName;

        if (products[i].productName) {
          productsName = products[i].productName;
        } else {
          productsName = products[i].ProductName;
        }

        let productHtml =
          '<div class="productbox">' +
          '<a href="' +
          products[i].url +
          '" class="card" data-lightbox="models"' +
          'data-title="' +
          productsName +
          " | " +
          products[i].serviceDescription +
          '">' +
          '<img src="' +
          products[i].url +
          '" alt="" data-lightbox="models" />' +
          "</a>" +
          '<p class="productTitle">' +
          productsName +
          "</p>" +
          '<p class="productDesc">' +
          products[i].serviceDescription +
          "</p>" +
          "</div>";
        $(".cardWrapper").append(productHtml);
      }

      // For Gallery Images
      let galleryImg = data.data.cardInfo.images;

      if (galleryImg.length <= 0) {
        $("#imageGallery").remove();

        $("#footerGallery").remove();
      }

      for (let i = 0; i < galleryImg.length; i++) {
        let galleryhtml =
          '<div class="galleryImage">' +
          '<a href="' +
          data.data.cardInfo.images[i] +
          '" data-lightbox="models">' +
          '<img src="' +
          data.data.cardInfo.images[i] +
          '" alt=""  />' +
          "</a>" +
          "</div>";
        $(".galleryWrapper").append(galleryhtml);
      }

      // For video Gallery

      let videoGallery = data.data.cardInfo.videos;
      let youtubeVideos = data.data.cardInfo.youtubeUrl;

      if (
        (videoGallery === undefined && youtubeVideos === undefined) ||
        (videoGallery.length <= 0 && youtubeVideos.length <= 0)
      ) {
        $("#videoGallery").remove();
      }

      if (videoGallery) {
        videoGallery.forEach((url) => {
          let loadvideodata = `<div class="upiWrapper">                   
    <iframe width="420" height="345" src="${url}" frameborder="0" allowfullscreen></iframe>
  </div>`;

          $(".video_gallary").append(loadvideodata);
        });
      }

      if (youtubeVideos) {
        // for youtube videos
        const youtubeUrls = youtubeVideos.map((url) => {
          const match = url.match(
            /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/))(.+?)(?:&|$)/
          );

          if (match) {
            return `https://www.youtube.com/embed/${match[1]}`;
          }

          return url;
        });

        youtubeUrls.forEach((i) => {
          let videodata = `<div class="upiWrapper">                   
    <iframe width="420" height="345" src="${i}" frameborder="0" allowfullscreen></iframe>
  </div>`;

          $(".video_gallary").append(videodata);
        });
      }

      // For About Us Section
      let incomingString = data.data.cardInfo.description;

      if (incomingString <= 0) {
        $("#about").remove();
        $("#footerAbout").remove();
      }

      let checkBold = 0;
      let checkItalic = 0;
      let checkUnderline = 0;
      let lineThrough = 0;
      let currentFont = "Poppins"; // default font family
      let currentSize = "17px";
      let output = "";

      var i = 0;

      incomingString = incomingString.split("");
      for (let char of incomingString) {
        // for font family
        if (char === "@") {
          // Assuming the font name is enclosed in "@" symbols
          let fontName = ""; // extract the font name from the input
          while (++i < incomingString.length && incomingString[i] !== "@") {
            fontName += incomingString[i];
          }
          currentFont = fontName;
          continue; // skip the "@" symbol and font name
        }

        // for bold text
        if (char === "*") {
          if (checkBold === 0) {
            incomingString[
              i
            ] = `<b style="font-family: ${currentFont};font-size: ${currentSize};">`;
            checkBold = 1;
          } else {
            incomingString[i] = "</b>";
            checkBold = 0;
          }
        }

        // for italic text
        if (char === "_") {
          if (checkItalic === 0) {
            incomingString[
              i
            ] = `<i style="font-family: ${currentFont};font-size: ${currentSize};">`;
            checkItalic = 1;
          } else {
            incomingString[i] = "</i>";
            checkItalic = 0;
          }
        }

        // for linethrough text
        if (char === "~") {
          if (lineThrough === 0) {
            incomingString[
              i
            ] = `<span class='linethrough' style="font-family: ${currentFont};font-size: ${currentSize};">`;
            lineThrough = 1;
          } else {
            incomingString[i] = "</span>";
            lineThrough = 0;
          }
        }

        // for underline text
        if (char === "^") {
          if (checkUnderline === 0) {
            incomingString[
              i
            ] = `<span class='underline' style="font-family: ${currentFont};font-size: ${currentSize};">`;
            checkUnderline = 1;
          } else {
            incomingString[i] = "</span>";
            checkUnderline = 0;
          }
        }
        i++;
      }

      let text = incomingString.join().replaceAll(",", "");
      $(".aboutUsDesc").html(
        `<pre style="white-space:pre-wrap;">${text}</pre>`
      );

      // if (incomingString) {
      //   incomingString = incomingString.split("");
      //   let text = incomingString.join().replaceAll(",", "");
      //   $(".aboutUsDesc").html(
      //     `<pre style="white-space:pre-wrap;">${text}</pre>`
      //   );
      // }
  }
  
  // For Demo Data Functionality
  const demoData = async () => {
    try {
      const dummyData = await fetch(
        `${baseUrl}/staticData/staticDemoData.json`
      ).then((response) => response.json());

      // let businessLogo = dummyData.business_logo.replace("http://vbizcard.adbanao.com",  "https://vbizcard.in");
      // let businessLogo = dummyData.business_logo;

      let company_name = dummyData.business_name;
      let business_tagline = dummyData.business_tagline;
      let business_extra_info = dummyData.business_extra_info;
      let multicard_img = dummyData.multicard_img;
      let lorem_text = dummyData.lorem_text;
      // $(".businessLogo").attr("src", businessLogo);
      $(".businessName").text(company_name);
      $(".businessTitle").text(business_tagline);
      $(".businessDesc").text(business_extra_info);

      // for mobile
      let mobile_number = dummyData.mobile_number;
      if (mobile_number.length === 10) {
        mobile_number = "+91" + mobile_number;
      } else if (mobile_number.length === 12) {
        mobile_number = "+" + mobile_number;
      }
      $("#mobileNumber").attr("href", `tel:${mobile_number}`);
      $("#mobileNumber").find(".contactpara").text(mobile_number);

      // for email
      let email = dummyData.email;
      let emailLink = dummyData.emailLink;
      $("#Email").attr("href", `mailto:${emailLink}`);
      $("#Email").find(".emailPara").text(`${email}`);

      // for website
      let website = dummyData.website;
      let wesiteLink = dummyData.wesiteLink;
      $("#Website").attr("href", `${validateUrl(wesiteLink)}`);
      $(".websitePara").text(website);

      // for location
      let business_address = dummyData.business_address;
      $("#Location").find(".locationPara").text(`${business_address}`);
      $("#Location").attr(
        "href",
        `https://maps.google.com/?q=${dummyData.business_address}`
      );

      // facebook
      let facebook = dummyData.facebook;
      $("#facebook").find("a").attr("href", validateUrl(facebook));

      // instagram
      let instagram = dummyData.instagram;
      $("#instagram").find("a").attr("href", validateUrl(instagram));

      //Whatsapp
      let whats_app = dummyData.whatsapp;
      $("#Whatsapp")
        .find("a")
        .attr(
          "href",
          `https://api.whatsapp.com/send/?phone=%2B91${whats_app}&text=Hello from Digital Business Card&app_absent=0`
        );

      // youtube
      let youtube = dummyData.youtube;
      $("#youtube").find("a").attr("href", validateUrl(youtube));

      // telegram
      let telegram = dummyData.telegram;
      $("#telegram").find("a").attr("href", validateUrl(telegram));

      // twitter
      let twitter = dummyData.twitter;
      $("#twitter").find("a").attr("href", validateUrl(twitter));

      // linkedIn
      let linked_in = dummyData.linked_in;
      $("#linkedIn").find("a").attr("href", validateUrl(linked_in));

      // gmbusiness
      let googleMyBusiness = dummyData.googleMyBusiness;
      $("#gmbusiness").find("a").attr("href", validateUrl(googleMyBusiness));

      // download VCF
      let dwnloadContact = window.location.href.split("?")[0];

      $("#saveContact")
        .find("a")
        .attr("href", `${baseUrl}/generateDemoVcf?unique_id=${dwnloadContact}`);
      // for website-8
      $("#saveContact").attr(
        "href",
        `${baseUrl}/generateDemoVcf?unique_id=${dwnloadContact}`
      );

      // for payment
      let google_pay = dummyData.google_pay;
      let phone_pay = dummyData.phone_pay;
      let paytm = dummyData.paytm;
      let amazon_pay = dummyData.amazon_pay;
      let bharat_pay = dummyData.bharat_pay;

      $(".gpaytxt").text(google_pay);
      $(".phonePetxt").text(phone_pay);
      $(".paytmtxt").text(paytm);
      $(".amazonPaytxt").text(amazon_pay);
      $(".bharatPaytxt").text(bharat_pay);

      // for product and services
      let productServicesHtml =
        '<div class="productbox">' +
        "<a href=" +
        multicard_img +
        ' class="card" data-lightbox="product"' +
        'data-title="Lorem, ipsum dolor.| Lorem ipsum dolor sit amet.">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        '<p class="productTitle">Lorem, ipsum dolor.</p>' +
        '<p class="productDesc">Lorem ipsum dolor sit amet.</p>' +
        "</div>" +
        '<div class="productbox">' +
        "<a href=" +
        multicard_img +
        ' class="card" data-lightbox="product"' +
        'data-title="Lorem, ipsum dolor.| Lorem ipsum dolor sit amet.">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        '<p class="productTitle">Lorem, ipsum dolor.</p>' +
        '<p class="productDesc">Lorem ipsum dolor sit amet.</p>' +
        "</div>" +
        '<div class="productbox">' +
        "<a href=" +
        multicard_img +
        ' class="card" data-lightbox="product"' +
        'data-title="Lorem, ipsum dolor.| Lorem ipsum dolor sit amet.">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        '<p class="productTitle">Lorem, ipsum dolor.</p>' +
        '<p class="productDesc">Lorem ipsum dolor sit amet.</p>' +
        "</div>" +
        '<div class="productbox">' +
        "<a href=" +
        multicard_img +
        ' class="card" data-lightbox="product"' +
        'data-title="Lorem, ipsum dolor.| Lorem ipsum dolor sit amet.">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        '<p class="productTitle">Lorem, ipsum dolor.</p>' +
        '<p class="productDesc">Lorem ipsum dolor sit amet.</p>' +
        "</div>";

      $(".cardWrapper").append(productServicesHtml);

      // for Image Gallery
      let gallertImageHtml =
        '<div class="galleryImage">' +
        "<a href=" +
        multicard_img +
        ' data-lightbox="models">' +
        "<img src=" +
        multicard_img +
        ' alt="" />' +
        "</a>" +
        "</div>" +
        '<div class="galleryImage">' +
        "<a href=" +
        multicard_img +
        ' data-lightbox="models">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        "</div>" +
        '<div class="galleryImage">' +
        "<a href=" +
        multicard_img +
        ' data-lightbox="models">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        "</div>" +
        '<div class="galleryImage">' +
        "<a href=" +
        multicard_img +
        ' data-lightbox="models">' +
        "<img src=" +
        multicard_img +
        ' alt="" />' +
        "</a>" +
        "</div>" +
        '<div class="galleryImage">' +
        "<a href=" +
        multicard_img +
        ' data-lightbox="models">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        "</div>" +
        '<div class="galleryImage">' +
        "<a href=" +
        multicard_img +
        ' data-lightbox="models">' +
        "<img src=" +
        multicard_img +
        ' alt="" data-lightbox="models" />' +
        "</a>" +
        "</div>";

      $(".galleryWrapper").append(gallertImageHtml);

      // video gallery

      let videoGallery = dummyData.video_url;

      if (videoGallery.length <= 0) {
        $("#videoGallery").remove();
      }

      const videoUrls = videoGallery.map((url) => {
        var newUrls = url.replaceAll(
          "https://www.youtube.com/watch?v=",
          "https://www.youtube.com/embed/"
        );

        embedUrls = newUrls.split("&")[0] ?? newUrls;
        return embedUrls;
      });

      videoUrls.map((i) => {
        let loadvideodata = `<div class="upiWrapper">
                  <img src="/images/youtube_section.png">
              </div>`;

        $(".video_gallary").append(loadvideodata);
      });

      // for uploaded videos

      // for About Us
      $(".aboutUsDesctext").css("display", "block");
      // let text = incomingString.join().replaceAll(",", "");
      $(".aboutUsDesc").html(
        `<pre style="white-space:pre-wrap;">${lorem_text}</pre>`
      );

      $(".freeWebsiteTrial").remove();
      $(".bg-img2").remove();
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong!");
    }
  };

  let demoUrl = "";
  let mainUrl = "";

  if (pageType == "demo") {
    demoData();
    demoUrl = `${window.location.href.split("?")[0]}?t=card`;
  } else if (pageType == "card") {
    liveData();
    $(
      "#about,#productServices, #imageGallery, #UPI,#contactUs,#videoGallery"
    ).css("display", "none");
    $(".mainFooter").css({ position: "relative" });
  } else {
    liveData(lastId);
    mainUrl = `${baseUrl}/${lastId}?t=card`;
  }

  // for download Pdf
  let url = ``;
  $(document).ready(async () => {
    const container = document.querySelector(".wrapper");
    if (pageType == "demo") {
      url = `${baseUrl}/generateMultiPagePdf?url=${encodeURI(
        `${window.location.href.replaceAll("&", "-")}`
      )}
      &width=${container.clientWidth}&height=${container.clientHeight}`;
    } else {
      url = `${baseUrl}/generateMultiPagePdf?url=${encodeURI(
        `${window.location.href.replaceAll("&", "-")}`
      )}&width=${container.clientWidth}&height=${container.clientHeight}`;
    }

    $(".downloadAnchor").on("click", async () => {
      if (pageType === "demo") {
        window.open(url, "_blank");
      } else {
        $.ajax({
          type: "GET",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          url: `${baseUrl}/getWebsiteCardDetailsById?cardLink=${lastId}`,
          success: function (data) {
            if (data.status === true) {
              const { isPurchased } = data.data;
              if (isPurchased === false) {
                Swal.fire({
                  title: "This feature is not available in 5 days free trial.",
                  text: "Please click on Purchase Card to unlock.",
                  showCancelButton: true,
                  confirmButtonText: "Purchase Card",
                  closeOnCancel: true,
                }).then(function (result) {
                  if (result.value) {
                    window.open(
                      "https://adbanao.page.link/digi_card",
                      "_blank"
                    );
                  }
                });
              } else {
                window.open(url, "_blank");
              }
            }
          },
        });
      }
    });
  });
});
