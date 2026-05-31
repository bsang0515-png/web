$(document).ready(function() {

    /* ==========================================
       Hàm cuộn mượt (Smooth Scroll)
       ========================================== */
    // Nhóm thống nhất hiệu ứng cuộn mượt khi click các liên kết menu và nút kêu gọi hành động
    $(".main-menu a, #hero-cta-btn, #ad-action-btn, .footer-links a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            
            // Cập nhật class active cho menu
            if ($(this).parents('.main-menu').length) {
                $(".main-menu li").removeClass("active");
                $(this).parent("li").addClass("active");
            }

            // Thực hiện cuộn mượt bằng animate của jQuery
            $("html, body").animate({
                scrollTop: $(hash).offset().top - 90
            }, 800);

            // Đóng menu trên di động sau khi chọn
            if ($("#nav-menu").hasClass("show")) {
                $("#nav-menu").removeClass("show");
            }
        }
    });

    // Theo dõi cuộn trang để cập nhật active class tự động trên menu
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        $('.content-section > section, .main-wrapper #about').each(function() {
            var currLink = $('.main-menu a[href="#' + $(this).attr('id') + '"]');
            if (currLink.length) {
                var refElement = $(this);
                if (refElement.offset().top - 120 <= scrollPos && refElement.offset().top + refElement.outerHeight() > scrollPos) {
                    $('.main-menu li').removeClass("active");
                    currLink.parent('li').addClass("active");
                }
            }
        });
    });


    /* ==========================================
       Hàm Menu di động (Mobile Menu)
       ========================================== */
    // Đóng mở menu ngang khi hiển thị trên điện thoại
    $("#mobile-menu-toggle").on("click", function() {
        $("#nav-menu").toggleClass("show");
    });

    // Đóng mở submenu trên di động
    $(".main-menu li.has-submenu > a").on("click", function(e) {
        if ($(window).width() <= 768) {
            var submenu = $(this).siblings(".submenu");
            if (submenu.length) {
                e.preventDefault();
                submenu.toggleClass("open");
                $(this).find(".submenu-icon").toggleClass("fa-chevron-down fa-chevron-up");
            }
        }
    });


    /* ==========================================
       Hàm tính điểm xét tuyển (Score Calculator)
       ========================================== */
    // Thông tin điểm chuẩn ngành học năm 2025 tại Đại học Tây Nguyên
    const majorsData = [
        { id: 'CNTT', name: 'Công nghệ thông tin', benchmark: 19.00, combinations: ['A00', 'A01', 'D01'] },
        { id: 'YK', name: 'Y khoa', benchmark: 25.50, combinations: ['B00'] },
        { id: 'SPTA', name: 'Sư phạm Tiếng Anh', benchmark: 24.50, combinations: ['D01'] }
    ];

    // Thay đổi nhãn môn học khi người dùng đổi Tổ hợp xét tuyển
    $("#select-group").on("change", function() {
        var group = $(this).val();
        if (group === "A00") {
            $("#label-sub1").text("Toán học:");
            $("#label-sub2").text("Vật lí:");
            $("#label-sub3").text("Hóa học:");
        } else if (group === "A01") {
            $("#label-sub1").text("Toán học:");
            $("#label-sub2").text("Vật lí:");
            $("#label-sub3").text("Tiếng Anh:");
        } else if (group === "D01") {
            $("#label-sub1").text("Toán học:");
            $("#label-sub2").text("Ngữ văn:");
            $("#label-sub3").text("Tiếng Anh:");
        } else if (group === "B00") {
            $("#label-sub1").text("Toán học:");
            $("#label-sub2").text("Hóa học:");
            $("#label-sub3").text("Sinh học:");
        }
    });

    // Thực hiện tính điểm xét tuyển
    $("#btn-calculate").on("click", function() {
        // Reset trạng thái báo lỗi của ô nhập liệu
        $("input[type='number']").css("border-color", "#ccc");

        var sub1 = parseFloat($("#score-sub1").val());
        var sub2 = parseFloat($("#score-sub2").val());
        var sub3 = parseFloat($("#score-sub3").val());
        var priority = parseFloat($("#score-priority").val());
        var selectedGroup = $("#select-group").val();

        // Kiểm tra dữ liệu rỗng
        if (isNaN(sub1) || isNaN(sub2) || isNaN(sub3)) {
            alert("Vui lòng nhập đầy đủ điểm cả 3 môn!");
            if (isNaN(sub1)) $("#score-sub1").css("border-color", "#E53935").focus();
            else if (isNaN(sub2)) $("#score-sub2").css("border-color", "#E53935").focus();
            else if (isNaN(sub3)) $("#score-sub3").css("border-color", "#E53935").focus();
            return;
        }

        // Kiểm tra khoảng điểm hợp lệ (0 đến 10)
        var invalid = false;
        if (sub1 < 0 || sub1 > 10) { $("#score-sub1").css("border-color", "#E53935"); invalid = true; }
        if (sub2 < 0 || sub2 > 10) { $("#score-sub2").css("border-color", "#E53935"); invalid = true; }
        if (sub3 < 0 || sub3 > 10) { $("#score-sub3").css("border-color", "#E53935"); invalid = true; }

        if (invalid) {
            alert("Điểm môn học phải nằm trong khoảng từ 0 đến 10!");
            return;
        }

        // Tính tổng điểm xét tuyển
        var totalScore = sub1 + sub2 + sub3 + priority;
        totalScore = Math.round(totalScore * 100) / 100; // Làm tròn 2 chữ số thập phân

        // Cập nhật điểm lên giao diện kết quả
        $("#result-total-score").text(totalScore.toFixed(2));
        $("#result-text-status").html("Tổng điểm tổ hợp <strong>" + selectedGroup + "</strong> (đã cộng điểm ưu tiên <strong>+" + priority + "</strong>)");

        // So sánh điểm chuẩn các ngành
        var matchingHtml = "";
        majorsData.forEach(function(major) {
            var isCombinationValid = major.combinations.includes(selectedGroup);
            
            if (!isCombinationValid) {
                matchingHtml += '<div class="matching-item match-no">' +
                                '<span>' + major.name + '</span>' +
                                '<span>Không xét tuyển tổ hợp này</span>' +
                                '</div>';
            } else {
                var diff = totalScore - major.benchmark;
                if (diff >= 0) {
                    matchingHtml += '<div class="matching-item match-yes">' +
                                    '<span><i class="fa-solid fa-circle-check"></i> ' + major.name + ' (Chuẩn: ' + major.benchmark.toFixed(2) + ')</span>' +
                                    '<span>Đủ điều kiện đỗ (Thừa +' + diff.toFixed(2) + ')</span>' +
                                    '</div>';
                } else if (diff >= -1.5) {
                    matchingHtml += '<div class="matching-item match-maybe">' +
                                    '<span><i class="fa-solid fa-circle-question"></i> ' + major.name + ' (Chuẩn: ' + major.benchmark.toFixed(2) + ')</span>' +
                                    '<span>Cơ hội cao (Thiếu ' + Math.abs(diff).toFixed(2) + ')</span>' +
                                    '</div>';
                } else {
                    matchingHtml += '<div class="matching-item match-no">' +
                                    '<span><i class="fa-solid fa-circle-xmark"></i> ' + major.name + ' (Chuẩn: ' + major.benchmark.toFixed(2) + ')</span>' +
                                    '<span>Khả năng đỗ thấp (Thiếu ' + Math.abs(diff).toFixed(2) + ')</span>' +
                                    '</div>';
                }
            }
        });

        $("#result-matching-list").html(matchingHtml);
        
        // Hiệu ứng highlight nhẹ vùng kết quả
        $("#result-box").css("background-color", "#E3F2FD").animate({opacity: 0.7}, 100).animate({opacity: 1}, 200);
    });

    // Nút Nhập lại điểm
    $("#btn-reset-calc").on("click", function() {
        $("#score-sub1").val("");
        $("#score-sub2").val("");
        $("#score-sub3").val("");
        $("#score-priority").val("0");
        $("input[type='number']").css("border-color", "#ccc");
        
        $("#result-total-score").text("0.00");
        $("#result-text-status").text("Vui lòng nhập điểm và bấm nút Tính điểm.");
        $("#result-matching-list").empty();
    });


    /* ==========================================
       Hàm chatbot (Chatbot logic)
       ========================================== */
    // Mở và đóng popup Chatbot tư vấn
    $("#btn-chat-toggle").on("click", function() {
        $("#admissions-chat-box").toggleClass("open");
        $("#chat-unread-badge").fadeOut(); // Ẩn badge tin nhắn chưa đọc khi mở chat
    });

    $("#btn-chat-close").on("click", function() {
        $("#admissions-chat-box").removeClass("open");
    });

    // Gửi tin nhắn chat từ ô nhập liệu
    $("#btn-chat-send").on("click", function() {
        sendUserChatMessage();
    });

    $("#chat-user-input").on("keypress", function(e) {
        if (e.which === 13) { // Phím Enter
            sendUserChatMessage();
        }
    });

    // Click các câu hỏi nhanh của chatbot
    $(document).on("click", ".quick-reply-btn", function() {
        var question = $(this).attr("data-question");
        appendChatMessage(question, "user");
        triggerBotReply(question);
    });

    // Hàm lấy tin nhắn người dùng và xử lý gửi đi
    function sendUserChatMessage() {
        var inputField = $("#chat-user-input");
        var text = inputField.val().trim();
        if (text === "") return;

        appendChatMessage(text, "user");
        inputField.val("");
        triggerBotReply(text);
    }

    // Hàm chèn bong bóng chat mới vào khung hội thoại
    function appendChatMessage(message, sender) {
        var bubbleClass = sender === "user" ? "user" : "bot";
        var msgHtml = '<div class="chat-bubble ' + bubbleClass + '">' + message + '</div>';
        
        // Chèn trước chỉ báo gõ chữ (typing indicator)
        $("#bot-typing-indicator").before(msgHtml);
        
        // Cuộn xuống đáy hộp thoại
        var chatMessages = $("#chat-messages-container");
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }

    // Hàm phản hồi của Bot dựa theo từ khóa trong tin nhắn
    function triggerBotReply(userText) {
        var cleanText = userText.toLowerCase();
        var replyText = "";

        // Hiển thị chỉ báo gõ chữ (typing indicator) để tạo cảm giác tự nhiên
        $("#bot-typing-indicator").show();
        var chatMessages = $("#chat-messages-container");
        chatMessages.scrollTop(chatMessages[0].scrollHeight);

        // Xử lý từ khóa để chọn phản hồi
        if (cleanText.includes("học phí") || cleanText.includes("tiền học") || cleanText.includes("bao nhiêu tiền")) {
            replyText = "Học phí dự kiến năm học 2026 - 2027 tại Đại học Tây Nguyên (TNU) như sau:<br>" +
                        "- <strong>Ngành Công nghệ thông tin:</strong> 15.000.000đ/năm.<br>" +
                        "- <strong>Ngành Y khoa:</strong> 35.000.000đ/năm.<br>" +
                        "- <strong>Ngành Sư phạm Tiếng Anh:</strong> Miễn học phí (theo Nghị định 116 đối với ngành sư phạm).<br>" +
                        "👉 Học phí các ngành y khoa và CNTT rất phù hợp với khu vực và có nhiều học bổng từ các tổ chức xã hội.";
        } 
        else if (cleanText.includes("học bổng") || cleanText.includes("quà tặng") || cleanText.includes("ưu đãi")) {
            replyText = "Chính sách học bổng tuyển sinh TNU năm 2026 rất hấp dẫn:<br>" +
                        "1. 🌟 <strong>Học bổng Thủ khoa:</strong> Miễn 100% học phí toàn khóa cho thí sinh đạt điểm cao nhất mỗi ngành.<br>" +
                        "2. ⚡ <strong>Học bổng Tài năng Tây Nguyên:</strong> Giảm 50% học phí năm thứ nhất nếu bạn có IELTS >= 6.5 hoặc giải HSG từ cấp tỉnh.<br>" +
                        "3. 🤝 <strong>Học bổng Khuyến khích:</strong> Giảm 20% học phí kỳ đầu cho học sinh nộp hồ sơ trước ngày 31/05.";
        } 
        else if (cleanText.includes("ngành") || cleanText.includes("đào tạo") || cleanText.includes("chuyên ngành") || cleanText.includes("học cái gì")) {
            replyText = "Hiện tại TNU đang đào tạo 3 ngành trọng điểm nổi bật nhất:<br>" +
                        "1. 💻 <strong>Công nghệ thông tin:</strong> Kỹ sư 4 năm, đào tạo chuyên sâu phần mềm và trí tuệ nhân tạo.<br>" +
                        "2. 🩺 <strong>Y khoa:</strong> Bác sĩ đa khoa 6 năm, ngành học danh tiếng và thế mạnh truyền thống của trường.<br>" +
                        "3. 🏫 <strong>Sư phạm Tiếng Anh:</strong> Cử nhân 4 năm, miễn học phí và được hỗ trợ chi phí sinh hoạt.<br>" +
                        "Bạn quan tâm nhất đến ngành nào ở trên?";
        } 
        else if (cleanText.includes("hồ sơ") || cleanText.includes("đăng ký") || cleanText.includes("nộp thế nào") || cleanText.includes("cách nộp") || cleanText.includes("thủ tục")) {
            replyText = "Để đăng ký xét học bạ vào TNU, bạn thực hiện:<br>" +
                        "1. 📝 Điền thông tin đăng ký tư vấn trực tuyến ở form <strong>'Liên Hệ'</strong> bên dưới.<br>" +
                        "2. 📂 Chuẩn bị hồ sơ gồm: Bản sao công chứng học bạ THPT, bản sao CCCD, phiếu đăng ký xét tuyển của trường.<br>" +
                        "3. 📮 Nộp trực tiếp hoặc gửi chuyển phát nhanh về địa chỉ: <strong>Phòng Tuyển sinh Trường Đại học Tây Nguyên, 567 Lê Duẩn, P. Ea Tam, TP. Buôn Ma Thuột, Đắk Lắk</strong>.";
        } 
        else if (cleanText.includes("điểm chuẩn") || cleanText.includes("điểm lấy bao nhiêu") || cleanText.includes("chuẩn") || cleanText.includes("lấy mấy điểm")) {
            replyText = "Điểm chuẩn xét tuyển bằng học bạ của TNU năm 2025:<br>" +
                        "- <strong>Công nghệ thông tin:</strong> 19.00 điểm.<br>" +
                        "- <strong>Y khoa:</strong> 25.50 điểm.<br>" +
                        "- <strong>Sư phạm Tiếng Anh:</strong> 24.50 điểm.<br>" +
                        "💡 Bạn có thể cuộn lên phần <strong>'Tính điểm'</strong> trên trang web để tự tính tổng điểm và nhận dự đoán cơ hội trúng tuyển ngay nhé!";
        } 
        else if (cleanText.includes("chào") || cleanText.includes("hi") || cleanText.includes("hello") || cleanText.includes("alo") || cleanText.includes("tư vấn giúp")) {
            replyText = "Xin chào! Trợ lý tư vấn tuyển sinh TNU rất vui được hỗ trợ bạn. Bạn muốn hỏi về **Ngành học**, **Học phí**, **Học bổng** hay **Hồ sơ xét tuyển**?";
        } 
        else {
            replyText = "Cảm ơn câu hỏi của bạn. TNU luôn sẵn sàng giải đáp chi tiết nhất. Bạn có thể gửi câu hỏi cụ thể kèm SĐT qua form <strong>'Liên Hệ'</strong> dưới trang web, hoặc gọi trực tiếp Hotline tuyển sinh <strong>0262 3825 185</strong> để các thầy cô tư vấn chi tiết 1-1 cho bạn nhé!";
        }

        // Tạo độ trễ ngẫu nhiên (800ms - 1500ms) để giống như bot đang suy nghĩ và gõ chữ
        var randomDelay = Math.floor(Math.random() * 700) + 800;
        
        setTimeout(function() {
            // Ẩn chỉ báo gõ chữ
            $("#bot-typing-indicator").hide();
            // Đưa tin nhắn phản hồi của Bot lên màn hình
            appendChatMessage(replyText, "bot");
        }, randomDelay);
    }

    // Hiển thị thêm chi tiết ngành học khi click nút "Tìm hiểu thêm" ở mỗi card ngành học
    $(".show-details-btn").on("click", function() {
        var major = $(this).attr("data-major");
        var detailsText = "";
        
        if (major === "CNTT") {
            detailsText = "Ngành Công nghệ thông tin tại Đại học Tây Nguyên đào tạo các kỹ sư CNTT chất lượng cao, phục vụ chuyển đổi số vùng Tây Nguyên. Sinh viên được học tập trong phòng Lab hiện đại, thực hành chuyên sâu về Lập trình, Trí tuệ nhân tạo (AI), IoT. Hướng ra việc làm rộng mở tại các công ty công nghệ lớn.";
        } else if (major === "YK") {
            detailsText = "Ngành Y khoa là ngành học mũi nhọn lâu đời nhất của Trường Đại học Tây Nguyên. Sinh viên được học tập lý thuyết song song thực hành lâm sàng liên tục tại Bệnh viện Đại học Tây Nguyên và Bệnh viện Đa khoa Vùng Tây Nguyên. Tốt nghiệp nhận bằng Bác sĩ Y khoa đa khoa.";
        } else if (major === "SPTA") {
            detailsText = "Ngành Sư phạm Tiếng Anh đào tạo các giáo viên và cử nhân chuyên môn sư phạm xuất sắc. Thừa hưởng chính sách miễn học phí toàn khóa và hỗ trợ sinh hoạt phí từ Nhà nước theo Nghị định 116. Hướng nghiệp làm giảng viên, giáo viên tiếng Anh hoặc biên dịch viên.";
        }
        
        alert("Thông tin chi tiết ngành:\n\n" + detailsText);
    });

    // Xử lý gửi Form liên hệ (Contact Form)
    $("#form-contact-msg").on("submit", function(e) {
        e.preventDefault();
        
        var name = $("#contact-name").val().trim();
        var phone = $("#contact-phone").val().trim();
        var major = $("#contact-major option:selected").text();

        // Kiểm tra số điện thoại cơ bản
        var phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            alert("Vui lòng nhập số điện thoại hợp lệ (10 - 11 chữ số)!");
            $("#contact-phone").css("border-color", "#E53935").focus();
            return;
        }

        // Báo thành công
        alert("Cảm ơn bạn " + name + "!\nYêu cầu tư vấn ngành học \"" + major + "\" đã được ghi nhận thành công.\nBan tư vấn tuyển sinh Trường Đại học Tây Nguyên (TNU) sẽ liên hệ với bạn qua SĐT " + phone + " trong vòng 24 giờ tới.");
        
        // Reset form
        $("#contact-name").val("");
        $("#contact-phone").val("");
        $("#contact-phone").css("border-color", "#ccc");
    });
});
