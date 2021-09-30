function getQuote() {
    const symbol = document.getElementById("quoteButton").value
    fetch ('retrieveQuote', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "symbol": symbol})
    })
    .then(function(response) {
        console.log(response)
        return response.json()
    })
    .then(function (json) {
        console.log(json)
    })
}