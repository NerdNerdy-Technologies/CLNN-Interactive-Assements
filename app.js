
function start() {
    return new Date().getTime();
}
function end(startTime, totalOptions) {

    var URLParamsArr = new URLSearchParams(window.location.search)
    var studentId = URLParamsArr.get('userID');
    var teacherID = URLParamsArr.get('teacherID');
    const end = new Date().getTime();
    const totalTime = (end - startTime);
    const details = {
        studentId: studentId,
        teacherID: teacherID,
        totalOptions: totalOptions,
        timeSpend: totalTime,
    };
    uploadData(details);
}//"https://jsonplaceholder.typicode.com/posts", {
    // https://cbqrznufal.execute-api.ap-south-1.amazonaws.com/default/CLNN-AssmentsHandler?queryType=addResult
async function uploadData(details) {
    const response = await fetch("https://cbqrznufal.execute-api.ap-south-1.amazonaws.com/default/CLNN-AssmentsHandler?queryType=addResult", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "studentId": details.studentId,
            "teacherID": details.teacherID,
            "assessmenttId": "nn-assesment-group-3=" + window.location.pathname,
            "assementTime": details.timeSpend,
            "assesmentScore": details.totalOptions,
            "assesmentMetadata": ""
        })
    });

    response.json().then(data => {
        console.log(data);
    });
}
export { start, end };