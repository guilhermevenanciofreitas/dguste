// Modulo Pattern
var SQLite = (function () {

    var getInstance = function () {
        var db = openDatabase ('Wise', '1.0', 'Wise Tecnologia', 2 * 1024 * 1024);
        if(!db){
            alert('Houve um problema ao conectar com banco de dados!');
            return false
        }
        return db;
    };

    var Exec = function (query, dados) {

        var db = getInstance();

        db.transaction(function(tx){

            tx.executeSql(
                query,
                dados,
                function(transaction, result){
                    //console.log(result);
                },
                function(transaction, error){
                    err   = "Query: " + query + " \n"+
                            "Function: " + Exec.caller + " \n"+
                            "Message: " + error.message;
                    console.log(err);
                }
            );

        });
    }

    // Declaraçao Publicos
    return {
        getInstance: getInstance,
        Exec: Exec
    };

})();