/*
  GaleriaC v2
  Galeria d'imatges amb transició d'objectiu
  ProInf.net 2013-03-22
  Versió 3

  Ajuda:
    http://javascript.crockford.com/private.html
    http://easings.net/es
    http://www.gizma.com/easing/
*/

function GaleriaC(config) {

    var progres = 0; // Evolució lineal de la transició: des de 0=res fins a 1=complet
    var imatgeFons = null;
    var imatgeDalt = null;
    var index = 0; // Imatge actual per la transició
    var nombreFotogramesTransicio;
    var duradaFotograma;

    function iniciar() {
        configuracioPerDefecte();

        var contenidor = document.getElementById(config.id);
        if (contenidor == null) return alert('GaleriaC: No trobo el contenidor');
        configurarContenidor(contenidor);

        var fotos = contenidor.getElementsByTagName("img");
        if (fotos.length != 2) return alert('GaleriaC: Falten 2 imatges al contenidor');

        imatgeFons = fotos[0];
        imatgeDalt = fotos[1];

        indexAleatori();   configurarFoto(imatgeFons);
        indexSequencial(); configurarFoto(imatgeDalt);

        canviarFotoDalt(0);

        duradaFotograma = 2000/config.fps;
        nombreFotogramesTransicio = config.tempsTransicio / duradaFotograma;

        esperar();
    }

    function configurarContenidor(contenidor) {
        contenidor.style.position = "relative";
        contenidor.style.width = config.amplada + "px";
        contenidor.style.height = config.alcada + "px";
        contenidor.style.overflow = 'hidden';
    }

    function configuracioPerDefecte() {
        var perDefecte = function(nom, valor) {
            if (config[nom] == undefined) config[nom] = valor;
        };
        config = config || {};
        perDefecte('id', "galeria_c");
        perDefecte('subcarpeta', "images/");
        perDefecte('llista', ["foto1.jpg", "foto2.jpg", "foto3.jpg"]);
        perDefecte('amplada', 400); // píxels
        perDefecte('alcada', 300); // píxels
        perDefecte('aleatori', false);
        perDefecte('tempsEspera', 4000); // millisegons
        perDefecte('tempsTransicio', 2000); // millisegons
        perDefecte('fps', 25); // fotogrames per segon
        perDefecte('acceleracio', "lineal");
        perDefecte('efecteEscalat', false);
        perDefecte('efecteOpacitat', true);
        perDefecte('efecteLliscat', false);
    }

    function configurarFoto(imatge) {
        imatge.style.position = 'absolute';
        imatge.style.left = 0;
        imatge.style.top = 0;
        imatge.width = config.amplada;
        imatge.height = config.alcada;
        imatge.src = obtenirRutaFoto(index);
    }

    function obtenirRutaFoto(index) {
        return config.subcarpeta + config.llista[index];
    }

    function esperar() {
        setTimeout(animar, config.tempsEspera);
    }

    function animar() {
        progres += 1/nombreFotogramesTransicio;
        canviarFotoDalt(calcularAcceleracio(progres));

        if (progres < 1) {
            setTimeout(animar, duradaFotograma);
        }
        else {
            progres = 0;
            seguentFoto();
            esperar();
        }
    }

    function calcularAcceleracio(progres) { // http://www.gizma.com/easing/
        switch(config.acceleracio) {
            case 'lineal': return progres;
            case 'easeInQuad': return progres*progres;
            case 'easeOutQuad': return 1-((1-progres)*(1-progres));
            case 'easeInCubic': return progres*progres*progres;
            case 'easeOutCubic': return 1-((1-progres)*(1-progres)*(1-progres));
            default: return progres;
        }
    }

    function seguentFoto() {
        imatgeFons.src = imatgeDalt.src;
        canviarFotoDalt(0);
        imatgeDalt.src = obtenirRutaFoto(seguentIndex());
    }

    function canviarFotoDalt(objectiu) {
    // objectiu = Transició assolida: des de 0=res fins a 1=complet

        imatgeDalt.style.display = objectiu==0? "none": "";

        if (config.efecteOpacitat) {
            imatgeDalt.style.opacity = objectiu;
        }
        if (config.efecteEscalat) {
            imatgeDalt.style.left = (config.amplada * (1-objectiu)/2) + "px";
            imatgeDalt.style.top = (config.alcada * (1-objectiu)/2) + "px";
            imatgeDalt.width = config.amplada * objectiu;
            imatgeDalt.height = config.alcada * objectiu;
        }
        if (config.efecteLliscat) {
            imatgeDalt.style.left = (config.amplada * (1-objectiu)) + "px";
            imatgeFons.style.left = (-config.amplada * objectiu) + "px";
        }
    }

    function seguentIndex() {
        if (config.aleatori)
            return indexAleatori();
        else
            return indexSequencial();
    }

    function indexAleatori() {
        index = parseInt(Math.random() * config.llista.length);
        return index;
    }

    function indexSequencial() {
        index = (index + 1) % config.llista.length;
        return index;
    }

    iniciar();
}

/* FI */

