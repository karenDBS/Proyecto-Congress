
var app = new Vue({
    el: '#app',
    data: {
        datosCongress: []
    }
});

var headers = new Headers();
headers.append('X-API-Key', 'km3aN7t8kjoETOY0cRNqAy9YPHmmz4S67F4TGBIx');

var titulo = document.querySelector("title").textContent;
var camara = "house";

if (titulo.includes("Senate")) {
    camara = "senate";
} 

var request = new Request("https://api.propublica.org/congress/v1/116/" + camara + "/members.json", {
    headers: headers
});

fetch(request).then(function (response) {
    if (response.ok) {
        return response.json();
    }

}).then(function (json) {

    app.datosCongress = json.results[0].members;

})

