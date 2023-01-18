
function start() {
return new Date().getTime();
}
function end(startTime) {

    var URLParamsArr = new URLSearchParams(window.location.search)
    console.log(URLParamsArr.userID)
    var studentId = URLParamsArr.get('userID');
    var teacherID = URLParamsArr.get('teacherID');
    // var assessmentID = URLParamsArr.get('ass')
    const end = new Date().getTime();
    const totalTime = (end - startTime) / 1000;
    const details = {
        studentId: studentId,
        // assessmenttId: assessmenttId,
        teacherID: teacherID,
        // correct: correct,
        // incorrect: incorrect,
        // totalOptions: totalOptions,
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
            "userID": details.studentId,
            "teacherID": details.teacherID,
            "time_spent": details.time
        })
    });

    response.json().then(data => {
        console.log(data);
    });
}
export  { start, end };