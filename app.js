
function start() {
return new Date().getTime();
}
function end(startTime) {

// function getParams(){
    // var query_string= window.location.search;
    var URLParamsArr = new URLSearchParams(window.location.search)
    var studentId = URLParamsArr.get('userID');
    var assessmenttId = URLParamsArr.get('userID');
    var teacherID = URLParamsArr.get('userID');
    var correct = URLParamsArr.get('userID');
    var incorrect = URLParamsArr.get('userID');
    var totalOptions = URLParamsArr.get('userID');
    var timeSpend = URLParamsArr.get('userID');
    // return userID;

    // {
    //     "studentId": body.studentId,
    //     "assessmenttId": body.assessmenttId,
    //     "teacherID": body.teacherID,
    //     "correct": body.correct,
    //     "incorrect": body.incorrect,
    //     "totalOptions": body.totalOptions,
    //     "timeSpend": body.timeSpend,
    // }
//   }
//   var params = getParams();
//   document.getElementById("param").innerHTML = params;
    const end = new Date().getTime();
    const totalTime = (end - startTime) / 1000;
    const details = {
        studentId: studentId,
        assessmenttId: assessmenttId,
        teacherID: teacherID,
        correct: correct,
        incorrect: incorrect,
        totalOptions: totalOptions,
        timeSpend: totalTime,
    };
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
            "userID": details.userID,
            "Name": details.name,
            "time_spent": details.time
        })
    });

    response.json().then(data => {
        console.log(data);
    });
}
export  { start, end };