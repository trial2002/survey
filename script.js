document.addEventListener("DOMContentLoaded", function () {
    const surveyForm = document.getElementById("surveyForm");
    const thankYouMessage = document.getElementById("thankYouMessage");
    const generatedCodeMessage = document.getElementById("generatedCodeMessage");
    const seeResultsButton = document.getElementById("seeResultsButton");
    const responsesDiv = document.getElementById("responses");
    const refreshButton = document.getElementById("refreshButton");

    let uniqueCode = null;
    let partnerCode = null;

    // Handle survey submission
    surveyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const favoriteSport = document.querySelector('input[name="favoriteSport"]:checked').value;
        partnerCode = document.getElementById("partnerCode").value.trim();

        // Generate a new unique code if not provided
        uniqueCode = partnerCode || generateUniqueCode();
        const surveyData = { name, favoriteSport };

        // Save to localStorage (use partnerCode to link)
        localStorage.setItem(uniqueCode, JSON.stringify(surveyData));

        // Hide the survey and show the thank you message
        surveyForm.style.display = "none";
        thankYouMessage.style.display = "block";
        generatedCodeMessage.textContent = `Your unique code: ${uniqueCode}. Share this with your partner.`;

        // Only show the "See Results" button if they entered a partner's code
        if (partnerCode) {
            seeResultsButton.style.display = "block";
            checkResults(partnerCode);  // Check if partner has completed the survey
        }

        // If there is no partner code, don't show results yet
        else {
            seeResultsButton.style.display = "none";
        }
    });

    // Generate a random 5-digit code
    function generateUniqueCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Check if both surveys are submitted and show results
    function checkResults(code) {
        const partnerData = JSON.parse(localStorage.getItem(code));

        if (partnerData) {
            showResults(partnerData);
        } else {
            seeResultsButton.addEventListener("click", function () {
                const partnerData = JSON.parse(localStorage.getItem(code));
                if (partnerData) {
                    showResults(partnerData);
                } else {
                    alert("Please wait for your partner.");
                }
            });
        }
    }

    // Show survey results
    function showResults(partnerData) {
        const storedData = JSON.parse(localStorage.getItem(uniqueCode));
        responsesDiv.innerHTML = `
            <p><strong>${storedData.name}</strong> answered: ${storedData.favoriteSport}</p>
            <p><strong>${partnerData.name}</strong> answered: ${partnerData.favoriteSport}</p>
            <p><strong>Comparison:</strong> ${compareAnswers(storedData.favoriteSport, partnerData.favoriteSport)}</p>
        `;

        thankYouMessage.style.display = "none";
        responsesDiv.style.display = "block";
    }

    // Compare answers
    function compareAnswers(ans1, ans2) {
        if (ans1 === "yes" && ans2 === "yes") {
            return "✅ Yes-Yes Match!";
        } else if (ans1 === "maybe" && ans2 === "yes") {
            return "🤔 Maybe-Yes Match!";
        } else if (ans1 === "yes" && ans2 === "maybe") {
            return "🤔 Yes-Maybe Match!";
        } else {
            return "❌ No Match.";
        }
    }

    // Refresh button functionality
    refreshButton.addEventListener("click", function () {
        checkResults(uniqueCode);
    });
});
