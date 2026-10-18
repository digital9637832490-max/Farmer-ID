const $ = id => document.getElementById(id);
const ids = ["name","father","dob","gender","mobile","aadhaar","farmerId","state","district","subdistrict","village","survey","area"];
const STORAGE_KEY = "agriCardStudio_savedDetails_v1";
let photoData = "";
const translations = {
 hi:{formTitle:"किसान की जानकारी",name:"किसान का पूरा नाम",father:"पिता / पति का नाम",dob:"जन्मतिथि",gender:"लिंग",mobile:"मोबाइल नंबर (वैकल्पिक)",aadhaar:"आधार नंबर (वैकल्पिक)",farmerId:"Farmer ID (आधिकारिक रिकॉर्ड से)",state:"राज्य",district:"जिला",subdistrict:"तहसील / उप-जिला",village:"गाँव",survey:"सर्वे / खसरा नंबर (वैकल्पिक)",area:"क्षेत्रफल (वैकल्पिक)",photo:"फोटो (वैकल्पिक)"},
 mr:{formTitle:"शेतकऱ्याची माहिती",name:"शेतकऱ्याचे पूर्ण नाव",father:"वडील / पतीचे नाव",dob:"जन्मतारीख",gender:"लिंग",mobile:"मोबाइल नंबर (पर्यायी)",aadhaar:"आधार क्रमांक (पर्यायी)",farmerId:"Farmer ID (अधिकृत नोंदीनुसार)",state:"राज्य",district:"जिल्हा",subdistrict:"तालुका / उपजिल्हा",village:"गाव",survey:"सर्वे / गट क्रमांक (पर्यायी)",area:"क्षेत्रफळ (पर्यायी)",photo:"फोटो (पर्यायी)"},
 en:{formTitle:"Farmer details",name:"Farmer full name",father:"Father / spouse name",dob:"Date of birth",gender:"Gender",mobile:"Mobile number (optional)",aadhaar:"Aadhaar number (optional)",farmerId:"Farmer ID (from official record)",state:"State",district:"District",subdistrict:"Sub-district / Taluka",village:"Village",survey:"Survey / plot number (optional)",area:"Land area (optional)",photo:"Photo (optional)"}
};
function val(id){return $(id).value.trim() || "—"}
function setText(id,text){$(id).textContent=text}
function formatDate(s){if(!s)return "—";const d=new Date(s+"T00:00:00");return d.toLocaleDateString("en-GB")}
function updatePreview(){
 setText("pName",val("name")==="—"?"किसान का नाम":val("name"));
 setText("pNameHindi",val("name")==="—"?"किसान का नाम":val("name"));
 setText("pFather",val("father"));setText("pDob",formatDate($("dob").value));
 const genderMap={Female:"महिला",Male:"पुरुष",Other:"अन्य"};
 setText("pGender",genderMap[$("gender").value]||val("gender"));setText("pMobile",val("mobile"));setText("pId",val("farmerId"));
 const a=$("aadhaar").value.replace(/\D/g,"");
 setText("pAadhaar",a.length===12?"XXXX-XXXX-"+a.slice(-4):"—");
 setText("pState",val("state"));setText("pDistrict",val("district"));setText("pSubdistrict",val("subdistrict"));setText("pVillage",val("village"));setText("pSurvey",val("survey"));setText("pArea",val("area"));
 const q=$("qrCode");q.innerHTML="";
 const qrText="PERSONAL RECORD | Farmer ID: "+val("farmerId")+" | Name: "+val("name");
 if(window.QRCode && val("farmerId")!=="—") new QRCode(q,{text:qrText,width:100,height:100,colorDark:"#172a24",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
 else q.textContent="ID भरें";
}
function saveDetails(){
 // Save regular profile fields on this device only. Aadhaar is deliberately not persisted.
 const data={}; ids.filter(id=>id!=="aadhaar").forEach(id=>{data[id]=$(id).value});
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true}catch(e){return false}
}
function restoreDetails(){
 try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const data=JSON.parse(raw);ids.filter(id=>id!=="aadhaar").forEach(id=>{if(typeof data[id]==="string")$(id).value=data[id]});}catch(e){}
}
restoreDetails();
ids.forEach(id=>$(id).addEventListener("input",()=>{updatePreview();saveDetails()}));
$("gender").addEventListener("change",updatePreview);
$("photo").addEventListener("change",e=>{
 const file=e.target.files && e.target.files[0]; if(!file){photoData="";$("photoPreview").textContent="किसान\nफोटो";return}
 if(file.size>5*1024*1024){$("status").textContent="फोटो 5 MB से छोटी चुनें।";e.target.value="";return}
 const reader=new FileReader();reader.onload=()=>{photoData=reader.result;$("photoPreview").innerHTML="";const img=document.createElement("img");img.src=photoData;img.alt="Farmer photo";$("photoPreview").appendChild(img)};reader.readAsDataURL(file);
});
$("cardForm").addEventListener("submit",e=>{e.preventDefault();updatePreview();$("status").textContent="Preview अपडेट हो गया। जानकारी सही होने की पुष्टि करें।"});
$("cardForm").addEventListener("reset",()=>setTimeout(()=>{photoData="";$("photoPreview").textContent="किसान\nफोटो";$("status").textContent="";localStorage.removeItem(STORAGE_KEY);updatePreview()},0));
$("language").addEventListener("change",()=>{
 const t=translations[$("language").value];Object.keys(t).forEach(k=>{if(k==="formTitle")setText(k,t[k]);else{const el=document.querySelector(`[data-i18n="${k}"]`);if(el)el.textContent=t[k]}})
});
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}
function roundedRect(doc,x,y,w,h,r,style){doc.roundedRect(x,y,w,h,r,r,style)}
function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error("script load failed"));document.head.appendChild(s)})}
async function ensureJsPDF(){
 if(window.jspdf && window.jspdf.jsPDF)return true;
 for(const src of ["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js","https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"]){try{await loadScript(src);if(window.jspdf&&window.jspdf.jsPDF)return true}catch(e){}}
 return false;
}
async function downloadPdf(){
 const status=$("status");
 if(!await ensureJsPDF()){status.textContent="PDF लाइब्रेरी लोड नहीं हुई। इंटरनेट कनेक्शन जाँचकर दोबारा प्रयास करें।";return}
 if(val("name")==="—"||val("farmerId")==="—"){status.textContent="PDF से पहले किसान का नाम और Farmer ID भरें।";return}
 const aadhaarDigits=$("aadhaar").value.replace(/\D/g,"");
 if(aadhaarDigits && !/^\d{12}$/.test(aadhaarDigits)){status.textContent="आधार नंबर वैकल्पिक है, लेकिन भरने पर 12 अंक होने चाहिए।";return}
 saveDetails();status.textContent="जानकारी इस डिवाइस पर सेव हो गई है। PDF तैयार हो रहा है…";
 try{
  const {jsPDF}=window.jspdf;const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4",compress:true});
  const pageW=297,pageH=210,margin=8,gap=5,cardW=(pageW-margin*2-gap)/2,cardH=85,y=(pageH-cardH)/2;
  async function drawCard(x,y,w,h,back){
   doc.setFillColor(255,255,255);doc.setDrawColor(143,185,160);doc.setLineWidth(.5);roundedRect(doc,x,y,w,h,4,"FD");
   doc.setFont("helvetica","bold");doc.setFontSize(13);doc.setTextColor(8,123,75);doc.text("Agri",x+5,y+10);doc.setTextColor(220,180,45);doc.text("Stack",x+16,y+10);
   doc.setFontSize(12);doc.setTextColor(185,156,49);doc.text("FARMER ID CARD",x+w-5,y+10,{align:"right"});
   doc.setDrawColor(226,236,230);doc.line(x+4,y+14,x+w-4,y+14);
   if(!back){
    let px=x+5,py=y+19,pw=24,ph=36;doc.setFillColor(238,245,240);doc.setDrawColor(210,225,216);doc.rect(px,py,pw,ph,"FD");
    if(photoData){try{const img=await loadImage(photoData);const fmt=photoData.includes("image/png")?"PNG":"JPEG";doc.addImage(img,fmt,px+0.5,py+0.5,pw-1,ph-1)}catch(e){}}
    doc.setTextColor(34,55,44);doc.setFont("helvetica","bold");doc.setFontSize(11);doc.text(doc.splitTextToSize(val("name"),w-68),x+33,y+22);
    doc.setFont("helvetica","normal");doc.setFontSize(8);
    const lines=[["Father / Spouse",val("father")],["DOB",formatDate($("dob").value)],["Gender",$("gender").value],["Mobile",val("mobile")],["Aadhaar",aadhaarDigits.length===12?"XXXX-XXXX-"+aadhaarDigits.slice(-4):"—"]];
    let ly=y+31;for(const [k,v] of lines){doc.setTextColor(93,116,103);doc.text(k+":",x+33,ly);doc.setTextColor(35,58,45);doc.text(doc.splitTextToSize(v,w-75),x+56,ly);ly+=8}
    // QR code explicitly contains user-entered text, not a government verification token.
    const qrCanvas=$("qrCode").querySelector("canvas");if(qrCanvas){doc.addImage(qrCanvas.toDataURL("image/png"),"PNG",x+w-27,y+21,21,21)}
    doc.setFontSize(6);doc.setTextColor(90,105,96);doc.text("DATA QR - NOT OFFICIAL VERIFICATION",x+w-5,y+45,{align:"right"});
    doc.setFont("helvetica","bold");doc.setFontSize(7);doc.setTextColor(8,123,75);doc.text("FARMER ID",x+w-5,y+54,{align:"right"});
    doc.setFontSize(14);doc.setTextColor(25,45,35);const idLines=doc.splitTextToSize(val("farmerId"),w-68);doc.text(idLines.slice(0,2),x+w-5,y+61,{align:"right"});
   }else{
    const cols=[["State",val("state")],["District",val("district")],["Sub-district",val("subdistrict")],["Village",val("village")],["Survey No.",val("survey")],["Area",val("area")]];
    const cw=(w-10)/cols.length;let tx=x+5,ty=y+27;
    cols.forEach((c,i)=>{doc.setFillColor(237,246,239);doc.rect(tx+i*cw,ty,cw,10,"F");doc.setDrawColor(220,232,224);doc.rect(tx+i*cw,ty,cw,23);doc.setFont("helvetica","bold");doc.setFontSize(6);doc.setTextColor(87,112,98);doc.text(c[0],tx+i*cw+1.5,ty+4);doc.setFont("helvetica","normal");doc.setFontSize(7);doc.setTextColor(35,58,45);doc.text(doc.splitTextToSize(c[1],cw-3),tx+i*cw+1.5,ty+15)});
    doc.setFontSize(8);doc.setTextColor(100,118,107);doc.text("Location / land details are based on user-entered information.",x+5,y+62);
   }
   doc.setFillColor(11,141,86);doc.rect(x+0.5,y+h-8,w-1,7.5,"F");doc.setFont("helvetica","normal");doc.setFontSize(6);doc.setTextColor(255,255,255);doc.text("PERSONAL RECORD ONLY - NOT A GOVERNMENT-ISSUED CARD",x+4,y+h-3.2);doc.setFont("helvetica","bold");doc.text("Agri Card Studio",x+w-4,y+h-3.2,{align:"right"});
  }
  await drawCard(margin,y,cardW,cardH,false);await drawCard(margin+cardW+gap,y,cardW,cardH,true);
  doc.setFont("helvetica","normal");doc.setFontSize(6);doc.setTextColor(110,120,114);doc.text("Generated from user-provided data. This PDF is not an official Farmer ID or proof of government verification.",pageW/2,pageH-6,{align:"center"});
  doc.save("farmer-details-card.pdf");status.textContent="जानकारी सेव हो गई और PDF डाउनलोड शुरू हो गया। यह व्यक्तिगत रिकॉर्ड है, सरकारी पहचान-पत्र नहीं।";
 }catch(err){status.textContent="PDF नहीं बन पाया। कृपया दोबारा प्रयास करें।"}
}
$("downloadPdf").addEventListener("click",downloadPdf);
$("downloadPdf").textContent="जानकारी सेव करें और PDF डाउनलोड करें";
updatePreview();