import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js'
import { collection } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js'
import {getDocs} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js'
import {addDoc} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js'




const firebaseConfig = {
  apiKey: "AIzaSyDvFy47TdWeWF3E8TSaN30s2Si5eqk6WFw",
  authDomain: "publicboard-b5646.firebaseapp.com",
  projectId: "publicboard-b5646",
  storageBucket: "publicboard-b5646.appspot.com",
  messagingSenderId: "1086809892184",
  appId: "1:1086809892184:web:cab301fa41a3dbff25f12d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();


const colRef  = collection(db,"threads");


let documents = [];
const form = document.getElementById("addThread");
var imageUrl = "";


getDocs(colRef).then((snapshot)=>{getdocuments(snapshot)});
createDocuments();



function  getdocuments(snap)
{
    var index = 0;
    var docsLength = snap.docs.length;
    snap.docs.forEach(element => {
        documents.push({...element.data()});
        if(index == snap.docs.length-1 ){
            createDocuments();
        }
        index++;
    });
}

function createDocuments()
{
    
    documents.forEach(element => {createElement(element.username,element.title,element.datetime,element.imageurl,element.content,element.id)});

}

function createElement(name , title , dateTime , imageUrl,content ,id)
{
    var body = document.getElementById("main");
    
    var thread = document.createElement("div");
    thread.id = id;
    thread.addEventListener("click" ,reply_click);
    thread.className = "thread";
    thread.style = "z-index: "+parseInt(id)+"; position:absolute";

//////////////////////////////////////////////////////////////////
//UPPER CONTENT
var centralDiv = document.createElement("div");

    var outerLabel = document.createElement("label");
    centralDiv.appendChild( outerLabel);

    var threadTitle = document.createElement("label");
    threadTitle.className = "threadTitle";
    threadTitle.innerHTML = title;//change this to dynamic
    threadTitle.style = "margin:0px 8px 0 0";

    outerLabel.appendChild(threadTitle);

    var threadUser = document.createElement("label");
    threadUser.className = "threadUser";
    threadUser.innerText = name // change to dynamic


    outerLabel.appendChild(threadUser);

    var timeDateDiv = document.createElement("div");
    timeDateDiv.style = "display: inline-block; padding: 0; margin: 0;";

    outerLabel.append(timeDateDiv);

    var timeDatePara = document.createElement("p");
    timeDatePara.style = " padding: 0; margin: 0; display: inline-block;";
    timeDatePara.innerText = dateTime.toLocaleString() ;



 


    outerLabel.appendChild(timeDatePara);
    var imageLink = document.createElement("a");
    imageLink.innerHTML = "[Image]";
    imageLink.href = imageUrl;
    outerLabel.appendChild(imageLink);
    var spacerP = document.createElement("label");
    spacerP.innerHTML = "    ";
    outerLabel.appendChild(spacerP);
    var replyLink = document.createElement("a");
    replyLink.innerHTML = "[Reply]";
    replyLink.href = imageUrl;
    outerLabel.appendChild(replyLink);
    
    
//UPPER CONTENT
//////////////////////////////////////////////////////////////////
//LOWER CONTENT

    
    var lowerMainDiv = document.createElement("div");
    lowerMainDiv.className = "threadContent";
    thread.appendChild(lowerMainDiv);

    var contentLeftDiv = document.createElement("div");
    contentLeftDiv.className = "threadImage";
    lowerMainDiv.appendChild(contentLeftDiv);
    
    var contentImage = new Image();
    contentImage.src = imageUrl;// change this dyamically
    contentImage.style = "max-width: 120px;";
    contentLeftDiv.appendChild(contentImage);


    //

    var textDiv = document.createElement("div");
    textDiv.className = "threadText";
    textDiv.style = "width:100%";

    var textParaGraph = document.createElement("p");
    textParaGraph.style = "margin:0";
    textParaGraph.innerText = content //change this dynamically
    
    textDiv.appendChild(textParaGraph);

    lowerMainDiv.appendChild(textDiv);


    thread.appendChild(centralDiv);
    thread.appendChild(lowerMainDiv);
    


    body.appendChild(thread);

    var screenWidth = screen.width;
    var screenHeight = screen.height;

    var randomX = Math.floor(Math.random() * screenWidth) ;
    var randomY = Math.floor(Math.random() * screenHeight) ;
    console.log(randomX +" " +randomY);
    thread.style.transform = "translate(+"+randomX+"px"+", +"+randomY+"px"+")";
    thread.setAttribute("data-x",randomX);
    thread.setAttribute("data-y",randomY);




}



form.addEventListener("submit" , (e)=>{
    e.preventDefault();

    if(form.Name.value.length<=0)
    {
        alert("Enter Name!");
    }
    else if(form.Topic.value.length<=0)
    {
        alert("Enter Topic!");
        }
    else if(form.Content.value.length<=5)
    {
        alert("Content not enough!");

    }
   else if(imageUrl.length<=5)
   {
       alert("image not correct")
   }else{
    getDocs(colRef).then((snapshot)=>{sendDataToServer( snapshot.docs.length)});

   }



});

function sendDataToServer(length){

    addDoc(colRef, {
        username:form.Name.value,
        title:form.Topic.value,
        content:form.Content.value,
        datetime:(new Date()).toUTCString(),
        imageurl: imageUrl,
        id:length+1

    }).then(
        (onResolved) => {
            location.reload();


        },
        (onRejected) => {
           
            alert("post failed !");
        }
    );

}

document.getElementById("input_img").addEventListener("change",fileChange)

function fileChange(){
    var file = document.getElementById('input_img');
    var form = new FormData();
    form.append("image", file.files[0])
    
    var settings = {
      "url": "https://api.imgbb.com/1/upload?key=a508af09bf9eccd8b3f953428b2fb81f",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    document.getElementById("loader").style = "display:block; width: 20px;";

    
    $.ajax(settings).done(function (response) {
      console.log(response);
      var jx = JSON.parse(response);
      imageUrl = jx.data.url;
      console.log(jx.data.url);
    }).then(
    (onResolved) => {
        document.getElementById("postBtn").style = "display:block";
        document.getElementById("loader").style = "display:none; width: 20px;";

    },
    (onRejected) => {
        document.getElementById("postBtn").style = "display:none ";
        document.getElementById("loader").style = "display:none; width: 20px;";
        alert("image upload failed!");

    }
)}



var formGui=  document.getElementById("form");

var openFormBtn =  document.getElementById("openForm");
document.getElementById("openForm").addEventListener("click",openForm);

document.getElementById("close").addEventListener("click",closeForm);


function closeForm()
{
    formGui.style  = "display: none;";
    openFormBtn.style = "position: absolute;bottom: 0; right: 0; z-index: 100000000000; display:block;font-size: 20px;font-weight: bold;background-color: #E4D1B9; ";
    
}

function openForm()
{
    formGui.style  = "display: flex;flex-direction: row;"

    openFormBtn.style = "position: absolute;bottom: 0; right: 0; z-index: 100000000000; display:none;font-size: 20px;font-weight: bold;background-color: #E4D1B9;";

}

var previousDiv = null;
     
function reply_click(evt)
{

    console.log(evt.target.offsetParent);
    if(previousDiv!=null)
    {
        if(previousDiv!= evt.target.offsetParent)
        {
            
            previousDiv.style.zIndex = 0;
            previousDiv= evt.target.offsetParent;

        }
       

    }

    evt.target.offsetParent.style.zIndex = 10 ;
    previousDiv= evt.target.offsetParent;

    console.log(previousDiv.style.zIndex);


}