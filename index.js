window.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loginLogoutLi = document.getElementById('loginLogoutLi');
    
    if (loggedInUser) {
        loginLogoutLi.innerHTML = `<a href="#" onclick="logout()">Logout (${loggedInUser})</a>`;
    }
});

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

function updateDisplay(menuType) {
    // This finds the div with the ID 'plan-next-route'
    const display = document.getElementById('plan-next-route');

    if (menuType === 'plan') {
        // "Road Density" form
        display.innerHTML = `
            <div class="searchBar">
                    <input type="text" placeholder="Please enter a road name...">
                </div>

                <div class="roadDensity">
                    <div class="raodDensityText">
                        <h2>Road Density</h2>
                    </div>
                    <div class="checkBoxes">
                        <label>
                            <input type="checkbox">Shallow
                        </label>
                        <label>
                            <input type="checkbox"> Medium
                        </label>
                        <label>
                            <input type="checkbox"> Deep
                        </label> 
                    </div>
                </div>

                <div class="averageLength">
                    <div class="averageLengthHeader">
                        <h2>Average Length Between Potholes</h2>
                    </div>
                    <div class="averageLengthText">
                        <input type="text" placeholder="Info...">
                    </div>
                </div>

                <div class="averageDepth">
                    <div class="averageDepthHeader">
                        <h2>Average Depth of Potholes</h2>
                    </div>
                    <div class="averageDepthText">
                        <input type="text" placeholder="Info...">
                    </div>
                </div>
            </div>
        `;
    } 

    else if (menuType === 'about') {
        display.innerHTML = `
            <div id="aboutRoadSearchBar">
                <input type="text" placeholder="Please enter a road name...">
            </div>

            <div class="nameOfRoad">
                <h2>Name of Road</h2>
            </div>

            <div class="typeOfRoad">
                <h2>Type of Road</h2>
            </div>

            <div class="lengthOfRoad">
                <h2>Length of Road</h2>
            </div>
        `;
    }

    else if (menuType === 'estimate-cost') {
        display.innerHTML = `

            <div id="estimateCostSearchBar">
                <input type="text" placeholder="Please enter a road name...">
            </div>
        `;
    }

    else if (menuType === 'road-cost') {
        display.innerHTML = `
            <div class="roadCost">
                <h2>Cost of Repairing Road</h2>
            </div>
        `;
    }

    else if (menuType === 'decay') {
        display.innerHTML = `
            <div class="decay">
                <h2>Road Decay</h2>
            </div>
        `;
    }
} 