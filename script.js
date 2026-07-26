// 1. توليد أيام الشهر تلقائياً لجدول الحضور والانصراف
document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("attendanceTableBody");
    if (tbody) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

        let html = "";
        for (let day = 1; day <= daysInMonth; day++) {
            let dateObj = new Date(year, month, day);
            let dayName = daysNames[dateObj.getDay()];
            let formattedDate = `${day}/${month + 1}/${year}`;

            html += `
                <tr>
                    <td>${dayName} (${formattedDate})</td>
                    <td><input type="text" class="time-input" placeholder="7 أو 19" onblur="formatTimeInput(this)"></td>
                    <td><input type="text" class="time-input" placeholder="7 أو 19" onblur="formatTimeInput(this)"></td>
                    <td class="hours-result">0 ساعة</td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
    }

    // استرجاع بيانات المشروع كله المحفوظة محلياً
    let savedData = localStorage.getItem("pharmacy_full_project_data");
    if (savedData) {
        let data = JSON.parse(savedData);
        let inputs = document.querySelectorAll("input");
        inputs.forEach((input, index) => {
            if (data[index] !== undefined) {
                input.value = data[index];
                if(input.classList.contains("time-input")) {
                    calculateHours(input.closest("tr"));
                }
            }
        });
    }
});

// 2. تنسيق الوقت (7 أو 19)
function formatTimeInput(input) {
    let val = input.value.trim();
    if (!val) return;

    let hour = parseInt(val);
    if (!isNaN(hour)) {
        if (hour >= 1 && hour <= 12) {
            input.value = `${hour}:00 ص`;
        } else if (hour > 12 && hour <= 24) {
            let h12 = hour - 12;
            input.value = `${h12}:00 م`;
        }
    }
    calculateHours(input.closest("tr"));
    autoSaveAllProject();
}

// 3. حساب فرق الساعات
function calculateHours(row) {
    if (!row) return;
    let inputs = row.querySelectorAll(".time-input");
    let resultCell = row.querySelector(".hours-result");
    if (!inputs.length || !resultCell) return;

    let inVal = inputs[0].value;
    let outVal = inputs[1].value;

    if (!inVal || !outVal) {
        resultCell.innerText = "0 ساعة";
        return;
    }

    let parseTo24 = (str) => {
        let parts = str.split(":");
        let h = parseInt(parts[0]);
        let isPM = str.includes("م");
        if (isPM && h !== 12) h += 12;
        if (!isPM && h === 12) h = 0;
        return h;
    };

    let inHour24 = parseTo24(inVal);
    let outHour24 = parseTo24(outVal);

    let diff = outHour24 - inHour24;
    if (diff < 0) diff += 24;

    resultCell.innerText = `${diff} ساعة`;
}

// 4. الحفظ اللحظي لكل المشروع (أي إدخال أو مسح في أي مكان بيسمع فوراً)
document.addEventListener("input", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        autoSaveAllProject();
    }
});

function autoSaveAllProject() {
    let inputs = document.querySelectorAll("input, textarea, select");
    let data = {};
    inputs.forEach((input, index) => {
        data[index] = input.value;
    });
    localStorage.setItem("pharmacy_full_project_data", JSON.stringify(data));
    
    // مؤشر الحفظ الصغير
    let status = document.getElementById("syncStatus");
    if(status) {
        status.innerText = "🟢 يتم الحفظ...";
        setTimeout(() => { status.innerText = "🟢 متصل بالشيت"; }, 400);
    }
}

// 5. زرار الحفظ اليدوي لكل المشروع
function manualSaveData() {
    autoSaveAllProject();
    alert("تم حفظ بيانات المشروع بالكامل يدوياً بنجاح! 💾");
}

// 6. زرار إعادة التهيئة لكل المشروع
function resetPageData() {
    if (confirm("هل أنت متأكد من مسح وإعادة تهيئة بيانات المشروع بالكامل؟")) {
        localStorage.removeItem("pharmacy_full_project_data");
        let inputs = document.querySelectorAll("input, textarea, select");
        inputs.forEach(input => input.value = "");
        alert("تمت إعادة تهيئة المشروع بنجاح! 🔄");
    }
}
