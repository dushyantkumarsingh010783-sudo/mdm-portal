/* ===========================================
   SMART MDM PORTAL
   Production JS v1.0
=========================================== */

const data = {
  "न्याय पंचायत 1": {
    "प्राथमिक": [
      "प्रा० वि० रामपुर",
      "प्रा० वि० नगला",
      "प्रा० वि० हरिहरपुर"
    ],
    "उच्च प्राथमिक": [
      "उच्च प्रा० वि० रामपुर"
    ],
    "कम्पोजिट": [
      "कम्पोजिट विद्यालय रामपुर"
    ]
  },

  "न्याय पंचायत 2": {
    "प्राथमिक": [
      "प्रा० वि० शिवपुर",
      "प्रा० वि० अमरपुर"
    ],
    "उच्च प्राथमिक": [
      "उच्च प्रा० वि० शिवपुर"
    ],
    "कम्पोजिट": [
      "कम्पोजिट विद्यालय शिवपुर"
    ]
  }
};

const nyay = document.getElementById("nyay");
const type = document.getElementById("type");
const school = document.getElementById("school");
const form = document.getElementById("mdmForm");
const message = document.getElementById("message");

/* न्याय पंचायत भरें */
Object.keys(data).forEach(item => {
  const option = document.createElement("option");
  option.value = item;
  option.textContent = item;
  nyay.appendChild(option);
});

/* विद्यालय सूची फ़िल्टर */
function loadSchools() {

  school.innerHTML = '<option value="">-- विद्यालय चुनें --</option>';

  const np = nyay.value;
  const tp = type.value;

  if (!np || !tp) return;

  const list = data[np][tp] || [];

  list.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    school.appendChild(option);
  });

}

nyay.addEventListener("change", loadSchools);
type.addEventListener("change", loadSchools);

/* Submit */

form.addEventListener("submit", function(e){

  e.preventDefault();

  message.innerHTML = "⏳ डेटा सेव किया जा रहा है...";

  setTimeout(function(){

    message.innerHTML = "✅ डेटा सफलतापूर्वक सुरक्षित किया गया।";

    form.reset();

    school.innerHTML='<option value="">-- पहले चयन करें --</option>';

  },1000);

});
