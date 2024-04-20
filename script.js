const form = document.getElementById('pincodeForm');
const pincodeInput = document.getElementById('pincodeInput');
const filterInput = document.getElementById('filterInput');
const loader = document.querySelector('.loader');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pincode = pincodeInput.value.trim();
    if (pincode.length !== 6 || isNaN(pincode)) {
        showError('Please enter a valid 6-digit pincode.');
        return;
    }

    loader.style.display = 'block';

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0].Status === 'Error') {
            throw new Error(data[0].Message);
        }

        displayResults(data[0].PostOffice);
    } catch (error) {
        showError(error.message);
    } finally {
        loader.style.display = 'none';
    }
});

filterInput.addEventListener('input', () => {
    filterResults();
});

function displayResults(postOffices) {
    resultsDiv.innerHTML = '';
    postOffices.forEach(postOffice => {
        const div = document.createElement('div');
        div.classList.add('post-office');
        div.innerHTML = `
            <p><strong>Post Office Name:</strong> ${postOffice.Name}</p>
            <p><strong>Pincode:</strong> ${postOffice.Pincode}</p>
            <p><strong>District:</strong> ${postOffice.District}</p>
            <p><strong>State:</strong> ${postOffice.State}</p>
            <hr>
        `;
        resultsDiv.appendChild(div);
    });

    clearError();
}

function showError(message) {
    errorDiv.textContent = message;
    resultsDiv.innerHTML = '';
}

function clearError() {
    errorDiv.textContent = '';
}

function filterResults() {
    const searchTerm = filterInput.value.trim().toLowerCase();
    const postOffices = document.querySelectorAll('.post-office');
    let found = false;

    postOffices.forEach(postOffice => {
        const text = postOffice.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            postOffice.style.display = 'block';
            found = true;
        } else {
            postOffice.style.display = 'none';
        }
    });

    if (!found) {
        showError("Couldn't find the postal data you're looking for…");
    } else {
        clearError();
    }
}
