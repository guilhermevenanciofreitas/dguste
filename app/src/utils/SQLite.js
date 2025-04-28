import SQLiteManager from 'sql.js'
import { get, set } from 'idb-keyval'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

export class SQLite {

  static STORAGE_KEY = 'sqlite'

  constructor() {
    this.db = null
    this.ready = this._init()
  }

  async _init() {

    const SQL = await SQLiteManager({
      locateFile: () => wasmUrl,
    })

    const savedDb = await get(SQLite.STORAGE_KEY)

    if (savedDb) {

      this.db = new SQL.Database(new Uint8Array(savedDb))

    } else {

      this.db = new SQL.Database()

      this.db.run(`

        CREATE TABLE IF NOT EXISTS vendedor (
            codven INTEGER NOT NULL,
            nome TEXT,
            senha TEXT
        );

        CREATE TABLE IF NOT EXISTS pedido1 (
            numero INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            codcli INTEGER,
            codven INTEGER,
            pag TEXT,
            prz INT,
            sit TEXT,
            totbruto REAL DEFAULT 0,
            totdescv REAL DEFAULT 0,
            totbonif REAL DEFAULT 0,
            tottroca REAL DEFAULT 0,
            totoutros REAL DEFAULT 0,
            latitude TEXT,
            longitude TEXT,
            obs TEXT,
            finalizado INTEGER DEFAULT 0,
            enviado INTEGER DEFAULT 0,
            importado INTEGER DEFAULT 0,
            protocolo INTEGER
        );

        CREATE TABLE IF NOT EXISTS pedido2 (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            numero INTEGER NOT NULL,
            tipo INTEGER,
            codprod INTEGER,
            qtde REAL,
            pvenda REAL,
            prtab REAL,
            numlote INTEGER,
            dtvalidade TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cliente (
            codcli INTEGER NOT NULL,
            razao TEXT,
            fantasia TEXT,
            bairro TEXT,
            cidade TEXT,
            uf TEXT,
            codtab INTEGER,
		    prz INTEGER
        );

        CREATE TABLE IF NOT EXISTS produto (
            codprod INTEGER NOT NULL,
            descricao TEXT,
            un TEXT,
            emb REAL,
            custo REAL
        );

        CREATE TABLE IF NOT EXISTS prodpreco (
            transacao INTEGER NOT NULL PRIMARY KEY,
            numtab INTEGER NOT NULL,
            codprod INTEGER,
            preco REAL
        );

      `)

      await this.save()

    }
  }

  async ensureReady() {
    if (!this.db) await this.ready
  }

  async run(sql, params = []) {
    await this.ensureReady()
    this.db.run(sql, params)
    await this.save()
  }

  async exec(sql, params = []) {
    await this.ensureReady()
    return this.toJSON(this.db.exec(sql, params))
  }

  async prepare(sql) {
    await this.ensureReady()
    return this.db.prepare(sql)
  }

  async save() {
    const data = this.db.export()
    await set(SQLite.STORAGE_KEY, data)
  }

  toJSON(result) {

    if (!result[0]) return []

    const { columns, values } = result[0]

    return values.map(row => {

      const obj = {}

      columns.forEach((col, i) => {
        obj[col] = row[i]
      })

      return obj

    })

  }

}