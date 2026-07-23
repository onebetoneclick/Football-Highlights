// ==========================================
// FOOTBALL LIVE HUB
// APP.JS (PART 1)
// ==========================================

// ==========================================
// BACKEND API
// ==========================================

const BASE_URL = "https://football-backend-ojgg.onrender.com/api";

// ==========================================
// DOM ELEMENTS
// ==========================================

const liveMatches = document.getElementById("liveMatches");
const upcomingMatches = document.getElementById("upcomingMatches");
const competitionContainer = document.getElementById("competitionContainer");
const standingsPreview = document.getElementById("standingsPreview");
const featuredTeams = document.getElementById("featuredTeams");
const topScorers = document.getElementById("topScorers");
const viewMatchesBtn = document.getElementById("viewMatches");

// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

// ==========================================
// INITIALIZE APP
// ==========================================

async function initializeApp() {

    await Promise.all([

        loadMatches(),
        loadCompetitions(),
        loadStandings(),
        loadTeams(),
        loadScorers()

    ]);

}

// ==========================================
// VIEW LIVE MATCHES BUTTON
// ==========================================

if (viewMatchesBtn) {

    viewMatchesBtn.addEventListener("click", () => {

        liveMatches.scrollIntoView({

            behavior: "smooth"

        });

    });

}

// ==========================================
// LOAD LIVE & UPCOMING MATCHES
// ==========================================

async function loadMatches() {

    try {

        const [

            liveResponse,
            upcomingResponse

        ] = await Promise.all([

            fetch(`${BASE_URL}/matches`),
            fetch(`${BASE_URL}/upcoming`)

        ]);

        const liveData = await liveResponse.json();
        const upcomingData = await upcomingResponse.json();

        const live = (liveData.matches || []).filter(match =>

            match.status === "LIVE" ||
            match.status === "IN_PLAY" ||
            match.status === "PAUSED"

        );

        const upcoming = upcomingData.matches || [];

        renderLiveMatches(live);

        renderUpcomingMatches(upcoming);

    }

    catch (error) {

        console.error(error);

        liveMatches.innerHTML = `

            <div class="no-match">

                Unable to load live matches.

            </div>

        `;

        upcomingMatches.innerHTML = `

            <div class="no-match">

                Unable to load upcoming fixtures.

            </div>

        `;

    }

}
// ==========================================
// RENDER LIVE MATCHES
// ==========================================

function renderLiveMatches(matches) {

    if (matches.length === 0) {

        liveMatches.innerHTML = `

            <div class="no-match">

                🔴 No live football available at the moment.

            </div>

        `;

        return;

    }

    liveMatches.innerHTML = "";

    matches.forEach(match => {

        const homeScore = match.score?.fullTime?.home ?? "-";
        const awayScore = match.score?.fullTime?.away ?? "-";

        liveMatches.innerHTML += `

            <div class="match-card">

                <h3>${match.homeTeam.name}</h3>

                <p><strong>VS</strong></p>

                <h3>${match.awayTeam.name}</h3>

                <p>

                    <strong>Competition:</strong>

                    ${match.competition.name}

                </p>

                <p>

                    <strong>Score:</strong>

                    ${homeScore} - ${awayScore}

                </p>

                <span class="live-badge">

                    🔴 ${match.status}

                </span>

            </div>

        `;

    });

}

// ==========================================
// RENDER UPCOMING MATCHES
// ==========================================

function renderUpcomingMatches(matches) {

    if (matches.length === 0) {

        upcomingMatches.innerHTML = `

            <div class="no-match">

                No upcoming fixtures available.

            </div>

        `;

        return;

    }

    upcomingMatches.innerHTML = "";

    matches.forEach(match => {

        const date = new Date(match.utcDate);

        const matchDate = date.toLocaleDateString(undefined, {

            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"

        });

        const matchTime = date.toLocaleTimeString([], {

            hour: "2-digit",
            minute: "2-digit"

        });

        upcomingMatches.innerHTML += `

            <div class="match-card">

                <h3>${match.homeTeam.name}</h3>

                <p><strong>VS</strong></p>

                <h3>${match.awayTeam.name}</h3>

                <p>

                    <strong>Competition:</strong>

                    ${match.competition.name}

                </p>

                <p>

                    <strong>Date:</strong>

                    ${matchDate}

                </p>

                <p>

                    <strong>Kick-off:</strong>

                    ${matchTime}

                </p>

                <span class="upcoming-badge">

                    📅 Scheduled

                </span>

            </div>

        `;

    });

}

// ==========================================
// REFRESH MATCHES EVERY 60 SECONDS
// ==========================================

