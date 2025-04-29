// Modulo Pattern
var Produtos = (function () {

    var db = SQLite.getInstance();

    var Carregar = function (value) {

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT CODPROD, DESCRICAO FROM produto WHERE DESCRICAO LIKE '%" + value + "%'",
                null,
                function(transaction, result){

                    $("#lblTotalProdutos").html(result.rows.length + " produto(s) encontratos!");

                    var html = '';

                    for(i=0; i < result.rows.length; i++){

                        html += '<div class="card">'+
                            '<div class="card-header">' + result.rows.item(i).CODPROD + ' - '+ result.rows.item(i).DESCRICAO +'</div>'+
                            '</div>';
                    }

                    $("#listProdutos").html(html);
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
            url: Restful.getIP() + "produto.php?action=get",
            type: "POST",
            data: {
            },
            dataType: "json"
        }).done(function(data) {

            var novo = "INSERT INTO produto VALUES ";
            var deletar = "DELETE FROM produto";

            for (i = 0; i < data.length; i ++){

                novo += " (" +data[i]['CODPROD'] +
                    ",'" + data[i]['DESCRICAO'] + "'" +
                    ",'" + data[i]['UN'] + "'" +
                    "," + data[i]['EMB'] +
                    "," + data[i]['CUSTO'] + "),"
            }

            SQLite.Exec(deletar);
            SQLite.Exec(novo.substr(0, novo.length - 1));

            AtualizaPrecos();

        }).fail(function(jqXHR, textStatus ) {
            myApp.hidePreloader();
            myApp.alert("Não foi possível atulizar produtos");
        });


    };
    
    var AtualizaPrecos = function () {
        $.ajax({
            url: Restful.getIP() + "prodpreco.php?action=get",
            type: "POST",
            data: {},
            dataType: "json"
        }).done(function(data) {

            var novo = "INSERT INTO prodpreco VALUES ";
            var deletar = 'DELETE FROM prodpreco WHERE transacao IN ('

            for (i = 0; i < data.length; i ++){

                deletar += data[i]['transacao'] + ",";

                novo += " (" + data[i]['transacao'] +
                    "," + data[i]['NUMTAB'] +
                    "," + data[i]['CODPROD'] +
                    "," + data[i]['PRECO'] + "),"
            }

            SQLite.Exec(deletar.substr(0, deletar.length - 1) + ")");
            SQLite.Exec(novo.substr(0, novo.length - 1));

            Carregar("");

            myApp.hidePreloader();
            myApp.alert("Atualizado!");

        }).fail(function(jqXHR, textStatus ) {
            myApp.hidePreloader();
            myApp.alert("Não foi possível atulizar preços");
            console.log(jqXHR);
        });
    };


    // Declaraçao Publicos
    return {
        Carregar: Carregar,
        Atualizar: Atualizar
    };

})();

/* ===== Preloader Page events ===== */
/* ===== Calendar ===== */
myApp.onPageInit('Produtos', function (page) {

    Produtos.Carregar("");

});