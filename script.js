const button = document.getElementById("submit");
const result = document.getElementById("result");
const container = document.getElementById("fields-container");

// Switch the visual theme by setting a data-theme attribute the CSS keys off of
function setTheme(name) {
    document.body.dataset.theme = name;
}

// Add another row of (name, meal cost) inputs to the page
function addPayer() {
    const row = document.createElement("div");
    row.className = "person-row";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "payer-name";
    nameInput.placeholder = "Name";

    const costInput = document.createElement("input");
    costInput.type = "text";
    costInput.className = "meal-cost";
    costInput.placeholder = "Meal cost";

    row.appendChild(nameInput);
    row.appendChild(costInput);
    container.appendChild(row);
}

// On Submit: read every row, split tax + tip by each person's share of the meals
button.addEventListener("click", () => {
    const tax = Number(document.getElementById("tax").value);
    const tip = Number(document.getElementById("tip").value);

    const names = document.querySelectorAll(".payer-name");
    const costs = document.querySelectorAll(".meal-cost");

    // Build the list of people and the subtotal (sum of all meals)
    const people = [];
    let subtotal = 0;
    for (let i = 0; i < names.length; i++) {
        const name = names[i].value.trim();
        const cost = Number(costs[i].value);
        if (name === "" || isNaN(cost)) continue; // skip blank / invalid rows
        people.push({ name, cost });
        subtotal += cost;
    }

    // Show what each person owes: their meal + their share of tax + tip
    result.innerHTML = "";
    people.forEach((person) => {
        const share = person.cost / subtotal;          // fraction of the meals total
        const owed = person.cost + share * tax + share * tip;

        const line = document.createElement("p");
        line.textContent = `${person.name} owes $${owed.toFixed(2)}`;
        result.appendChild(line);
    });
});