setInterval(() => {

    loadMatches();

}, 60000);
// ==========================================
// LOAD COMPETITIONS
// ==========================================

async function loadCompetitions() {

    try {

        const response = await fetch(`${BASE_URL}/competitions`);

        const data = await response.json();

        renderCompetitions(data.competitions || []);

    } catch (error) {

        console.error(error);

        competitionContainer.innerHTML = `

            <div class="no-match">

                Unable to load competitions.

            </div>

        `;

    }

}

// ==========================================
// RENDER COMPETITIONS
// ==========================================

function renderCompetitions(competitions) {

    competitionContainer.innerHTML = "";

    competitions.forEach(competition => {

        competitionContainer.innerHTML += `

            <div class="competition-card">

                <img
                    src="${competition.emblem}"
                    alt="${competition.name}"
                    loading="lazy"
                >

                <h3>${competition.name}</h3>

                <p>${competition.area.name}</p>

            </div>

        `;

    });

}

// ==========================================
// LOAD PREMIER LEAGUE STANDINGS
// ==========================================

async function loadStandings() {

    try {

        const response = await fetch(`${BASE_URL}/standings/2021`);

        const data = await response.json();

        if (!data.standings || !data.standings.length) {

            standingsPreview.innerHTML = `

                <tr>

                    <td colspan="3">

                        No standings available.

                    </td>

                </tr>

            `;

            return;

        }

        renderStandings(data.standings[0].table);

    } catch (error) {

        console.error(error);

        standingsPreview.innerHTML = `

            <tr>

                <td colspan="3">

                    Unable to load standings.

                </td>

            </tr>

        `;

    }

}

// ==========================================
// RENDER STANDINGS
// ==========================================

function renderStandings(table) {

    standingsPreview.innerHTML = "";

    table.slice(0, 10).forEach(team => {

        standingsPreview.innerHTML += `

            <tr>

                <td>${team.position}</td>

                <td>

                    <img
                        src="${team.team.crest}"
                        alt="${team.team.name}"
                        width="24"
                        height="24"
                    >

                    ${team.team.shortName || team.team.name}

                </td>

                <td>

                    <strong>${team.points}</strong>

                </td>

            </tr>

        `;

    });

}
// ==========================================
// LOAD FEATURED TEAMS
// ==========================================

async function loadTeams() {

    try {

        const response = await fetch(`${BASE_URL}/teams/2021`);

        const data = await response.json();

        renderTeams(data.teams || []);

    } catch (error) {

        console.error(error);

        featuredTeams.innerHTML = `

            <div class="no-match">

                Unable to load teams.

            </div>

        `;

    }

}

// ==========================================
// RENDER FEATURED TEAMS
// ==========================================

function renderTeams(teams) {

    featuredTeams.innerHTML = "";

    teams.slice(0, 10).forEach(team => {

        featuredTeams.innerHTML += `

            <div class="team-card">

                <img
                    src="${team.crest}"
                    alt="${team.name}"
                    loading="lazy"
                >

                <h3>${team.shortName || team.name}</h3>

                <p>${team.venue || "Unknown Stadium"}</p>

            </div>

        `;

    });

}

// ==========================================
// LOAD TOP SCORERS
// ==========================================

async function loadScorers() {

    try {

        const response = await fetch(`${BASE_URL}/scorers/2021`);

        const data = await response.json();

        renderScorers(data.scorers || []);

    } catch (error) {

        console.error(error);

        topScorers.innerHTML = `

            <div class="no-match">

                Unable to load top scorers.

            </div>

        `;

    }

}

// ==========================================
// RENDER TOP SCORERS
// ==========================================

function renderScorers(players) {

    topScorers.innerHTML = "";

    players.slice(0, 10).forEach((player, index) => {

        featuredTeams.innerHTML += "";

        topScorers.innerHTML += `

            <div class="scorer-card">

                <h3>

                    #${index + 1}
                    ${player.player.name}

                </h3>

                <p>

                    <strong>Team:</strong>

                    ${player.team.name}

                </p>

                <p>

                    <strong>Goals:</strong>

                    ${player.goals}

                </p>

                <p>

                    <strong>Nationality:</strong>

                    ${player.player.nationality || "Unknown"}

                </p>

            </div>

        `;

    });

}

// ==========================================
// REFRESH HOMEPAGE
// ==========================================

setInterval(() => {

    loadMatches();
    loadCompetitions();
    loadStandings();
    loadTeams();
    loadScorers();

}, 60000);

// ==========================================
// END OF APP.JS
// ==========================================