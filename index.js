// index.js
document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("#state-input");
    const fetchButton = document.querySelector("#fetch-alerts");
    const displayDiv = document.querySelector("#alerts-display");
    const errorDiv = document.querySelector("#error-message");

    fetchButton.addEventListener("click", async () => {
        const state = input.value.trim().toUpperCase();

        // Clear previous results and errors
        displayDiv.innerHTML = "";
        errorDiv.textContent = "";
        errorDiv.classList.add("hidden");

        // Clear the input for every request
        input.value = "";

        try {
            if (!state) {
                throw new Error("Please enter a state abbreviation.");
            }

            if (!/^[A-Z]{2}$/.test(state)) {
                throw new Error("Please enter a valid two-letter state abbreviation.");
            }

            const response = await fetch(
                `https://api.weather.gov/alerts/active?area=${state}`
            );

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const data = await response.json();

            // Display the API title and number of alerts
            const summary = document.createElement("h2");
            summary.textContent = `${data.title}: ${data.features.length}`;
            displayDiv.appendChild(summary);

            // Display each alert headline
            const list = document.createElement("ul");

            data.features.forEach((alert) => {
                const item = document.createElement("li");
                item.textContent = alert.properties.headline;
                list.appendChild(item);
            });

            displayDiv.appendChild(list);

            // Hide and clear any previous error
            errorDiv.textContent = "";
            errorDiv.classList.add("hidden");
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove("hidden");
        }
    });
});