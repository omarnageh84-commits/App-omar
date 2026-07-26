// 1. نظام التبويبات
function openTab(evt, tabName) {
    let tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active-content");
    }
    let tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active-content");
    evt.currentTarget.classList.add("active");
}

function openSubTab(evt, subTabId, groupClass) {
    let subContents = document.getElementsByClassName(groupClass);
    for (let i = 0; i < subContents.length; i++) {
        subContents[i].style.display = "none";
        subContents[i].classList.remove("active-sub");
    }
    let parentHeader = evt.currentTarget.parentElement;
    let allBtns = parentHeader.getElementsByClassName("sub-tab-btn");
    for (let i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove("active");
    }
    document.getElementById(subTabId).style.display = "block";
    document.getElementById(subTabId).classList.add("active-sub");
    evt.currentTarget.classList.add("active");
}

// 2. توليد أيام الشهر تلقائياً لجدول الحضور والانصراف مع زرار تهيئة لكل يوم/صف
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
                    <td><button type="button" onclick="resetSingleRow(this)" style="padding: 2px 6px; font-size: 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">تهيئة اليوم</button></td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
    }

    // استرجاع البيانات
    let savedData = localStorage.getItem("pharmacy_full_project_data");
    if (savedData) {
        try {
            let data = JSON.parse(savedData);
            let inputs = document.querySelectorAll("input, textarea, select");
            inputs.forEach((input, index) => {
                if (data[index] !== undefined) {
                    input.value = data[index];
                    if(input.classList.contains("time-input")) {
                        calculateHours(input.closest("tr"));
                    }
                }
            });
        } catch(e) { console.log(e); }
    }
});

// 3. تنسيق الوقت
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

// 4. حساب الساعات
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

// 5. الحفظ اللحظي
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
    
    let statuses = document.querySelectorAll(".syncStatus");
    statuses.forEach(status => {
        status.innerText = "🟢 يتم الحفظ...";
        setTimeout(() => { status.innerText = "🟢 متصل بالشيت"; }, 400);
    });
}

function manualSaveData() {
    autoSaveAllProject();
    alert("تم الحفظ يدوياً بنجاح! 💾");
}

// 6. إعادة تهيئة اليوم أو الصف الواحد بس
function resetSingleRow(button) {
    if (confirm("هل تريد مسح بيانات هذا اليوم فقط؟")) {
        let row = button.closest("tr");
        let inputs = row.querySelectorAll("input");
        inputs.forEach(input => input.value = "");
        let resultCell = row.querySelector(".hours-result");
        if(resultCell) resultCell.innerText = "0 ساعة";
        autoSaveAllProject();
    }
}
