document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("submit");
    const quantityInput = document.getElementById("quantityInput");
    const increaseBtn = document.getElementById("increaseBtn");
    const decreaseBtn = document.getElementById("decreaseBtn");

    button.addEventListener("click", function () {
        const quantity = parseInt(quantityInput.value);

        // Check if the quantity is a valid number and greater than or equal to 1
        if (!isNaN(quantity) && quantity >= 1) {
            fetch('http://localhost:4000/create-checkout-session', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantityInput: quantity // Pass the quantity to the server
                }),
            })
                .then(res => {
                    if (res.ok) return res.json();
                    return res.json().then(json => Promise.reject(json));
                })
                .then(({ url }) => {
                    window.location = url;
                })
                .catch(e => {
                    console.error("Error creating checkout session:", e);
                    // Display a user-friendly message based on the error type (e.g., server error, invalid data)
                    alert("An error occurred. Please try again.");
                });
        } else {
            alert("Please enter a valid quantity (number greater than or equal to 1).");
        }
    });

    increaseBtn.addEventListener("click", function () {
        incrementValue();
    });

    decreaseBtn.addEventListener("click", function () {
        decrementValue();
    });

    function incrementValue() {
        let value = parseInt(quantityInput.value, 10);
        value = isNaN(value) ? 1 : value;
        value++;
        quantityInput.value = value;
    }

    function decrementValue() {
        let value = parseInt(quantityInput.value, 10);
        value = isNaN(value) ? 1 : value;
        if (value > 1) {
            value--;
        }
        quantityInput.value = value;
    }
});
