window.onload = initPage;
function initPage(){
    Main.init();
}

// Modulo Pattern
var Main = (function () {

    var init = function () {

        Login.Atualizar(false);

        CreateTables();

        mainView.router.loadPage('views/Login.html');

        return true;
    };

    var CreateTables = function () {
        try{

            //SQLite.Exec("DROP TABLE pedido1");

            SQLite.Exec("CREATE TABLE IF NOT EXISTS vendedor (" +
                "codven INTEGER NOT NULL, " +
                "nome TEXT, " +
                "senha TEXT " +
                ");");

            SQLite.Exec("CREATE TABLE IF NOT EXISTS pedido1 (" +
                "NUMERO INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                "EMISSAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "CODCLI INTEGER, " +
                "CODVEN INTEGER, " +
                "PAG TEXT, " +
                "PRZ INT, " +
                "SIT TEXT, " +
                "TOTBRUTO REAL DEFAULT 0, " +
                "TOTDESCV REAL DEFAULT 0, " +
                "TOTBONIF REAL DEFAULT 0, " +
                "TOTTROCA REAL DEFAULT 0, " +
                "TOTOUTROS REAL DEFAULT 0, " +
                "LATITUDE TEXT, " +
                "LONGITUDE TEXT, " +
                "OBS TEXT, " +
                "FINALIZADO INTEGER DEFAULT 0, " +
                "ENVIADO INTEGER DEFAULT 0, " +
                "IMPORTADO INTEGER DEFAULT 0, " +
                "PROTOCOLO INTEGER " +
                ");");

            SQLite.Exec("CREATE TABLE IF NOT EXISTS pedido2 (" +
                    "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                    "NUMERO INTEGER NOT NULL, " +
                    "TIPO INTEGER, " +
                    "CODPROD INTEGER, " +
                    "QTDE REAL, " +
                    "PVENDA REAL, " +
                    "PRTAB REAL, " +
                    "NUMLOTE INTEGER, " +
                    "DTVALIDADE TIMESTAMP, " +
                    "PROTOCOLO INTEGER" +
                    ")");

            SQLite.Exec("CREATE TABLE IF NOT EXISTS cliente (" +
                    "codcli INTEGER NOT NULL, " +
                    "fantasia TEXT, " +
                    "bairro TEXT, " +
                    "cidade TEXT, " +
                    "uf TEXT, " +
                    "codtab INTEGER, " +
					"prz INTEGER" +
                    ");");

            SQLite.Exec("CREATE TABLE IF NOT EXISTS produto (" +
                    "CODPROD INTEGER NOT NULL, " +
                    "DESCRICAO TEXT, " +
                    "UN TEXT, " +
                    "EMB REAL, " +
                    "CUSTO REAL " +
                    ")");

            SQLite.Exec("CREATE TABLE IF NOT EXISTS prodpreco (" +
                "transacao INTEGER NOT NULL PRIMARY KEY, " +
                "NUMTAB INTEGER NOT NULL, " +
                "CODPROD INTEGER, " +
                "PRECO REAL " +
                ")");


            //SQLite.Exec("INSERT INTO pedido1 (CODCLI, FINALIZADO, ENVIADO) VALUES (?,?,?)",[1, 0, 0]);
            //SQLite.Exec("INSERT INTO cliente (codcli, fantasia, bairro, cidade, uf, codtab) VALUES (?,?,?,?,?,?)",['1', 'GUILHERME', 'VALPARAISO','SERRA', 'ES',2]);
            //SQLite.Exec("INSERT INTO cliente (codcli, fantasia, bairro, cidade, uf, codtab) VALUES (?,?,?,?,?,?)",['2', 'Teste', 'VALPARAISO','SERRA', 'ES',1]);
            //SQLite.Exec("INSERT INTO produto (CODPROD, DESCRICAO, UN, EMB, CUSTO) VALUES (?,?,?,?,?)",[1, 'MASSA DE PASTEL', 'UN', 0.600, 2.5]);
            //SQLite.Exec("INSERT INTO produto (CODPROD, DESCRICAO, UN, EMB, CUSTO) VALUES (?,?,?,?,?)",[2, 'MASSA DE PIZZA', 'UN', 0.600, 2.5]);
            //SQLite.Exec("INSERT INTO prodpreco (NUMTAB, CODPROD, PRECO) VALUES (?,?,?)",[1, 1, 5]);
            //SQLite.Exec("INSERT INTO prodpreco (NUMTAB, CODPROD, PRECO) VALUES (?,?,?)",[2, 1, 7]);

        } catch (err){
            console.log(err);
        }
    }

    // Declaraçao Publicos
    return {
        init: init
    };

})();