
function start() {
return new Date().getTime();
}
function end(startTime) {
    const end = new Date().getTime();
    const totalTime = (end - startTime) / 1000;
    const details = {
        name: "piyush",
        time: totalTime,
        userID: "1234",
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