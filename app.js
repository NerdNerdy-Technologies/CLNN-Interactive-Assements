
function start() {
return new Date().getTime();
}
function end(startTime) {

// function getParams(){
    // var query_string= window.location.search;
    var URLParamsArr = new URLSearchParams(window.location.search)
    console.log(URLParamsArr)
    var studentId = URLParamsArr.get('userID');
    // console.log(studentId)
    if(teacherID){
        var teacherID = URLParamsArr.get('userID');
    }
    else{
        var teacherID = "";
    }
    const end = new Date().getTime();
    const totalTime = (end - startTime) / 1000;
    const details = {
        studentId: studentId,
        assessmenttId: assessmenttId,
        teacherID: teacherID,
        // correct: correct,
        // incorrect: incorrect,
        // totalOptions: totalOptions,
        timeSpend: totalTime,
    };
    // console.log(details);
    uploadData(details);
}
async function uploadData(details) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userID": details.studentId,
            "assessmentID": details.assessmenttId,
            "time_spent": details.time
        })
    });

    response.json().then(data => {
        console.log(data);
    });
}
export  { start, end };