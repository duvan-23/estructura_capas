const knex =require( 'knex');
let ClienteSQL1 =class {
    constructor(options) {
        this.knex = knex(options)
    }
    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
        .finally(() => {
            return this.knex.schema.createTable('productos', table => {
                table.increments('id').primary()
                table.string('nombre', 50).notNullable()
                table.double('precio')
                table.string('foto', 100).notNullable()
            })
        })
    }

    insertarProductos(productos) {
        return this.knex('productos').insert(productos);
    }

    listarProductos() {
        return this.knex('productos').select('*');
    }

    close() {
        this.knex.destroy()
    }
}

module.exports = ClienteSQL1;