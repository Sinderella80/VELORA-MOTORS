
/* ===================================
   VELORA MOTORS
   JavaScript + JQuery
=================================== */


$(document).ready(function () {


    /* ===============================
       1. SHOW AND HIDE CAR DETAILS
    =============================== */

    $(".details-toggle").change(function () {

        var targetId = $(this).attr("data-target");

        if ($(this).is(":checked")) {

            $("#" + targetId).stop(true, true).slideDown(350);

        } else {

            $("#" + targetId).stop(true, true).slideUp(350);

        }

    });



    /* ===============================
       2. CONTINUE TO BOOKING
    =============================== */

    $("#continueBtn").click(function () {

        var selectedCars = $(".car-select:checked");

        if (selectedCars.length === 0) {

            alert("يرجى اختيار سيارة واحدة على الأقل قبل المتابعة.");

            return;

        }

        $("#bookingSection").stop(true, true).slideDown(500);

        $("html, body").animate({

            scrollTop: $("#bookingSection").offset().top - 20

        }, 700);

    });



    /* ===============================
       3. SET MINIMUM DATE
    =============================== */

    var today = new Date();

    var year = today.getFullYear();

    var month = String(today.getMonth() + 1).padStart(2, "0");

    var day = String(today.getDate()).padStart(2, "0");

    var currentDate = year + "-" + month + "-" + day;

    $("#startDate").attr("min", currentDate);

    $("#endDate").attr("min", currentDate);



    /* Update end date minimum when start date changes */

    $("#startDate").change(function () {

        var start = $(this).val();

        $("#endDate").attr("min", start);

        if ($("#endDate").val() !== "" && $("#endDate").val() <= start) {

            $("#endDate").val("");

        }

    });



    /* ===============================
       4. BOOKING FORM VALIDATION
    =============================== */

    $("#bookingForm").submit(function (event) {

        event.preventDefault();


        var fullName = $("#fullName").val().trim();

        var nationalId = $("#nationalId").val().trim();

        var mobile = $("#mobile").val().trim();

        var email = $("#email").val().trim();

        var startDate = $("#startDate").val();

        var endDate = $("#endDate").val();


        /* National ID: 11 digits, province 01-14 */

        var nationalPattern = /^(0[1-9]|1[0-4])[0-9]{9}$/;


        /* Arabic name */

        var namePattern = /^[\u0621-\u064A\u066E-\u06D3\s]+$/;


        /* Syrian mobile number */

        var mobilePattern = /^09(3|4|6|7|8|9)[0-9]{7}$/;


        /* Email */

        var emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



        /* Name validation */

        if (fullName !== "" && !namePattern.test(fullName)) {

            alert("الاسم يجب أن يحتوي على أحرف عربية فقط.");

            $("#fullName").focus();

            return;

        }



        /* National ID validation */

        if (!nationalPattern.test(nationalId)) {

            alert(
                "الرقم الوطني غير صحيح.\n" +
                "يجب أن يتكون من 11 خانة.\n" +
                "أول خانتين يجب أن تكونا بين 01 و14."
            );

            $("#nationalId").focus();

            return;

        }



        /* Start date validation */

        if (startDate === "") {

            alert("يرجى إدخال تاريخ بداية التأجير.");

            $("#startDate").focus();

            return;

        }



        /* End date validation */

        if (endDate === "") {

            alert("يرجى إدخال تاريخ نهاية التأجير.");

            $("#endDate").focus();

            return;

        }



        /* Date sequence validation */

        var start = new Date(startDate + "T00:00:00");

        var end = new Date(endDate + "T00:00:00");


        if (end <= start) {

            alert("يجب أن يكون تاريخ النهاية لاحقاً لتاريخ البداية.");

            $("#endDate").focus();

            return;

        }



        /* Mobile validation */

        if (mobile !== "" && !mobilePattern.test(mobile)) {

            alert(
                "رقم الموبايل غير صحيح.\n" +
                "يرجى إدخال رقم سوري صحيح يبدأ بـ 09."
            );

            $("#mobile").focus();

            return;

        }



        /* Email validation */

        if (email !== "" && !emailPattern.test(email)) {

            alert("يرجى إدخال بريد إلكتروني صحيح.");

            $("#email").focus();

            return;

        }



        /* ===============================
           5. SELECTED CARS
        =============================== */

        var selectedCars = $(".car-select:checked");


        if (selectedCars.length === 0) {

            alert("لم يتم اختيار أي سيارة.");

            return;

        }



        /* ===============================
           6. CALCULATE RENTAL DAYS
        =============================== */

        var millisecondsPerDay = 1000 * 60 * 60 * 24;

        var difference = end.getTime() - start.getTime();

        var rentalDays = Math.round(difference / millisecondsPerDay);



        /* ===============================
           7. CALCULATE TOTAL PRICE
        =============================== */

        var totalBeforeDiscount = 0;

        var resultHTML = "";


        resultHTML += "<table class='result-table'>";

        resultHTML += "<thead>";

        resultHTML += "<tr>";

        resultHTML += "<th>رمز السيارة</th>";

        resultHTML += "<th>الموديل</th>";

        resultHTML += "<th>السعر اليومي</th>";

        resultHTML += "<th>أيام التأجير</th>";

        resultHTML += "<th>المبلغ</th>";

        resultHTML += "</tr>";

        resultHTML += "</thead>";

        resultHTML += "<tbody>";


        for (var i = 0; i < selectedCars.length; i++) {

            var car = selectedCars[i];

            var code = car.value;

            var model = $(car).attr("data-model");

            var dailyPrice = Number($(car).attr("data-price"));

            var carTotal = dailyPrice * rentalDays;


            totalBeforeDiscount += carTotal;


            resultHTML += "<tr>";

            resultHTML += "<td>" + code + "</td>";

            resultHTML += "<td>" + model + "</td>";

            resultHTML += "<td>" + dailyPrice.toLocaleString("en-US") + " ل.س</td>";

            resultHTML += "<td>" + rentalDays + "</td>";

            resultHTML += "<td>" + carTotal.toLocaleString("en-US") + " ل.س</td>";

            resultHTML += "</tr>";

        }


        resultHTML += "</tbody>";

        resultHTML += "</table>";



        /* ===============================
           8. APPLY 10% DISCOUNT
        =============================== */

        var discount = 0;

        if (rentalDays > 7) {

            discount = totalBeforeDiscount * 0.10;

        }


        var finalTotal = totalBeforeDiscount - discount;



        /* ===============================
           9. DISPLAY FINAL RESULT
        =============================== */

        resultHTML += "<div class='total-box'>";


        resultHTML += "<p>عدد أيام التأجير: " + rentalDays + " يوم</p>";


        resultHTML +=
        "<p>المبلغ قبل الخصم: " +
        totalBeforeDiscount.toLocaleString("en-US") +
        " ل.س</p>";


        resultHTML +=
        "<p>قيمة الخصم: " +
        discount.toLocaleString("en-US") +
        " ل.س</p>";


        resultHTML +=
        "<p>نسبة الخصم: " +
        (discount > 0 ? "10%" : "0%") +
        "</p>";


        resultHTML +=
        "<p>المبلغ النهائي:</p>";


        resultHTML +=
        "<div class='final-price'>" +
        finalTotal.toLocaleString("en-US") +
        " ل.س</div>";


        resultHTML += "</div>";


        resultHTML +=
        "<p>الاسم: " + escapeHTML(fullName || "غير محدد") + "</p>";


        resultHTML +=
        "<p>الرقم الوطني: " + escapeHTML(nationalId) + "</p>";


        resultHTML +=
        "<p>تاريخ بداية التأجير: " + startDate + "</p>";


        resultHTML +=
        "<p>تاريخ نهاية التأجير: " + endDate + "</p>";


        resultHTML +=
        "<p>رقم الطلب: VEL-" + Date.now() + "</p>";




        $("#resultContent").html(resultHTML);


        $("#resultSection").stop(true, true).slideDown(500);


        $("html, body").animate({

            scrollTop: $("#resultSection").offset().top - 30

        }, 700);


    });



    /* ===============================
       10. RESET RESULT
    =============================== */

    $("#bookingForm").on("reset", function () {

        $("#resultSection").stop(true, true).slideUp(300);

    });


});


/* ===============================
   SAFE HTML TEXT
================================ */

function escapeHTML(text) {

    return String(text).replace(/[&<>"']/g, function (character) {

        var entities = {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#39;"

        };

        return entities[character];

    });

}





