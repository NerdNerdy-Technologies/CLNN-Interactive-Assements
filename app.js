
function start() {
return new Date().getTime();
}
function end(startTime,totalOptions) {

    var URLParamsArr = new URLSearchParams(window.location.search)
    var studentId = URLParamsArr.get('userID');
    var teacherID = URLParamsArr.get('teacherID');
    // var assessmentID = URLParamsArr.get('ass')
    const end = new Date().getTime();
    const totalTime = (end - startTime) / 1000;
    const details = {
        studentId: studentId,
        teacherID: teacherID,
        totalOptions: totalOptions,
        timeSpend: totalTime,
    };
    uploadData(details);
}
async function uploadData(details) {
    const response = await fetch("https://cbqrznufal.execute-api.ap-south-1.amazonaws.com/default/CLNN-AssmentsHandler", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        params: {
            "queryType": "addResult"
        },
        body: JSON.stringify({
            "studentId": details.studentId,
            "teacherID": details.teacherID,
            "assessmenttId": details.studentId + Date.now(),
            "timeSpend": details.timeSpend,
            "correct": "correct",
            "totalOptions": details.totalOptions,
        })
    });

    response.json().then(data => {
        console.log(data);
    });
}
export  { start, end };