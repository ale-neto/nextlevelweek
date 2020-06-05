import Knex from 'knex';

export async function seed(knex : Knex){
    await knex('items').insert([
         {title: 'Vidro', image: 'vidro.svg'},
         {title: 'Metal', image: 'metal.svg'},
         {title: 'Papel', image: 'papel.svg'},
         {title: 'Plástico', image: 'plastico.svg'},
         {title: 'Outros', image:'outros.svg'},
    ]);
} 