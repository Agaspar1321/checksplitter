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
    const num = (str) => Number(str.replace(/[^0-9.]/g, ""));
    const total = num(document.getElementById("total").value);
    const tax = num(document.getElementById("tax").value);
    const tip = num(document.getElementById("tip").value);

    const names = document.querySelectorAll(".payer-name");
    const costs = document.querySelectorAll(".meal-cost");

    // Build the list of people and the subtotal (sum of all meals)
    const people = [];
    let subtotal = 0;
    for (let i = 0; i < names.length; i++) {
        const name = names[i].value.trim();
        const cost = num(costs[i].value);
        if (name === "" || isNaN(cost)) continue; // skip blank / invalid rows
        people.push({ name, cost });
        subtotal += cost;
    }
    
    // 1. bail out first if there's nothing to split
    if (subtotal <= 0) {
        result.innerHTML = "Your meal was inputed as $0, everyone eats for free. Or try again!";
        return;
    }

    // 2. clear old results ONCE, before any appends
    result.innerHTML = "";

    // 3. warn if the entered total doesn't match meals + tax + tip
    const expected = subtotal + tax + tip;
    if (total > 0 && Math.abs(total - expected) > 0.01) {
        const warn = document.createElement("p");
        warn.className = "warning";
        warn.textContent = `Heads up: your entered total ($${total.toFixed(2)}) doesn't match meals + tax + tip ($${expected.toFixed(2)}).`;
        result.appendChild(warn);
    }

    // 4. show what each person owes: their meal + their share of tax + tip
    const trueTotal = subtotal + tax + tip;
    let running = 0;

    people.forEach((person, i) => {
        const share = person.cost / subtotal;
        let owed = person.cost + share * tax + share * tip;

        if (i < people.length - 1) {
            owed = Math.round(owed * 100) / 100;   // normal rounding
            running += owed;
        } else {
            owed = Math.round((trueTotal - running) * 100) / 100;  // last person takes the remainder
        }

        const line = document.createElement("p");
        line.textContent = `${person.name} owes $${owed.toFixed(2)}`;
        result.appendChild(line);
    });
});
