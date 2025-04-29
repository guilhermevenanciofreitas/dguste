class WebSQL {

    constructor() {
        this.db = this.getInstance();
    }

    getInstance(){
        this.db = openDatabase ('Wise', '1.0', 'Wise Tecnologia', 2 * 1024 * 1024);
        if(!this.db){
            alert('Houve um problema ao conectar com banco de dados!');
            return false
        }
        return this.db;
    }

    Execute(query, params, callback){

        var data = [];

        this.db.transaction(function (tx) {
            tx.executeSql(query,
            params,
            function (tx, results) {
                var i;
                if (results.rows && results.rows.length) {
                    for (i = 0; i < results.rows.length; i++) {
                        data.push(results.rows.item(i));
                    }
                }
                if (typeof(callback) == 'function')
                    callback(data);
            },
            function (tx, error) {
                alert("Erro ao processar os dados");
            });
        });
    }

}

var BDLocal = new WebSQL();