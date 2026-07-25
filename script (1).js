// (القديم) دالة تشغيل التبويبات الرئيسية (صيدلية / خاص)
// ليه عملناها؟ عشان تقفل التبويب الرئيسي القديم وتفتح التبويب اللي المستخدم داس عليه
function openTab(evt, tabName) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active-content");
    }

    let tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active-content");
    evt.currentTarget.classList.add("active");
}

/* ================= 🚨 [تحديث جديد] دالة التبويبات الفرعية ================= */
// ليه عملناها؟ عشان تشغل نظام الأربَع تبويبات الفرعية جوه كل صفحة.
// بتاخد 3 حاجات: الحدث (evt)، واسم القسم الفرعي اللي هيفتح، واسم المجموعة عشان تفصل بين الصيدلية والخاص.
function openSubTab(evt, subTabName, groupClassName) {

    // 1. بنلف على كل الصناديق الفرعية لنفس المجموعة ونقفلها
    let subContents = document.getElementsByClassName(groupClassName);
    for (let i = 0; i < subContents.length; i++) {
        subContents[i].classList.remove("active-sub");
    }

    // 2. بنشيل اللون النشط من الأزرار الفرعية اللي في الشريط الحالي بس
    let parentHeader = evt.currentTarget.parentElement;
    let subBtns = parentHeader.getElementsByClassName("sub-tab-btn");
    for (let i = 0; i < subBtns.length; i++) {
        subBtns[i].classList.remove("active");
    }

    // 3. بنفتح الصندوق المطلوب ونلون زراره بالأزرق المميز
    document.getElementById(subTabName).classList.add("active-sub");
    evt.currentTarget.classList.add("active");
}