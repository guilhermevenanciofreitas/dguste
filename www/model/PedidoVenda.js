// Modulo Pattern
var PedidoVenda = (function () {

    var db = SQLite.getInstance();

    var NUMERO;
	var PROTOCOLO;
    var EMISSAO;
    var CODCLI;
    var fantasia;
    var SIT;
    var PAG;
    var PRZ;
    var TOTBRUTO;
    var TOTBONIF;
    var TOTTROCA;
    var TOTOUTROS;
    var FINALIZADO;
    var ENVIADO;
    var CODTAB;
    var OBS;

    var setNUMERO = function (value) {
        NUMERO = value;
    };
    var setCODCLI = function (codcli, fantasia, codtab, prz) {
        CODCLI = codcli;
        fantasia = fantasia;
        CODTAB = codtab;
		PRZ = prz;
        $("#txtCliente").val(CODCLI + ' - ' + fantasia);
		$("#txtPrazo").val(PRZ);
    };

    var getNUMERO = function () {
        return NUMERO;
    };
    var getENVIADO = function () {
        return ENVIADO;
    };
    var getCODCLI = function () {
        return CODCLI;
    };
    var getCODTAB = function () {
        return CODTAB;
    };

    var Carregar = function () {

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT p.NUMERO, p.PROTOCOLO, p.EMISSAO, ifnull(p.CODCLI,'') As CODCLI, ifnull(p.CODCLI || ' - ' || c.fantasia,'Nenhum selecionado') As fantasia, p.FINALIZADO, p.ENVIADO, c.codtab, p.PAG, p.PRZ, p.SIT, p.OBS, p.TOTBRUTO, p.TOTBONIF, p.TOTTROCA, p.TOTOUTROS, c.codtab FROM pedido1 p LEFT JOIN cliente c ON c.codcli = p.CODCLI WHERE NUMERO = " + NUMERO,
                null,
                function(transaction, result){

                    NUMERO = result.rows.item(0).NUMERO;
					PROTOCOLO = result.rows.item(0).PROTOCOLO;
                    EMISSAO = result.rows.item(0).EMISSAO;
                    CODCLI = result.rows.item(0).CODCLI;
                    fantasia = result.rows.item(0).fantasia;
                    PAG = result.rows.item(0).PAG;
                    PRZ = result.rows.item(0).PRZ;
                    TOTBRUTO = result.rows.item(0).TOTBRUTO;
                    TOTBONIF = result.rows.item(0).TOTBONIF;
                    TOTTROCA = result.rows.item(0).TOTTROCA;
                    TOTOUTROS = result.rows.item(0).TOTOUTROS;
                    FINALIZADO = result.rows.item(0).FINALIZADO;
                    ENVIADO = result.rows.item(0).ENVIADO;
                    CODTAB = result.rows.item(0).codtab;
                    SIT = result.rows.item(0).SIT;
                    OBS = result.rows.item(0).OBS;
                    CODTAB = result.rows.item(0).codtab;
	
                    Load();

                    PedidoVendaItens();

                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });

    };

    var Load = function () {

        $('#txtNUMERO').val(NUMERO);

        EMISSAO = new Date(EMISSAO);
        $("#txtEMISSAO").val(EMISSAO.toDate('yyyy-mm-dd'));

        if (FINALIZADO == 0 && ENVIADO == 0){
            html = '<a href="#" id="btnSalvar" class="button button-raised" onclick="PedidoVenda.Salvar(true)">Salvar</a>'+
                '<a href="#" id="btnFinalizar" class="button button-fill button-raised color-green" onclick="PedidoVenda.Finalizar()">Finalizar</a>';
        }
        if (FINALIZADO == 1 && ENVIADO == 0){
            html = '<a href="#" id="btnSalvar" class="button button-fill button-raised color-red" onclick="PedidoVenda.Cancelar()">Cancelar</a>'+
                `<a href="#" id="btnFinalizar" class="button button-fill button-raised color-blue" onclick="PedidoVenda.Enviar();">Enviar</a>`;
        }
        if (ENVIADO == 1){
            html = '<a href="#" id="btnSalvar" class="button button-raised color-gray disabled">Salvar</a>'+
                '<a href="#" id="btnFinalizar" class="button button-fill button-raised color-gray disabled">Enviado nº ' + PROTOCOLO + '</a>';
        }

        if (ENVIADO == 9){
            html = '<a href="#" id="btnSalvar" class="button button-raised color-red disabled">Erro envio</a>'+
                //`<a href="#" id="btnFinalizar" class="button button-fill button-raised color-blue" onclick="MinhasVendas.EnviarPedido(` + NUMERO + `);mainView.router.loadPage('views/MinhasVendas.html');">Enviar</a>`;
				`<a href="#" id="btnFinalizar" class="button button-fill button-raised color-blue" onclick="PedidoVenda.Enviar();">Enviar</a>`;
        }

        $("#viewSalvar").html('<p class="buttons-row">' + html + '</p>');
        $("#txtCliente").val(fantasia);
        $("#cboPagamento").val(PAG);
        //if (PRZ != 0){
            $("#txtPrazo").val(PRZ);
        //} else {
        //    $("#txtPrazo").val('');
        //}
        $("#cboSIT").val(SIT);
        $("#txtOBS").val(OBS);

        $("#lblTOTBRUTO").html(getREAL(TOTBRUTO));
        $("#lblTOTBONIF").html(getREAL(TOTBONIF));
        $("#lblTOTTROCA").html(getREAL(TOTTROCA));
        $("#lblTOTOUTROS").html(getREAL(TOTOUTROS));

    };

    var Set = function () {
        PAG = $("#cboPagamento").val();
        PRZ = $("#txtPrazo").val();
        SIT = $("#cboSIT").val();
        OBS = $("#txtOBS").val();
        EMISSAO = $("#txtEMISSAO").val();
    };

    var findCliente = function () {

        if(ENVIADO == 1){
            myApp.alert("Pedido já enviado!");
            return;
        }

        mainView.router.loadPage('views/Clientes.html?action=PedidoVenda');

    };

    var Salvar = function (MostraMensagem) {

        Set();

        $("#btnSalvar").addClass("disabled");
        myApp.showPreloader("Salvando...");
        if (PRZ == ""){
            PRZ = 0;
        }
        db.transaction(function (tx) {

            //EMISSAO = dateParse($("#txtEMISSAO").val())
            //EMISSAO = new Date(EMISSAO);
            //EMISSAO.setDate(EMISSAO.getDate() + 1);
            //EMISSAO = EMISSAO.toDate('yyyy-mm-dd hh:MM:ss');

            tx.executeSql('UPDATE pedido1 SET codcli = ?, PAG = ?, PRZ = ?, SIT = ?, OBS = ? WHERE NUMERO = ?', [
                CODCLI,
                PAG,
                PRZ,
                SIT,
                OBS,
                NUMERO]
            );

            Carregar();

            myApp.hidePreloader();
            $("#btnSalvar").removeClass("disabled");

            if(MostraMensagem == true){
                myApp.alert("Salvo!");
            }
        });

    };

    var Finalizar = function () {

        $("#btnFinalizar").addClass("disabled");
        //myApp.showPreloader("Finalizando...");

        Set();

        if(CODCLI == ""){
            //myApp.hidePreloader();
            myApp.alert("Não há nenhum cliente");
            $("#btnFinalizar").removeClass("disabled");
            return;
        };
        if(PAG == null){
            //myApp.hidePreloader();
            myApp.alert("Não há nenhuma forma de pagamento");
            $("#btnFinalizar").removeClass("disabled");
            return;
        };
        if(SIT == null){
            //myApp.hidePreloader();
            myApp.alert("Não há nenhum status");
            $("#btnFinalizar").removeClass("disabled");
            return;
        };

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT 1 FROM pedido2 WHERE NUMERO = " + NUMERO,
                null,
                function(transaction, result){
                    try{
                        if (result.rows.length == 0){
                            myApp.hidePreloader();
                            $("#btnFinalizar").removeClass("disabled");
                            myApp.alert("Nenhum produto inserido!");
                            return;
                        }

                        db.transaction(function (tx) {
                            tx.executeSql('UPDATE pedido1 SET LATITUDE = ?, LONGITUDE = ?, FINALIZADO = ? WHERE NUMERO = ?', [
                                0,
                                0,
                                1,
                                NUMERO]
                            );
                        });

                        Salvar(false);

                        Carregar();

                        //myApp.hidePreloader();
                        $("#btnFinalizar").removeClass("disabled");
                        myApp.alert("Finalizado!");

                        /*navigator.geolocation.getCurrentPosition(
                            function onSucess(position) {
                                db.transaction(function (tx) {
                                    tx.executeSql('UPDATE pedido1 SET LATITUDE = ?, LONGITUDE = ?, FINALIZADO = ? WHERE NUMERO = ?', [
                                        position.coords.latitude,
                                        position.coords.longitude,
                                        1,
                                        NUMERO]
                                    );
                                });

                                Salvar(false);

                                Carregar();

                                myApp.hidePreloader();
                                $("#btnFinalizar").removeClass("disabled");
                                myApp.alert("Finalizado!");

                            },
                            function onError(error) {

                                myApp.hidePreloader();
                                $("#btnFinalizar").removeClass("disabled");

                                if(error.code == 3){
                                    myApp.alert("Ative o GPS!","Ops!");
                                } else {
                                    myApp.alert("Erro: " + error.code + " - " + error.message);
                                }

                            },
                            { timeout: 8000 }
                        );*/

                    } catch (e){
                        alert(e.message);
                    }
                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });
    };

    var findProdutos = function () {

        if(ENVIADO == 1){
            myApp.alert("Pedido já enviado!");
            return;
        }

        Salvar(false);

        mainView.router.loadPage('views/PedidoItens.html?NUMERO=' + NUMERO);

    };

    var PedidoVendaItens = function () {

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT p2.TIPO, p2.CODPROD, SUM(p2.QTDE) As QTDE ,p.DESCRICAO, p2.PVENDA, p.UN, SUM(p2.QTDE) * p2.PVENDA As Total, p2.NUMLOTE, p2.DTVALIDADE FROM pedido2 p2 LEFT JOIN produto p ON p2.CODPROD = p.CODPROD WHERE p2.NUMERO = " + NUMERO + " GROUP BY p.DESCRICAO, p2.CODPROD, p2.PVENDA, p.UN, p2.TIPO",
                null,
                function(transaction, result){

                    var html = '';

                    for(i=0; i < result.rows.length; i++) {

                        var TIPO = result.rows.item(i).TIPO;

                        switch(TIPO) {
                            case 1:
                                TIPO = '<span class="badge bg-green">Venda</span>';
                                break;
                            case 2:
                                TIPO = '<span class="badge bg-blue">Bonificação</span>';
                                break;
                            case 3:
                                TIPO = '<span class="badge bg-orange">Troca</span>';
                                break;
                            case 4:
                                TIPO = '<span class="badge bg-gray">Outros</span>';
                                break;
                        }

                        /*html += '<a href="#" class="nolink">'+
                            '<div class="card">'+
                            '<div class="card-header">' + result.rows.item(i).QTDE + ' X ' + result.rows.item(i).DESCRICAO + TIPO + '</div>'+
                            '<div class="card-content">'+
                            '<div class="card-content-inner">R$ ' + getREAL(result.rows.item(i).PVENDA) + '/' + result.rows.item(i).UN + ' - <b>total:</b> R$ ' + getREAL(result.rows.item(i).Total) + '</div>'+
                            '</div>'
                            '<div class="card-footer"><a href="#" class="button button-fill button-raised color-orange" onclick="PedidoItens.Editar('+ result.rows.item(i).NUMLOTE +', ' + result.rows.item(i).PVENDA + ', ' + result.rows.item(i).QTDE + ', ' + result.rows.item(i).CODPROD +', ' + result.rows.item(i).TIPO + ')"><i class="fa fa-edit"></i> Editar</a><a href="#" class="button button-fill button-raised color-red" onclick="PedidoItens.Remover('+ result.rows.item(i).CODPROD +', ' + result.rows.item(i).TIPO + ', ' + result.rows.item(i).PVENDA + ')"><i class="fa fa-trash"></i>Deletar</a></div>'+
                            '</div>'+
                            '</a>';*/

                        html += `<a href="#" class="nolink">
                            <div class="card">
                            <div class="card-header">` + result.rows.item(i).QTDE + ` X ` + result.rows.item(i).DESCRICAO + TIPO + `</div>
                            <div class="card-content">
                            <div class="card-content-inner">R$ ` + getREAL(result.rows.item(i).PVENDA) + `/` + result.rows.item(i).UN + ' - <b>total:</b> R$ ' + getREAL(result.rows.item(i).Total) + `</div>
                            </div>
                            <div class="card-footer"><span><a href="#" class="button button-fill button-raised color-orange" onclick="PedidoItens.Editar(` + result.rows.item(i).NUMLOTE + `, ` + result.rows.item(i).PVENDA + `, ` + result.rows.item(i).QTDE + `, ` + result.rows.item(i).CODPROD + `, ` + result.rows.item(i).TIPO + `, '` + result.rows.item(i).DTVALIDADE + `')"><i class="fa fa-edit"></i> Editar</a><a href="#" class="button button-fill button-raised color-red" onclick="PedidoItens.Remover(` + result.rows.item(i).CODPROD + `, ` + result.rows.item(i).TIPO + `, ` + result.rows.item(i).PVENDA + `)"><i class="fa fa-trash"></i> Deletar</a></span></div>
                            </div>
                            </a>`;

                    }

                    if (result.rows.length == 0){
                        html += '<div class="card-header">Nenhum produto</div>';
                    }

                    $("#PedidoVendaItens").html(html);

                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });

    };
	
    var Enviar = function () {
		
		myApp.showPreloader(`Enviando pedido...`);
		
        MinhasVendas.EnviarPedido(NUMERO);
		
		setTimeout(function(){ 
			mainView.router.loadPage('views/MinhasVendas.html');
			myApp.hidePreloader();
		}, 4000);
			
		
    };

    var Cancelar = function (){

        BDLocal.Execute("UPDATE pedido1 SET FINALIZADO = 0 WHERE NUMERO = " + NUMERO);

        Carregar();
    };
	
	var Liberar = function () {
		
	var senha = prompt("Informe a senha para liberar", "");

	if (senha == null) {
    		return;
	}

	if (senha == "REENVIO2") {
		db.transaction(function (tx) {
			tx.executeSql('UPDATE pedido1 SET ENVIADO = 0 WHERE NUMERO = ?', [
                		NUMERO]
            		);

			Carregar();
			myApp.alert("Pedido liberado!");
		});

	} else {
		myApp.alert("Senha incorreta!");
	}

    };
	

    // Declaraçao Publicos
    return {
        setNUMERO: setNUMERO,
        setCODCLI: setCODCLI,
        getNUMERO: getNUMERO,
        getENVIADO: getENVIADO,
        getCODCLI: getCODCLI,
        getCODTAB: getCODTAB,
        Carregar: Carregar,
        Salvar: Salvar,
		Enviar: Enviar,
        findCliente: findCliente,
        Finalizar: Finalizar,
        findProdutos: findProdutos,
        Cancelar: Cancelar,
        PedidoVendaItens: PedidoVendaItens,
		Liberar: Liberar
    };

})();

/* ===== Preloader Page events ===== */
myApp.onPageInit('PedidoVenda', function (page) {

    PedidoVenda.setNUMERO(page.query.NUMERO);

    PedidoVenda.Carregar();

});