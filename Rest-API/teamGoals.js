const https = require('https');


const getData = (url) => new Promise((resolve, reject) => {
    const body = {};
    const totalPages = 1;
    const request = https.get(url, (response) => {

        if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(new Error('statusCode=' + response.statusCode));
        }

        response.on("data", (chunk) => {
            let receivedJson = JSON.parse(chunk);
            body.total_pages = receivedJson.total_pages;
            body.data = receivedJson.data
        });

        response.on("end", () => {
            resolve(body);
        });

        response.on("error", (error) => {
            reject(error);
        })

    })
})


async function getTeamGoals(team, year) {
    let page = 1, totalGoals = 0, goals = [], totalPages = 1, allMatchesData = [];

    do {
        const url1 = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1=${team}&page=${page}`;

        let { total_pages, data } = await getData(url1);
        totalPages = total_pages;
        allMatchesData.push(...data);

    } while (page < totalPages && page++);

    allMatchesData.forEach(match => {
        goals.push(parseInt(match.team1goals));
    });

    page = 1, allMatchesData = [];
    do {
        const url2 = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team2=${team}&page=${page}`;

        let { total_pages, data } = await getData(url2);
        totalPages = total_pages;
        allMatchesData.push(...data);

    } while (page < totalPages && page++);


    allMatchesData.forEach(match => {
        goals.push(parseInt(match.team2goals));
    })
    totalGoals = goals.reduce((a, b) => a + b, 0);
    console.log(totalGoals);
    return totalGoals;
}

getTeamGoals("Barcelona", 2011);



