const browseBtn = document.getElementById("browseBtn");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const dropArea = document.getElementById("dropArea");
const themeBtn = document.getElementById("themeBtn");

let selectedFile = null;

/* ===============================
   Theme Toggle
================================= */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML="☀️";
    }else{
        themeBtn.innerHTML="🌙";
    }

});

/* ===============================
   Browse Image
================================= */

browseBtn.addEventListener("click",()=>{

    imageInput.click();

});

/* ===============================
   Select Image
================================= */

imageInput.addEventListener("change",(e)=>{

    selectedFile=e.target.files[0];

    showPreview(selectedFile);

});

/* ===============================
   Preview Image
================================= */

function showPreview(file){

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(e){

        preview.src=e.target.result;

        preview.style.display="block";

    }

    reader.readAsDataURL(file);

}

/* ===============================
   Drag Drop
================================= */

dropArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    dropArea.style.borderColor="#00ff99";

});

dropArea.addEventListener("dragleave",()=>{

    dropArea.style.borderColor="rgba(255,255,255,.4)";

});

dropArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    selectedFile=e.dataTransfer.files[0];

    showPreview(selectedFile);

});

/* ===============================
   Analyze
================================= */

analyzeBtn.addEventListener("click",async()=>{

    if(selectedFile==null){

        alert("Please upload an image.");

        return;

    }

    loading.style.display="block";

    result.innerHTML="";

    const formData=new FormData();

    formData.append("image",selectedFile);

    try{

        const response=await fetch("/analyze",{

            method:"POST",

            body:formData

        });

        const data=await response.json();

        loading.style.display="none";

        displayResult(data);

    }

    catch(error){

        loading.style.display="none";

        alert("Something went wrong.");

        console.log(error);

    }

});

/* ===============================
   Result Cards
================================= */

function displayResult(data){

if(data.error){

result.innerHTML=`
<h2>❌ Error</h2>
<p>${data.error}</p>
<pre>${data.raw || ""}</pre>
`;

return;

}

result.innerHTML=`

<h2>${data.food_name}</h2>

<p style="margin-top:10px;">
⭐ Confidence : ${data.confidence}
</p>

<p>
🍽 Serving : ${data.serving_size}
</p>

<p>
🥗 Meal Type : ${data.meal_type}
</p>

<br>

<div class="result">

<div class="card">
<h4>🔥 Calories</h4>
<p>${data.calories}</p>
</div>

<div class="card">
<h4>💪 Protein</h4>
<p>${data.protein}</p>
</div>

<div class="card">
<h4>🍞 Carbs</h4>
<p>${data.carbs}</p>
</div>

<div class="card">
<h4>🥑 Fat</h4>
<p>${data.fat}</p>
</div>

<div class="card">
<h4>🌾 Fibre</h4>
<p>${data.fiber}</p>
</div>

<div class="card">
<h4>🍬 Sugar</h4>
<p>${data.sugar}</p>
</div>

<div class="card">
<h4>🧂 Sodium</h4>
<p>${data.sodium}</p>
</div>

<div class="card">
<h4>🏆 Nutrition Score</h4>
<p>${data.nutrition_score}</p>
</div>

</div>

<br>

<h3>🥗 Ingredients</h3>

<ul>

${data.ingredients.map(i=>`<li>${i}</li>`).join("")}

</ul>

<br>

<h3>💊 Vitamins</h3>

<ul>

${data.vitamins.map(i=>`<li>${i}</li>`).join("")}

</ul>

<br>

<h3>🟢 Healthiness</h3>

<p>${data.healthiness}</p>

<br>

<h3>💡 Health Tips</h3>

<ul>

${data.health_tips.map(i=>`<li>${i}</li>`).join("")}

</ul>

<br>

<h3>🏋️ Muscle Gain</h3>

<p>${data.muscle_gain_tip}</p>

<br>

<h3>⚖️ Weight Loss</h3>

<p>${data.weight_loss_tip}</p>

<br>

<h3>❤️ Heart Health</h3>

<p>${data.heart_health_tip}</p>

<br>

<h3>🍬 Diabetes</h3>

<p>${data.diabetes_tip}</p>

<br>

<h3>🚫 Allergens</h3>

<ul>

${data.allergens.map(i=>`<li>${i}</li>`).join("")}

</ul>

<br>

<h3>🌱 Vegetarian</h3>

<p>${data.vegetarian}</p>

<br>

<h3>📄 Summary</h3>

<p>${data.summary}</p>

`;

}