
var app = new Vue({
    el: '#app',
    data: {
        datosCongress: [],
        estadisticas: {
            "democrats": {
                "porcentajeDeVotos": 0,
                "cantidadRepresentantes": 0
            },
            "republicans": {
                "porcentajeDeVotos": 0,
                "cantidadRepresentantes": 0
            },
            "indepent": {
                "porcentajeDeVotos": 0,
                "cantidadRepresentantes": 0
            },
            "menosLeales": [],
            "masLeales": [],
            "menosComprometidos": [],
            "masComprometidos": [],
        },

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
    asignar();

})

    //ASIGNACION AL OBJETO ESTADISTICAS

    function asignar() {
        var democratas = app.datosCongress.filter(function (miembros) { if (miembros.party == "D") { return miembros } })
        var republicanos = app.datosCongress.filter(function (miembros) { if (miembros.party == "R") { return miembros } })
        var independientes = app.datosCongress.filter(function (miembros) { if (miembros.party == "I") { return miembros } })
        var diezPorciento = parseInt((app.datosCongress.length * 10) / 100);
        app.estadisticas.democrats.cantidadRepresentantes = democratas.length;
        app.estadisticas.republicans.cantidadRepresentantes = republicanos.length;
        app.estadisticas.indepent.cantidadRepresentantes = independientes.length;
        app.estadisticas.democrats.porcentajeDeVotos = porcentaje(democratas);
        app.estadisticas.republicans.porcentajeDeVotos = porcentaje(republicanos);
        app.estadisticas.indepent.porcentajeDeVotos = porcentaje(independientes);
        app.estadisticas.menosLeales = menosLeales(app.datosCongress, diezPorciento);
        app.estadisticas.masLeales = masLeales(app.datosCongress, diezPorciento);
        app.estadisticas.menosComprometidos = menosComprometidos(app.datosCongress, diezPorciento);
        app.estadisticas.masComprometidos = masComprometidos(app.datosCongress, diezPorciento);
    }


    //FUNCION PARA EL PORCENTAJE DE TODOS LOS PARTIDOS

    function porcentaje(array) {

        var suma = 0;

        array.forEach(function (numero) {
            suma += numero.votes_with_party_pct;
        });

        var promedio = parseInt(suma / (array.length <= 0 ? 1 : array.length));

        return promedio;

    }

    //LEALTAD AL PARTIDO


    //FUNCION PARA SACAR EL DIEZ PORCIENTO MENOS LEAL

    function menosLeales(array, porcentaje) {

        function comparar(a, b) { return a.votes_with_party_pct - b.votes_with_party_pct; };
        var select = array.sort(comparar);

        var menosLeales = select.splice(0, porcentaje);

        return menosLeales;

    }

    //FUNCION PARA SACAR EL DIEZ PORCIENTO MAS LEAL

    function masLeales(array, porcentaje) {

        function comparar(a, b) { return a.votes_with_party_pct - b.votes_with_party_pct; };
        var select = array.sort(comparar);

        var masLeales = select.splice(-porcentaje);

        masLeales.reverse();

        return masLeales;

    }


    //ESTADISTICA DE LOS MENOS COMPROMETIDOS


    function menosComprometidos(array, porcentaje) {

        function comparar(a, b) { return a.missed_votes_pct - b.missed_votes_pct; };
        var select = array.sort(comparar);

        var menosComprometidos = select.splice(-porcentaje);

        menosComprometidos.reverse();

        return menosComprometidos;
    }

    //ESTADISTICA DE LOS MAS COMPROMETIDOS

    function masComprometidos(array, porcentaje) {

        function comparar(a, b) { return a.missed_votes - b.missed_votes; };
        var select = array.sort(comparar);

        var masComprometidos = select.splice(0, porcentaje);

        return masComprometidos;
    }







