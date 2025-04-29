class MinhasVendasClass {

    constructor() {
        this.db = SQLite.getInstance();
    }

    Carregar() {
        try {
            var data = getPeriodo($("#filtroPeriodo").val());

            var Inicio = data[0];
            var Fim;

            if (data[1] == '') {
                Fim = data[0];
            } else {
                Fim = data[1];
            }

            Inicio = dateParse(Inicio);
            Inicio = new Date(Inicio);
            Inicio.setDate(Inicio.getDate() + 1);

            Fim = dateParse(Fim);
            Fim = new Date(dateParse(Fim));
            Fim.setDate(Fim.getDate() + 1);

            this.db.transaction(function (transaction) {

                transaction.executeSql(
                    "SELECT p.NUMERO, p.PAG, p.SIT, ifnull(c.fantasia,'<font color=red>Nenhum cliente</font>') As fantasia, p.EMISSAO, p.FINALIZADO, p.ENVIADO, p.PROTOCOLO, p.TOTBRUTO, p.IMPORTADO FROM pedido1 p LEFT JOIN cliente c ON c.codcli = p.CODCLI WHERE p.EMISSAO BETWEEN '" + Inicio.toDate('yyyy-mm-dd') + " 00:00:00' AND '" + Fim.toDate('yyyy-mm-dd') + " 23:59:59' ORDER BY p.NUMERO DESC;",
                    null,
                    function (transaction, result) {

                        try {

                            var html = '';

                            var i;

                            for (i = 0; i < result.rows.length; i++) {

                                var EMISSAO = new Date(result.rows.item(i).EMISSAO);

                                var FINALIZADO = result.rows.item(i).FINALIZADO;
                                var ENVIADO = result.rows.item(i).ENVIADO;
                                var IMPORTADO = result.rows.item(i).IMPORTADO;
								var PROTOCOLO = result.rows.item(i).PROTOCOLO;
                                
                                var Status = "";

                                if (IMPORTADO == 1) {
                                    Status += '<span class="badge bg-orange">Importado</span>';
                                }
                                if (FINALIZADO == 0 && ENVIADO == 0) {
                                    Status += '<span class="badge bg-green">Aberto</span>';
                                }
                                if (FINALIZADO == 1 && ENVIADO == 0) {
                                    Status += '<span class="badge bg-blue">Finalizado</span>';
                                }
                                if (FINALIZADO == 1 && ENVIADO == 1) {
                                    Status += '<span class="badge bg-gray">Enviado nº ' + PROTOCOLO + '</span>';
                                }
                                if (ENVIADO == 9) {
                                    Status += '<span class="badge bg-red">Erro envio</span>';
                                }

                                var PAG = result.rows.item(i).PAG;

                                switch(PAG) {
                                    case 'N':
                                        PAG = "Nota Assinada";
                                        break;
                                    case 'B':
                                        PAG = "Boleto";
                                        break;
                                    case 'D':
                                        PAG = "Dinheiro";
                                        break;
                                    case 'C':
                                        PAG = "Cartão";
                                        break;
                                    case 'T':
                                        PAG = "Transf. Bancária";
                                        break;
                                    case 'O':
                                        PAG = "Outro";
                                        break;
                                    default:
                                        PAG = "Nenhum";
                                }

                                var SIT = result.rows.item(i).SIT;

                                switch(SIT) {
                                    case 'V':
                                        SIT = "Pronta Entrega";
                                        break;
                                    case 'P':
                                        SIT = "Pré-Venda";
                                        break;
                                    case 'N':
                                        SIT = "Nota Fiscal";
                                        break;
                                    case 'R':
                                        SIT = "Remessa";
                                        break;
                                    case 'R':
                                        SIT = "Dev Remessa";
                                        break;
                                    default:
                                        SIT = "Nenhum status";
                                }

                                html += '<a href="views/PedidoVenda.html?NUMERO=' + result.rows.item(i).NUMERO + '" class="nolink">' +
                                    '<div class="card">' +
                                    '<div class="card-header">' + EMISSAO.toDate('dd/mm/yyyy hh:ii') + Status + '</div>' +
                                    '<div class="card-content">' +
                                    '<div class="card-content-inner">#' + result.rows.item(i).NUMERO + ' - ' + result.rows.item(i).fantasia + '</div>' +
                                    '</div>' +
                                    '<div class="card-footer">R$ ' + getREAL(result.rows.item(i).TOTBRUTO) + ' (' + PAG + ')  -  ' + SIT + '</div>' +
                                    '</div>' +
                                    '</a>';
                            }

                            if (result.rows.length == 0) {
                                html += '<div class="card-header color-red">Nenhuma venda para esse período!</div>';
                            }

                            $("#listVendas").html(html);

                        } catch (e) {
                            alert(e.message);
                        }
                    },
                    function (transaction, error) {
                        alert(error.message);
                    }
                );
            });
        } catch (e) {
            alert(e.message);
        }
    }

    Novo() {
        var EMISSAO = new Date();

        var codven = Login.getCodven();
        this.db.transaction(function (transaction) {
            transaction.executeSql(
                "INSERT INTO pedido1 (CODCLI, CODVEN, EMISSAO, FINALIZADO, ENVIADO) VALUES (?,?,?,?,?);",
                [null, codven, EMISSAO.toDate('yyyy-mm-dd hh:i:ss'), 0, 0],
                function (transaction, result) {

                    mainView.router.loadPage('views/PedidoVenda.html?NUMERO=' + result.insertId);

                },
                function (transaction, error) {
                    alert(error.message);
                }
            );
        });
    }

    
    Totais() {
        
        var data = getPeriodo($("#filtroPeriodo").val());

        var Inicio = data[0];
        var Fim;

        if (data[1] == '') {
            Fim = data[0];
        } else {
            Fim = data[1];
        }

        Inicio = dateParse(Inicio);
        Inicio = new Date(Inicio);
        Inicio.setDate(Inicio.getDate() + 1);

        Fim = dateParse(Fim);
        Fim = new Date(dateParse(Fim));
        Fim.setDate(Fim.getDate() + 1);

        var sql = `SELECT 
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS PRONTAENTREGA, 
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT <> 'V' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS OUTROS,
        
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND PAG = 'N' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS NOTAASSINADA,
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND PAG = 'B' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS BOLETO,
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND PAG = 'D' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS DINHEIRO,
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND PAG = 'C' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS CARTAO,
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND PAG = 'T' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS TRANSFBANC,
        IFNULL((SELECT SUM(TOTBRUTO - TOTDESCV) FROM pedido1 WHERE SIT = 'V' AND PAG = 'O' AND EMISSAO BETWEEN '` + Inicio.toDate('yyyy-mm-dd') + ` 00:00:00' AND '` + Fim.toDate('yyyy-mm-dd') + ` 23:59:59'),0) AS OUTROS2`;
        
        console.log(sql);

        this.db.transaction(function(transaction){
            transaction.executeSql(
                sql,
                null,
                function(transaction, result){

                    myApp.alert(`Pronta Entrega: ` + result.rows.item(0).PRONTAENTREGA.toFixed(2) + `<br>
                     
                     <br>
                     Nota Assinada: ` + result.rows.item(0).NOTAASSINADA.toFixed(2) + `<br>
                     Boleto: ` + result.rows.item(0).BOLETO.toFixed(2) + `<br>
                     Dinheiro: ` + result.rows.item(0).DINHEIRO.toFixed(2) + `<br>
                     Cartão ` + result.rows.item(0).CARTAO.toFixed(2) + `<br>
                     Transf. Banc: ` + result.rows.item(0).TRANSFBANC.toFixed(2) + `<br>
                     Outros: ` + result.rows.item(0).OUTROS2.toFixed(2));

                },
                function(transaction, error){
                    alert(error.message);
                }
            );
        });

        
    }
	
	EnviarPedido(NUMERO) {
		
		var sQuery = `SELECT NUMERO, EMISSAO, CODCLI, CODVEN, PAG, PRZ, SIT, OBS, PROTOCOLO, IMPORTADO, TOTBRUTO, TOTBONIF, TOTTROCA, TOTOUTROS  FROM pedido1 WHERE FINALIZADO = 1 AND NUMERO = ` + NUMERO;
		
		BDLocal.Execute(sQuery, null, function (dados) {
			
			if (dados.length == 0) {
				myApp.alert(`Pedido nº ` + NUMERO + ` não foi finalizado!`);
				return;
			}
            
			var MysqlQuery = ``;
			
			for (var i = 0; i < dados.length; i++){
                
				MysqlQuery = ``;
                
                if (dados[i][`PRZ`] == null || toString(dados[i][`PRZ`]).trim() == ''){
                    dados[i][`PRZ`] = 0;
                }

				if (dados[i][`PROTOCOLO`] == null || dados[i][`PROTOCOLO`] == ``) {
					
					MysqlQuery += ` INSERT INTO pedido1 (NUMERO, EMISSAO, CODCLI, CODVEN, TAB, PAG, PRZ, SIT, VENCTO, OBS, IMPORTADO, TOTBRUTO, TOTBONIF, TOTTROCA, TOTOUTROS, versao)`;
					MysqlQuery += ` VALUES ((SELECT NUMERO FROM (SELECT IFNULL(MAX(NUMERO)+1,1) AS NUMERO FROM pedido1) AS X),'` + dados[i]["EMISSAO"] + `', ` + dados[i]["CODCLI"] + `, ` + dados[i]["CODVEN"] + `,`;
					MysqlQuery += ` 1,'` + dados[i]["PAG"] + `', ` + dados[i]["PRZ"] + `,'` + dados[i]["SIT"] + `',`;
					MysqlQuery += ` ADDDATE('` + dados[i]["EMISSAO"] + `', INTERVAL ` + dados[i]["PRZ"] + ` DAY), '` + dados[i]["OBS"].replace("'", "''") + `', ` + dados[i]["IMPORTADO"] + `, ` + dados[i]["TOTBRUTO"] + `, ` + dados[i]["TOTBONIF"] + `, ` + dados[i]["TOTTROCA"] + `, ` + dados[i]["TOTOUTROS"] + `, '3.2');`;
                    
                    MysqlQuery += ' SELECT (SELECT NUMERO FROM (SELECT IFNULL(MAX(NUMERO),1) AS NUMERO FROM pedido1) AS X) AS PROTOCOLO;';

				} else {

					MysqlQuery += ` UPDATE pedido1 SET `;
					MysqlQuery += `	EMISSAO = '` + dados[i]["EMISSAO"] + `',`;
					MysqlQuery += `	CODCLI = ` + dados[i]["CODCLI"] + `, `;
					MysqlQuery += `	CODVEN = ` + dados[i]["CODVEN"] + `, `;
					MysqlQuery += `	PAG = '` + dados[i]["PAG"] + `', `;
					MysqlQuery += `	PRZ = ` + dados[i]["PRZ"] + `, `;
					MysqlQuery += `	SIT = '` + dados[i]["SIT"] + `',`;
					MysqlQuery += `	VENCTO = ADDDATE('` + dados[i]["EMISSAO"] + `', INTERVAL ` + dados[i]["PRZ"] + ` DAY), `;
					MysqlQuery += `	OBS = '` + dados[i]["OBS"].replace("'", "''") + `', `;
					MysqlQuery += ` IMPORTADO = ` + dados[i]["IMPORTADO"] + `, `;
					
					MysqlQuery += `	TOTBRUTO = ` + dados[i]["TOTBRUTO"] + `, `;
					MysqlQuery += `	TOTBONIF = ` + dados[i]["TOTBONIF"] + `, `;
					MysqlQuery += `	TOTTROCA = ` + dados[i]["TOTTROCA"] + `,`;
                    MysqlQuery += `	TOTOUTROS = ` + dados[i]["TOTOUTROS"] + `,`;
                    MysqlQuery += ` versao = '3.2'`;
					MysqlQuery += `	WHERE NUMERO = ` + dados[i]["PROTOCOLO"] + `;`;
					
                    MysqlQuery += ` SELECT ` + dados[i]["PROTOCOLO"] + ` AS PROTOCOLO;`;

                }
                
                $.ajax({
                    url: Restful.getIP() + `database_v3.php`,
                    type: `POST`,
                    data: {
                        query: MysqlQuery
                    },
                    dataType: `json`,
					async: false
                }).done(function (data) {
                    
					BDLocal.Execute(`UPDATE pedido1 SET PROTOCOLO = ` + data[0]['PROTOCOLO'] + ` WHERE NUMERO = ` + NUMERO, null, function () {
						MinhasVendas.EnviarProdutosMelhorada(NUMERO, data[0]['PROTOCOLO']);
					})
					
                }).fail(function (jqXHR, textStatus) {
					
					BDLocal.Execute(`UPDATE pedido1 SET ENVIADO = 9 WHERE NUMERO = ` + NUMERO)
					
                })  
			}
        });
	}
	
	EnviarProdutosMelhorada(NUMERO, PROTOCOLO){
		
		var sQuery = `SELECT p1.NUMERO, p1.PROTOCOLO, TIPO, CODPROD, PVENDA, SUM(QTDE) AS QTDE, PRTAB, NUMLOTE, DTVALIDADE FROM pedido2 p2 LEFT JOIN pedido1 p1 ON p1.NUMERO = p2.NUMERO WHERE p1.NUMERO = ` + NUMERO + ` GROUP BY p2.NUMERO, TIPO, CODPROD, PVENDA`
		
		BDLocal.Execute(sQuery, null, function (dados) {
			
			var MysqlQuery = ``;
			
			MysqlQuery += ` DELETE FROM pedido2 WHERE NUMERO = ` + PROTOCOLO + `;`;
			
			for (var i = 0; i < dados.length; i++){
                
                if (dados[i]['DTVALIDADE'] == ``){
                    dados[i]['DTVALIDADE'] = `null`;
                } else {
                    dados[i]['DTVALIDADE'] = `'` + dados[i]['DTVALIDADE'] + `'`;
                }

				MysqlQuery += ` INSERT INTO pedido2 (NUMERO, TIPO, CODPROD, QTDE, UN, PVENDA, PRTAB, NUMLOTE, DTVALIDADE, PCUSTO) `;
				MysqlQuery += ` VALUES (` + PROTOCOLO + `, ` + dados[i]['TIPO'] + `, ` + dados[i]['CODPROD'] + `, ` + dados[i]['QTDE'] + `, `;
				MysqlQuery += ` (SELECT UN FROM produto WHERE codprod = ` + dados[i]['CODPROD'] + `),` + dados[i]['PVENDA'] + `,0, `;
				MysqlQuery += ` ` + dados[i]['NUMLOTE'] + `, ` + dados[i]['DTVALIDADE'] + `, (SELECT CUSTO FROM produto WHERE CODPROD = ` + dados[i]['CODPROD'] + ` LIMIT 1)); `;
				
            }
			
			MysqlQuery += ` SELECT 1 AS Salvo;`;
			
			$.ajax({
                url: Restful.getIP() + `database_v3.php`,
                type: `POST`,
                data: {
                    query: MysqlQuery
                },
                dataType: `json`,
                async: false
            }).done(function (data) {

                if (data[0][`Salvo`] == 1){

					BDLocal.Execute(`UPDATE pedido1 SET ENVIADO = 1 WHERE NUMERO = ` + NUMERO)
				
                } else {
					
					BDLocal.Execute(`UPDATE pedido1 SET ENVIADO = 9 WHERE NUMERO = ` + NUMERO)

                }
                
            }).fail(function (jqXHR, textStatus) {
				
				BDLocal.Execute(`UPDATE pedido1 SET ENVIADO = 9 WHERE NUMERO = ` + NUMERO)
				
            })
		})
	}

	PrepararEnvio() {
		
		var data = getPeriodo($("#filtroPeriodo").val());

        var Inicio = data[0];
        var Fim;

        if (data[1] == '') {
            Fim = data[0];
        } else {
            Fim = data[1];
        }

        Inicio = dateParse(Inicio);
        Inicio = new Date(Inicio);
        Inicio.setDate(Inicio.getDate() + 1);

        Fim = dateParse(Fim);
        Fim = new Date(dateParse(Fim));
        Fim.setDate(Fim.getDate() + 1);
		
		var sQuery = "SELECT NUMERO FROM pedido1 WHERE ENVIADO = 0 AND FINALIZADO = 1 AND EMISSAO BETWEEN '" + Inicio.toDate('yyyy-mm-dd') + " 00:00:00' AND '" + Fim.toDate('yyyy-mm-dd') + " 23:59:59'";
		
		myApp.showPreloader(`Enviando pedidos...`);
		
		BDLocal.Execute(sQuery, null, function (dados) {
			
			for (var i = 0; i < dados.length; i++){
				
				MinhasVendas.EnviarPedido(dados[i]["NUMERO"])
				
			}
			
			setTimeout(function(){ 
				myApp.hidePreloader();
				MinhasVendas.Carregar();
			}, 3000 * dados.length);
			
		})
		
		
	}
	
	/*
    Enviar(NUMERO) {
	
        var data = getPeriodo($("#filtroPeriodo").val());

        var Inicio = data[0];
        var Fim;

        if (data[1] == '') {
            Fim = data[0];
        } else {
            Fim = data[1];
        }

        Inicio = dateParse(Inicio);
        Inicio = new Date(Inicio);
        Inicio.setDate(Inicio.getDate() + 1);

        Fim = dateParse(Fim);
        Fim = new Date(dateParse(Fim));
        Fim.setDate(Fim.getDate() + 1);
		
		if (NUMERO == 0) {
			var sQuery = "SELECT null as NUMERO, NUMERO as NUMPED, EMISSAO, CODCLI, CODVEN, PAG, PRZ, SIT, OBS, PROTOCOLO, IMPORTADO, TOTBRUTO, TOTBONIF, TOTTROCA, TOTOUTROS  FROM pedido1 WHERE ENVIADO = 0 AND FINALIZADO = 1 AND EMISSAO BETWEEN '" + Inicio.toDate('yyyy-mm-dd') + " 00:00:00' AND '" + Fim.toDate('yyyy-mm-dd') + " 23:59:59'";
		} else {
			var sQuery = "SELECT null as NUMERO, NUMERO as NUMPED, EMISSAO, CODCLI, CODVEN, PAG, PRZ, SIT, OBS, PROTOCOLO, IMPORTADO, TOTBRUTO, TOTBONIF, TOTTROCA, TOTOUTROS  FROM pedido1 WHERE ENVIADO = 0 AND FINALIZADO = 1 AND NUMERO = " + NUMERO;
		}
        
        BDLocal.Execute(sQuery, null, function (dados) {
			
			if (dados.length == 0) {
				myApp.alert("Nenhum pedido finalizado!");
				return;
			}
            
            myApp.showPreloader("Enviando...");

			var MysqlQuery = '';
			
			var ultimoPedido = false;
			
			for (var i = 0; i < dados.length; i++){
                
				if (i+1 == dados.length) {
                    ultimoPedido = true;
				}
			
				MysqlQuery = ``;
                
                if (dados[i]["PRZ"] == null || toString(dados[i]["PRZ"]).trim() == ''){
                    dados[i]["PRZ"] = 0;
                }

				if (dados[i]['PROTOCOLO'] == null) {
					
					MysqlQuery += `INSERT INTO pedido1 (NUMERO, EMISSAO, CODCLI, CODVEN, TAB, PAG, PRZ, SIT, VENCTO, OBS, IMPORTADO, TOTBRUTO, TOTBONIF, TOTTROCA, TOTOUTROS, versao)`;
					MysqlQuery += `VALUES ((SELECT NUMERO FROM (SELECT IFNULL(MAX(NUMERO)+1,1) AS NUMERO FROM pedido1) AS X),'` + dados[i]["EMISSAO"] + `', ` + dados[i]["CODCLI"] + `, ` + dados[i]["CODVEN"] + `,`;
					MysqlQuery += `1,'` + dados[i]["PAG"] + `', ` + dados[i]["PRZ"] + `,'` + dados[i]["SIT"] + `',`;
					MysqlQuery += `ADDDATE('` + dados[i]["EMISSAO"] + `', INTERVAL ` + dados[i]["PRZ"] + ` DAY), '` + dados[i]["OBS"].replace("'", "''") + `', ` + dados[i]["IMPORTADO"] + `, ` + dados[i]["TOTBRUTO"] + `, ` + dados[i]["TOTBONIF"] + `, ` + dados[i]["TOTTROCA"] + `, ` + dados[i]["TOTOUTROS"] + `, '3.1');`;
                    
                    MysqlQuery += ' SELECT (SELECT NUMERO FROM (SELECT IFNULL(MAX(NUMERO),1) AS NUMERO FROM pedido1) AS X) AS PROTOCOLO, '+ dados[i]['NUMPED'] +' AS NUMPED;';

				} else {

					MysqlQuery += 'UPDATE pedido1 SET ';
					MysqlQuery += `	EMISSAO = '` + dados[i]["EMISSAO"] + `',`;
					MysqlQuery += '	CODCLI = ' + dados[i]["CODCLI"] + ', ';
					MysqlQuery += '	CODVEN = ' + dados[i]["CODVEN"] + ', ';
					MysqlQuery += `	PAG = '` + dados[i]["PAG"] + `', `;
					MysqlQuery += '	PRZ = ' + dados[i]["PRZ"] + ', ';
					MysqlQuery += `	SIT = '` + dados[i]["SIT"] + `',`;
					MysqlQuery += `	VENCTO = ADDDATE('` + dados[i]["EMISSAO"] + `', INTERVAL ` + dados[i]["PRZ"] + ` DAY), `;
					MysqlQuery += `	OBS = '` + dados[i]["OBS"].replace("'", "''") + `', `;
					MysqlQuery += ' IMPORTADO = ' + dados[i]["IMPORTADO"] + ', ';
					
					MysqlQuery += '	TOTBRUTO = ' + dados[i]["TOTBRUTO"] + ', ';
					MysqlQuery += '	TOTBONIF = ' + dados[i]["TOTBONIF"] + ', ';
					MysqlQuery += '	TOTTROCA = ' + dados[i]["TOTTROCA"] + ',';
                    MysqlQuery += '	TOTOUTROS = ' + dados[i]["TOTOUTROS"] + ',';
                    MysqlQuery += " versao = '3.1'";
					MysqlQuery += '	WHERE numero = ' + dados[i]["PROTOCOLO"] + ';';
					
                    MysqlQuery += ' SELECT ' + dados[i]["PROTOCOLO"] + ' AS PROTOCOLO;';

                }

                var NUMPED = dados[i]['NUMPED'];
                
                $.ajax({
                    url: Restful.getIP() + "database_v3.php",
                    type: "POST",
                    data: {
                        query: MysqlQuery
                    },
                    dataType: "json",
                    async: false
                }).done(function (data) {
                    
                    if (ultimoPedido == true){
                        var db = BDLocal.getInstance();
                        db.transaction(function(tx){
                            tx.executeSql("UPDATE pedido1 SET PROTOCOLO = " + data[0]['PROTOCOLO'] + " WHERE NUMERO = " + NUMPED, [], function(transaction, result) {
                                    MinhasVendas.EnviarProdutos(NUMPED, data[0]['PROTOCOLO'], ultimoPedido);
                                }, function(transaction, error){
                                    alert(error.message);
                                }
                            );
                        });
                    }
                    
                }).fail(function (jqXHR, textStatus) {
                    try {

                        if (ultimoPedido == true){
                            var db = BDLocal.getInstance();
                            db.transaction(function(tx){
                                tx.executeSql("UPDATE pedido1 SET ENVIADO = 9 WHERE NUMERO = " + NUMPED, [], function(transaction, result) {
                                        MinhasVendas.Carregar();
                                        PedidoVenda.Carregar();
                                    }, function(transaction, error){
                                        alert(error.message);
                                    }
                                );
                            });
                        }

                        myApp.hidePreloader();
                        myApp.alert("Não foi possível enviar o pedido " + NUMPED);

                        /*if (ultimoPedido == true){
                            setTimeout(MinhasVendas.Carregar, 2000);
                        }*/

                    /*} catch (e) {
                        alert(e);
                    }
                })

                
			}

        });

    }*/

    /*EnviarProdutos(NUMPED, PROTOCOLO, ultimoPedido) {

        var Dados = function (dados) {
            
            var MysqlQuery = '';
			
			MysqlQuery += ' DELETE FROM pedido2 WHERE numero = ' + PROTOCOLO + ';';
			
			for (var i = 0; i < dados.length; i++){
                
                if (dados[i]['DTVALIDADE'] == ''){
                    dados[i]['DTVALIDADE'] = `null`;
                } else {
                    dados[i]['DTVALIDADE'] = `'` + dados[i]['DTVALIDADE'] + `'`;
                }

				MysqlQuery += '\nINSERT INTO pedido2 (NUMERO, TIPO, CODPROD, QTDE, UN, PVENDA, PRTAB, NUMLOTE, DTVALIDADE, PCUSTO) ';
				MysqlQuery += 'VALUES (' + PROTOCOLO + ', ' + dados[i]['TIPO'] + ', ' + dados[i]['CODPROD'] + ', ' + dados[i]['QTDE'] + ', ';
				MysqlQuery += '(SELECT UN FROM produto WHERE codprod = ' + dados[i]['CODPROD'] + '),' + dados[i]['PVENDA'] + ',0, ';
				MysqlQuery += dados[i]['NUMLOTE'] + `, ` + dados[i]['DTVALIDADE'] + `, (SELECT CUSTO FROM produto WHERE CODPROD = ` + dados[i]['CODPROD'] + ` LIMIT 1)); `;
				
            }

            MysqlQuery += " SELECT 1 AS Salvo;";

            

        }

        BDLocal.Execute("SELECT p1.NUMERO, p1.PROTOCOLO, TIPO, CODPROD, PVENDA, SUM(QTDE) AS QTDE, PRTAB, NUMLOTE, DTVALIDADE FROM pedido2 p2 LEFT JOIN pedido1 p1 ON p1.NUMERO = p2.NUMERO WHERE p1.NUMERO = " + NUMPED + " GROUP BY p2.NUMERO, TIPO, CODPROD, PVENDA", null, Dados);

    }
*/
    
	Importar() {

        var EMISSAO = new Date();

        myApp.showPreloader("Importando...");

        $.ajax({
            url: Restful.getIP() + "orcamento.php?action=getPedidos",
            type: "POST",
            data: {
                codven: Login.getCodven()
            },
            dataType: "json"
        }).done(function (data) {

            if (data.length == 0) {
                myApp.alert("Nenhum pedido para importar");
                myApp.hidePreloader();
                return;
            }

            var novo = "INSERT INTO pedido1 (EMISSAO,CODCLI,CODVEN,PAG,PRZ,SIT,TOTBRUTO,TOTDESCV," +
                "TOTBONIF,TOTTROCA,TOTOUTROS, OBS, IMPORTADO, PROTOCOLO) VALUES ";
            var deletar = 'DELETE FROM pedido2 WHERE NUMERO IN ('

            for (var i = 0; i < data.length; i++) {
                deletar += data[i]['PROTOCOLO'] + ",";

                novo += " ('" + EMISSAO.toDate('yyyy-mm-dd hh:i:ss') + "'" +
                    ",'" + data[i]['CODCLI'].replace("'", "''") + "'" +
                    ",'" + data[i]['CODVEN'] + "'" +
                    ",'" + data[i]['PAG'] + "'" +
                    ",'" + data[i]['PRZ'] + "'" +
                    ",'" + data[i]['SIT'] + "'" +
                    ",'" + data[i]['TOTBRUTO'] + "'" +
                    ",'" + data[i]['TOTDESCV'] + "'" +
                    ",'" + data[i]['TOTBONIF'] + "'" +
                    ",'" + data[i]['TOTTROCA'] + "'" +
                    ",'" + data[i]['TOTOUTROS'] + "'" +
                    ",'" + data[i]['OBS'] + "'" +
                    ",1" +
                    "," + data[i]['PROTOCOLO'] + "),"
            }

            SQLite.Exec(deletar.substr(0, deletar.length - 1) + ")");
            SQLite.Exec(novo.substr(0, novo.length - 1));

            MinhasVendas.ImportarProdutos(data);

        }).fail(function (jqXHR, textStatus) {
            console.log(textStatus);
            myApp.hidePreloader();
            myApp.alert("Não foi possível importar pedidos");
        });
    }

    ImportarProdutos(data) {

        $.ajax({
            url: Restful.getIP() + "orcamento.php?action=getProdutos",
            type: "POST",
            data: {
                dados: data
            },
            dataType: "json"
        }).done(function (produto) {

            if (produto.length == 0){
                return;
            }

            var novo = "INSERT INTO pedido2 (NUMERO, PROTOCOLO,TIPO,CODPROD,QTDE,PVENDA,PRTAB,NUMLOTE,DTVALIDADE) VALUES ";
            var deletar = 'DELETE FROM pedido2 WHERE PROTOCOLO IN ('

            for (var i = 0; i < produto.length; i++) {
                deletar += produto[i]['NUMERO'] + ",";

                novo += " (''" +
                    ",'" + produto[i]['NUMERO'] + "'" +
                    ",'" + produto[i]['TIPO'] + "'" +
                    ",'" + produto[i]['CODPROD'] + "'" +
                    ",'" + produto[i]['QTDE'] + "'" +
                    ",'" + produto[i]['PVENDA'] + "'" +
                    ",'" + produto[i]['PRTAB'] + "'" +
                    ",'" + produto[i]['NUMLOTE'] + "'" +
                    ",'" + produto[i]['DTVALIDADE'] + "'),";
            }

            SQLite.Exec(deletar.substr(0, deletar.length - 1) + ")");
            SQLite.Exec(novo.substr(0, novo.length - 1));

            SQLite.Exec("UPDATE pedido2 SET NUMERO = (SELECT NUMERO FROM pedido1 WHERE pedido2.PROTOCOLO = pedido1.PROTOCOLO AND pedido1.IMPORTADO = 1 AND pedido1.ENVIADO = 0 AND pedido1.FINALIZADO = 0) WHERE NUMERO = ''")

            myApp.hidePreloader();
            myApp.alert("Importado");

            MinhasVendas.Carregar("");

        }).fail(function (jqXHR, textStatus) {
            myApp.hidePreloader();
            myApp.alert("Não foi possível importar produtos");
        });

        /*
        MinhasVendas.Carregar("");

        myApp.hidePreloader();
        myApp.alert("Importado!");
        
        */
    }
}

var MinhasVendas = new MinhasVendasClass();

myApp.onPageInit('MinhasVendas', function (page) {

    var data = new Date();

    $("#filtroPeriodo").val(data.toDate('dd/mm/yyyy'));

    // Range Picker
    var calendarRange = myApp.calendar({
        input: '#filtroPeriodo',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    MinhasVendas.Carregar();

});