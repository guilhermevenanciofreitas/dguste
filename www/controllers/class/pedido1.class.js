class pedido1 {

	constructor() {
	    this.db = SQLite.getInstance();
	  }

	get (id, callback){

		var data = [];
	    this.db.transaction(function (tx) {
	        tx.executeSql('SELECT * FROM pedido1 where NUMERO=?',
	        [id],
	        function (tx, results) {
	            if (results.rows && results.rows.length) {
	                for (i = 0; i < results.rows.length; i++) {
	                    data.push(results.rows.item(i));
	                }
	            }
	            if (typeof(callback) == 'function')
	                callback(data);
	        },
	        function (tx, error) {
	            console.log(error);
	        });
	    });
	}   
}

var pedido = new pedido1();


pedido.get(1, Retorno);

var Retorno = function(data){
	console.log(data);
}