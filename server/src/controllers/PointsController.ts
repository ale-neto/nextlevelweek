import {Request, Response} from 'express'
import knex from '../database/connection';


class PointsController{

        async index (request: Request, response: Response){
            const { city, uf, items} = request.query;
            const parsedItems = String(items).split(',')
            .map(item => Number(item.trim()));
            const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
            
            return response.json(points);
        }

        async show (request: Request, response: Response){
            const { id } = request.params;
            const point = await knex('points').where('id', id).first();

            if(!point){
                return response.status(400).json({message : 'Point not found'});
            }
            const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title');
            return response.json({ point, items }); 
        }

        async create (request: Request, response: Response) {
            const {
                name,
                email,
                whatsapp,
                latidade,
                longitude,
                city,
                uf,
                items
            } = request.body;
        
            const trx = await knex.transaction();
            
            const points = {
                image : 'https://images.unsplash.com/photo-1569180880150-df4eed93c90b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
                name,
                email,
                whatsapp,
                latidade,
                longitude,
                city,
                uf
            };

            const insertedIds = await trx('points').insert(points);
            const point_id = insertedIds[0];
            const pointItems = items.map((item_id: number) => {
                return{
                    item_id,
                    point_id,
                };
            })
        
            await trx('points_items').insert(pointItems);
            trx.commit();
           return response.json({
                id: point_id,
                ...points,
            });
        }

    }


export default PointsController;
