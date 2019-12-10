function checkReservationFields(){
   let phone= ($("#custPhone").val()).trim();
   let radio=$('input:radio[name=custTime]:checked').val();
  
   let phcount=0;
   let radcount=0;
   if(phone.length==10){
       
    phcount=0;
   }
   else{
    alert("phone number is not having 10 digit");
    phcount=1;
   }
   if(!radio){

    alert("didn't choose Reservation Time")
    radcount=1;
   }
   else{
       
    radcount=0;
   }
   if(phcount==1||radcount==1){
       return false;
   }
   if(phcount==0&&radcount==0){
       return true;
   }

}
function checkEditReservationFields(){
    
    let radio=$('input:radio[name=custTime]:checked').val();
   
    
    let radcount=0;
    
    if(!radio){
 
     alert("didn't choose Reservation Time")
     radcount=1;
    }
    else{
        
     radcount=0;
    }
    if(radcount==1){
        return false;
    }
    if(radcount==0){
        return true;
    }
 
 }

 function checkFindReservation(){
     let reservationNumber=$("#editReservationNum").val();
     let email=$("#editReservationEmail").val();
     let phone=$("#editReservationPhone").val();
    
     if(!reservationNumber){
         if(email&&phone){
             if(phone.length==10){
                return true;
             }
             else{
                 alert("Phone number is not 10 digit");
                 return false;
             }
             
         }
         else {
             alert("phone/email is missing");
             return false;
         }
     }
     else{
         return true;
     }
 }

 function forgotPasswordMatch(){

    let password=$("#forgotpassword").val();
    let confirmPassword=$("#forgotconfirmpassword").val();

    if(password!=confirmPassword){
        alert("Password and confirm password fields are not matching!!!");
        return false;
    }
    else{
        return true;
    }

 }
 function createPasswordMatch(){

    let password=$("#password").val();
    let confirmPassword=$("#confirmpassword").val();

    if(password!=confirmPassword){
        alert("Password and confirm password fields are not matching!!!");
        return false;
    }
    else{
        return true;
    }

 }

 function restaurantTimeslotCheck(){
     let timeslot=$("#restaurantTime").val()
     let count=0;
     try{
        timeArray=timeslot.split(",")
        
        let patt=/^(\d\d\.\d\d)$/
        timeArray.forEach(time=>{
            if(!patt.test(time)){
                count=1;
            }
        })
        if(count==1){
            alert("Time slots not in proper format. Please correct errors.");
            return false;
        }
        else{
            return true;
        }

     }
     catch(e){
         return false;
     }
     

 }