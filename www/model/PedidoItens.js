// Modulo Pattern
var PedidoItens = (function () {

    var db = SQLite.getInstance();

    var NUMERO;
    var NUMTAB;
    var setNUMERO = function (value) {
        NUMERO = value;
    };

    var Carregar = function (value) {

        if(PedidoVenda.getCODCLI() == ''){
            $("#lblTotalPedidoItens").html("Nenhum cliente selecionado!");
            return;
        }
        if(NUMTAB == 'null'){
            $("#lblTotalPedidoItens").html("Nenhum preço de tabela informado!");
            return;
        }
        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT p.CODPROD, p.DESCRICAO, pr.PRECO FROM produto p INNER JOIN prodpreco pr ON pr.CODPROD = p.CODPROD WHERE p.DESCRICAO LIKE '%" + value + "%' AND pr.NUMTAB = " + PedidoVenda.getCODTAB(),
                null,
                function(transaction, result){

                    $("#lblTotalPedidoItens").html(result.rows.length + " produto(s) encontratos!");

                    var html = '';

                    for(i=0; i < result.rows.length; i++){

                        html += '<a href="#" class="nolink">'+
                            '<div class="card">'+
                            '<div class="card-header">'+ result.rows.item(i).DESCRICAO +'</div>'+
                            '<div class="card-footer">R$ ' + getREAL(result.rows.item(i).PRECO) +
                            `<span><a href="#" class="button button-fill button-raised" onclick="PedidoItens.Adicionar('${result.rows.item(i).DESCRICAO}', ${result.rows.item(i).CODPROD}, ${result.rows.item(i).PRECO})">` +
                            '<i class="fa fa-cart-plus"></i> Adicionar</a></span></div>'+
                            '</div>'+
                            '</a>';

                    }

                    html += '</ul></form>';

                    $("#listPedidoItens").html(html);
                },
                function(transaction, error){
                    alert("Function: Carregar(), Erro: " + error.message);
                }
            );
        });
    };

    var Adicionar = function (DESCRICAO, CODPROD, PRECO) {

        if(PedidoVenda.getENVIADO() == 1){
            myApp.alert("Pedido já enviado!");
            return;
        }

        myApp.addProduto('Valor', DESCRICAO, PRECO, function (Valor, Quantidade) {

            if(Valor == "" || Valor == 0){
                myApp.alert("Favor informar o preço!");
                return;
            }

            NUMLOTE = $("#NUMLOTE").val();

            if (NUMLOTE == ""){
                NUMLOTE = 0;
            }
            TIPO = $("#cboTIPO").val();

            if ($("#DTVALIDADE").val() != ""){
                VALIDADE = dateParse($("#DTVALIDADE").val())
                VALIDADE = new Date(VALIDADE);
                VALIDADE.setDate(VALIDADE.getDate() + 1);
                DTVALIDADE = VALIDADE.toDate('yyyy-mm-dd');
            } else {
                DTVALIDADE = '';
            }

            db.transaction(function(transaction){
                if (Quantidade == "" || Quantidade == 0){
                    Quantidade = 1;
                }
                transaction.executeSql(
                    "INSERT INTO pedido2 (NUMERO, TIPO, CODPROD, QTDE, PVENDA, PRTAB, DTVALIDADE, NUMLOTE) VALUES (?,?,?,?,?,?,?,?);",
                    [NUMERO, TIPO, CODPROD, Quantidade, setREAL(Valor), PRECO, DTVALIDADE, NUMLOTE],
                    function(transaction, result){
                        myApp.alert("Produto adicionado!");
                        CalculaTotais();
                        PedidoVenda.Carregar();
                    },
                    function(transaction, error){
                        alert(error.message);
                    }
                );
            });
        });
    };

    var Remover = function (CODPROD, TIPO, PVENDA) {
        if(PedidoVenda.getENVIADO() == 1){
            myApp.alert("Pedido já enviado!");
            return;
        }
        myApp.confirm('Tem certeza que deseja remover?', function () {

            db.transaction(function(transaction){
                transaction.executeSql(

                    "DELETE FROM pedido2 WHERE NUMERO = ? AND CODPROD = ? AND TIPO = ? AND PVENDA = ?",
                    [PedidoVenda.getNUMERO(), CODPROD, TIPO, PVENDA],
                    function(transaction, result){
                        CalculaTotais();
                        myApp.alert("Produto removido!");
                        CalculaTotais();
                        PedidoVenda.Carregar();
                    },
                    function(transaction, error){
                        alert(error.message);
                    }
                );
            });
        });
    };
    
    var Editar = function (NUMLOTE, PVENDA, QTDE, CODPROD, TIPO, DTVALIDADE) {
        
        if(PedidoVenda.getENVIADO() == 1){
            myApp.alert("Pedido já enviado!");
            return;
        }

        myApp.editProduto('Validade', 'DGuste', NUMLOTE, PVENDA, QTDE, DTVALIDADE, function (Valor, Quantidade, Lote, Validade) {
			
            var sql = "UPDATE pedido2 SET QTDE = " + Quantidade + ", PVENDA = " + Valor.replace(",",".") + ", NUMLOTE = " + Lote + ", DTVALIDADE = '" + Validade + "' WHERE CODPROD = " + CODPROD + " AND NUMERO = " + PedidoVenda.getNUMERO() + " AND TIPO = " + TIPO + " AND PVENDA = " + PVENDA;
            
            SQLite.Exec(sql);

            PedidoVenda.PedidoVendaItens();
            CalculaTotais();

        });
    };

    var CalculaTotais = function () {

        if(PedidoVenda.getENVIADO() == 1){
            myApp.alert("Pedido já enviado!");
            return;
        }

        db.transaction(function(transaction){
            transaction.executeSql(
                "SELECT TIPO, PVENDA, QTDE FROM pedido2 WHERE NUMERO = " + PedidoVenda.getNUMERO(),
                null,
                function(transaction, result){

                    var TOTBRUTO = 0;
                    var TOTBONIF = 0;
                    var TOTTROCA = 0;
                    var TOTOUTROS = 0;

                    for(i=0; i < result.rows.length; i++){
                        
                        switch (result.rows.item(i).TIPO){
                            case 1:
                                TOTBRUTO += result.rows.item(i).PVENDA * result.rows.item(i).QTDE;
                                break;
                            case 2:
                                TOTBONIF += result.rows.item(i).PVENDA * result.rows.item(i).QTDE;
                                break;
                            case 3:
                                TOTTROCA += result.rows.item(i).PVENDA * result.rows.item(i).QTDE;
                                break;
                            case 4:
                                TOTOUTROS += result.rows.item(i).PVENDA * result.rows.item(i).QTDE;
                                break
                        }
                    }

                    SQLite.Exec("UPDATE pedido1 SET "+
                        " TOTBRUTO = " + TOTBRUTO +
                        " ,TOTBONIF = " + TOTBONIF +
                        " ,TOTTROCA = " + TOTTROCA +
                        " ,TOTOUTROS = " + TOTOUTROS +
                        " WHERE NUMERO = " + PedidoVenda.getNUMERO());

                    PedidoVenda.Carregar();
                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });
    };


    // Declaraçao Publicos
    return {
        Carregar: Carregar,
        setNUMERO: setNUMERO,
        Adicionar: Adicionar,
        Remover: Remover,
        Editar: Editar
    };

})();

/* ===== Preloader Page events ===== */
myApp.onPageInit('PedidoItens', function (page) {

    PedidoItens.setNUMERO(page.query.NUMERO);
    PedidoItens.Carregar("");

});