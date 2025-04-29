var IP = "";

var Restful = (function () {

    var getIP = function () {
        return IP;
    };

    // Declaraçao Publicos
    return {
        getIP: getIP
    };

})();

function getPeriodo(value) {
    var data = [value.slice(0, 10), value.slice(13,23)];
    return data;
}
function dateParse(value) {
    return value.split("/").reverse().join("-");
}

function GravaLOG(error) {

    console.log(error);

    if (GravaLOG.caller == null) {
        console.log('The function was called from the top!')
    } else {
        console.log('This function\'s caller was ' + GravaLOG.caller);
    }
    
}

function getREAL(value) {
    return value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function setREAL(value) {
    if(typeof(value) == "number"){
        return value;
    }
    return value.replace(",", ".").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}