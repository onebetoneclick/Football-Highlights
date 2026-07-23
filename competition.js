// ==========================================
// FOOTBALL LIVE HUB
// COMPETITION.JS (PART 1)
// ==========================================

// ==========================================
// BACKEND
// ==========================================

const BASE_URL = "https://football-backend-ojgg.onrender.com/api";

// ==========================================
// GET COMPETITION ID
// Example:
// competition.html?id=2021
// ==========================================

const urlParams = new URLSearchParams(window.location.search);

const competitionId = urlParams.get("id") || "2021";

// ==========================================
// DOM ELEMENTS
// ==========================================

const competitionLogo = document.getElementById("competitionLogo");
const competitionName = document.getElementById("competitionName");
const competitionCountry = document.getElementById("competitionCountry");

const country = document.getElementById("country");
const season = document.getElementById("season");
const type = document.getElementById("type");
const matchday = document.getElementById("matchday");

const standingsTable = document.getElementById("standingsTable");
const teamsContainer = document.getElementById("teamsContainer");
const scorersContainer = document.getElementById("scorersContainer");
const fixturesContainer = document.getElementById("fixturesContainer");

const standingsBtn = document.getElementById("standingsBtn");
const teamsBtn = document.getElementById("teamsBtn");
const scorersBtn = document.getElementById("scorersBtn");
const fixturesBtn = document.getElementById("fixturesBtn");

// ==========================================
// START PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCompetitionInfo();

    loadStandings();

    loadTeams();

    loadScorers();

    showFixturesComingSoon();

});

// ==========================================
// SMOOTH SCROLL
// ==========================================

standingsBtn.addEventListener("click", (e) => {

    e.preventDefault();

    document.querySelector(".table-section").scrollIntoView({

        behavior: "smooth"

    });

});

teamsBtn.addEventListener("click", (e) => {

    e.preventDefault();

    document.querySelector(".teams-section").scrollIntoView({

        behavior: "smooth"

    });

});

scorersBtn.addEventListener("click", (e) => {

    e.preventDefault();

    document.querySelector(".scorers-section").scrollIntoView({

        behavior: "smooth"

    });

});

fixturesBtn.addEventListener("click", (e) => {

    e.preventDefault();

    document.querySelector(".fixtures-section").scrollIntoView({

        behavior: "smooth"

    });

});


// ==========================================
// LOAD COMPETITION INFORMATION
// ==========================================

async function loadCompetitionInfo() {

    try {

        const response = await fetch(`${BASE_URL}/competitions`);

        const data = await response.json();

        const competition = data.competitions.find(item =>

            item.id == competitionId

        );

        if (!competition) {

            competitionName.textContent = "Competition Not Found";

            return;

        }

        competitionLogo.src = competition.emblem;

        competitionName.textContent = competition.name;

        competitionCountry.textContent = competition.area.name;

        country.textContent = competition.area.name;

        type.textContent = competition.type;

        season.textContent =

            competition.currentSeason.startDate +

            " → " +

            competition.currentSeason.endDate;

        matchday.textContent =

            competition.currentSeason.currentMatchday || "N/A";

    }

    catch (error) {

        console.error(error);

        competitionName.textContent =

            "Unable to load competition.";

    }

}
// ==========================================
// LOAD STANDINGS
// ==========================================

async function loadStandings() {

    try {

        const response = await fetch(

            `${BASE_URL}/standings/${competitionId}`

        );

        const data = await response.json();

        if (!data.standings || !data.standings.length) {

            standingsTable.innerHTML = `

                <tr>

                    <td colspan="5">

                        No standings available.

                    </td>

                </tr>

            `;

            return;

        }

        renderStandings(data.standings[0].table);

    }

    catch (error) {

        console.error(error);

        standingsTable.innerHTML = `

            <tr>

                <td colspan="5">

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

    standingsTable.innerHTML = "";

    table.forEach(team => {

        standingsTable.innerHTML += `

            <tr>

                <td>

                    ${team.position}

                </td>

                <td style="text-align:left;">

                    <img

                        src="${team.team.crest}"

                        width="24"

                        height="24"

                        style="vertical-align:middle;margin-right:10px;"

                    >

                    ${team.team.shortName || team.team.name}

                </td>

                <td>

                    ${team.playedGames}

                </td>

                <td>

                    ${team.goalDifference}

                </td>

                <td>

                    <strong>

                        ${team.points}

                    </strong>

                </td>

            </tr>

        `;

    });

}
// ==========================================
// LOAD TEAMS
// ==========================================

async function loadTeams() {

    try {

        const response = await fetch(

            `${BASE_URL}/teams/${competitionId}`

        );

        const data = await response.json();

        renderTeams(data.teams || []);

    }

    catch (error) {

        console.error(error);

        teamsContainer.innerHTML = `

            <div class="no-match">

                Unable to load teams.

            </div>

        `;

    }

}

// ==========================================
// RENDER TEAMS
// ==========================================

function renderTeams(teams) {

    if (!teams.length) {

        teamsContainer.innerHTML = `

            <div class="no-match">

                No teams available.

            </div>

        `;

        return;

    }

    teamsContainer.innerHTML = "";

    teams.forEach(team => {

        teamsContainer.innerHTML += `

            <div class="team-card">

                <img

                    src="${team.crest}"

                    alt="${team.name}"

                    loading="lazy"

                >

                <h3>

                    ${team.shortName || team.name}

                </h3>

                <p>

                    <strong>Founded:</strong>

                    ${team.founded || "N/A"}

                </p>

                <p>

                    <strong>Venue:</strong>

                    ${team.venue || "Unknown"}

                </p>

                <p>

                    <strong>Club Colors:</strong>

                    ${team.clubColors || "N/A"}

                </p>

                <p>

                    <strong>Website:</strong>

                    <a

                        href="${team.website}"

                        target="_blank"

                        style="color:#22c55e;"

                    >

                        Visit Club

                    </a>

                </p>

            </div>

        `;

    });

}
// ==========================================
// LOAD TOP SCORERS
// ==========================================

async function loadScorers() {

    try {

        const response = await fetch(

            `${BASE_URL}/scorers/${competitionId}`

        );

        const data = await response.json();

        renderScorers(data.scorers || []);

    }

    catch (error) {

        console.error(error);

        scorersContainer.innerHTML = `

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

    if (!players.length) {

        scorersContainer.innerHTML = `

            <div class="no-match">

                No top scorers available.

            </div>

        `;

        return;

    }

    scorersContainer.innerHTML = "";

    players.forEach((player, index) => {

        scorersContainer.innerHTML += `

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
// FIXTURES PLACEHOLDER
// ==========================================

function showFixturesComingSoon() {

    fixturesContainer.innerHTML = `

        <div class="no-match">

            <h3>📅 Fixtures Coming Soon</h3>

            <p>

                This section will display all fixtures and results
                for this competition after the fixtures backend
                route is added.

            </p>

        </div>

    `;

}


// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(() => {

    loadCompetitionInfo();

    loadStandings();

    loadTeams();

    loadScorers();

}, 60000);

// ==========================================
// END OF COMPETITION.JS
// ==========================================