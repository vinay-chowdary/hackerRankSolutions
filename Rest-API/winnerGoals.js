



const https = require('https');

const getWinner = (url) => new Promise((resolve, reject) => {
    const body = {};
    const request = https.get(url, response => {
        response.on("data", (chunk) => {
            body.winner = JSON.parse(chunk).data[0].winner;
        });
        response.on("end", () => {
            resolve(body);
        });
        response.on("error", (error) => {
            reject(error);
        });
    })
});


const getData = (url) => new Promise((resolve, reject) => {
    const body = {};
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
    request.end();
})


async function getWinnerTotalGoals(competition, year) {
    const url = `https://jsonmock.hackerrank.com/api/football_competitions?name=${competition}&year=${year}`;
    let { winner } = await getWinner(url);

    let page = 1, totalGoals = 0, goals = [], totalPages = 1, allMatchesData = [];
    
    

    do {
    const url1 = `https://jsonmock.hackerrank.com/api/football_matches?competition=${competition}&year=${year}&team1=${winner}&page=${page}`;
        let { total_pages, data } = await getData(url1);
        totalPages = total_pages;
        allMatchesData.push(...data);

    } while (page < totalPages && page++);

    allMatchesData.forEach(match => {
        goals.push(parseInt(match.team1goals));
    });

    page = 1, allMatchesData = [];
    do {
    const url2 = `https://jsonmock.hackerrank.com/api/football_matches?competition=${competition}&year=${year}&team2=${winner}&page=${page}`;
        let { total_pages, data } = await getData(url2);
        totalPages = total_pages;
        allMatchesData.push(...data);

    } while (page < totalPages && page++);


    allMatchesData.forEach(match => {
        goals.push(parseInt(match.team2goals));
    })

    totalGoals = goals.reduce((a, b) => a + b, 0);
    console.log(totalGoals);
}

getWinnerTotalGoals("UEFA Champions League", 2011);
