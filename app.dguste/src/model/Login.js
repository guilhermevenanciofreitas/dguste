// Modulo Pattern
var Login = (function () {

    var db = SQLite.getInstance();

    var codven;

    var getCodven = function () {
        return codven;
    };

    var Server = function() {

        IP = $("#cboServer").val();

    }

    var Atualizar = function (MostraMensagem) {

        myApp.showPreloader("Carregando...");

        $.ajax({
            url: Restful.getIP() + "vendedor.php?action=get",
            type: "POST",
            data: {},
            dataType: "json"
        }).done(function(data) {

            var novo = "INSERT INTO vendedor VALUES ";
            var deletar = 'DELETE FROM vendedor WHERE codven IN ('

            for (i = 0; i < data.length; i ++){

                deletar += data[i]['codven'] + ",";

                novo += " (" + data[i]['codven'] +
                    ",'" + data[i]['nome'] + "'" +
                    ",'" + data[i]['senha'] + "'),"
            }

            SQLite.Exec(deletar.substr(0, deletar.length - 1) + ")");
            SQLite.Exec(novo.substr(0, novo.length - 1));

            //console.log(novo.substr(0, novo.length - 1));

            myApp.hidePreloader();

        }).fail(function(jqXHR, textStatus ) {
            myApp.hidePreloader();
            if (MostraMensagem == true){
                myApp.alert("Não foi possível atulizar usuários");
            }
            console.log(jqXHR);
        });
    };

    var Entrar = function () {

        if ($("#cboServer").val() == "") {
            alert("Selecione o servidor!");
            return;
        }

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT codven FROM vendedor WHERE nome = '" + $("#txtUsuario").val().toUpperCase() + "' AND senha = '" + $("#txtSenha").val().toUpperCase() + "'",
                null,
                function(transaction, result){

                    if(result.rows.length != 1){

                        myApp.alert("Usuário ou senha errado!");

                        $("#txtUsuario").val("");
                        $("#txtSenha").val("");

                    } else {
                        codven = result.rows.item(0).codven;
                        mainView.router.loadPage('views/Menu.html');

                        $("#txtUsuario").val("");
                        $("#txtSenha").val("");

                    }
                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });

    };

    var Sair = function (){

        myApp.confirm('Tem certeza que deseja sair?', function () {

            navigator.app.exitApp();

        });

    }

    // Declaraçao Publicos
    return {
        Server: Server,
        Entrar: Entrar,
        Atualizar: Atualizar,
        Sair: Sair,
        getCodven: getCodven
    };
})();

/* ===== Preloader Page events ===== */
myApp.onPageInit('Login', function (page) {

    //$("#txtUsuario").val("");
    //$("#txtSenha").val("");

});