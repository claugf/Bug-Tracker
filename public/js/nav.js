$(document).ready(function(){
    // Using Jquery to toggle a class helping us to hidde part of the sidebar
    $(".hamburger").click(function() {
        $(".wrapper").toggleClass("collapse");
        saveStatus();
    })

    // Using Jquery to toggle a class helping us to hidde part of the login/out section
    $(".top_menu li .fas.fa-user").click(function() {
        $(".profile_dd").toggleClass("collapse");
    })

    //Function to toggle wrapper status
    function saveStatus(){
        if(localStorage.getItem("wraperStatus") == "true"){
            localStorage.setItem("wraperStatus", "false");
        }else{
            localStorage.setItem("wraperStatus", "true");
        }
    }

    //Warning about the session expired
    if(localStorage.getItem("SessionExpired") == "true"){
        localStorage.setItem("SessionExpired", "false");
        alert("Your session has been expired!");
    }
});

//Check if wrapper has been collapsed in previus pages
$('.hamburger').ready(function() {
    if(localStorage.getItem("wraperStatus") == "true"){
        $(".wrapper").toggleClass("collapse");
    }
});