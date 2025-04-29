// Modulo Pattern
var Clientes = (function () {

    var db = SQLite.getInstance();
    var action;

    var setAction = function (value) {
        action = value;
    };

    var Carregar = function (value) {

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT codcli, fantasia, bairro, cidade, uf FROM cliente WHERE fantasia LIKE '%" + value + "%'",
                null,
                function(transaction, result){

                    $("#lblTotalClientes").html(result.rows.length + " cliente(s) encontratos!");

                    var html = '';

                    for(i=0; i < result.rows.length; i++){

                        html += '<div class="card" onclick=Clientes.Retorno('+ result.rows.item(i).codcli +')>'+
                                    '<div class="card-header">'+ result.rows.item(i).codcli + ' - ' + result.rows.item(i).fantasia +'</div>'+
                                    '<div class="card-footer">' +
                                            result.rows.item(i).bairro +', '+
                                            result.rows.item(i).cidade +'-'+
                                            result.rows.item(i).uf +
                                    '</div>'+
                                '</div>';
                    }

                    $("#listClientes").html(html);
                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });
    };
    
    var Atualizar = function () {

        myApp.showPreloader("Atualizando...");

        $.ajax({
            url: Restful.getIP() + "cliente.php?action=get",
            type: "POST",
            data: {
            },
            dataType: "json"
        }).done(function(data) {

            var novo = "INSERT INTO cliente VALUES ";
            var deletar = 'DELETE FROM cliente'

            for (i = 0; i < data.length; i ++){

                novo += " (" + data[i]['codcli'] +
                        ",'" + data[i]['fantasia'].replace("'","''") + "'" +
                        ",'" + data[i]['bairro'] + "'" +
                        ",'" + data[i]['cidade'] + "'" +
                        ",'" + data[i]['uf'] + "'" +
                        "," + data[i]['codtab'] + "" +
						"," + data[i]['prz'] + "),";
            }

            SQLite.Exec(deletar);
            SQLite.Exec(novo.substr(0, novo.length - 1));

            Carregar("");

            myApp.hidePreloader();
            myApp.alert("Atualizado!");

        }).fail(function(jqXHR, textStatus ) {
            myApp.hidePreloader();
            myApp.alert("Não foi possível atulizar");
        });
    };
    
    var Retorno = function (codcli, fantasia) {

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT codcli, fantasia, codtab, prz FROM cliente WHERE codcli = " + codcli,
                null,
                function(transaction, result){

                    var fantasia = result.rows.item(0).fantasia;
                    var codcli = result.rows.item(0).codcli;
                    var codtab = result.rows.item(0).codtab;
					var prz = result.rows.item(0).prz;
					
                    if (action == "PedidoVenda"){
                        PedidoVenda.setCODCLI(codcli, fantasia, codtab, prz);
                        mainView.router.back();
                    }

                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });



    }

    // Declaraçao Publicos
    return {
        Carregar: Carregar,
        Atualizar: Atualizar,
        Retorno: Retorno,
        setAction: setAction
    };

})();

/* ===== Preloader Page events ===== */
/* ===== Calendar ===== */
myApp.onPageInit('Clientes', function (page) {

    Clientes.Carregar("");

    if (page.query.action != ""){
        Clientes.setAction(page.query.action);
    }

});