/**
 * book controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::book.book', ({strapi})=>({
    async find(ctx){
        const user = ctx.state.user
        const books = await strapi.db.query('api::book.book').findMany({where:{owner:user.id}, populate:{
            owner:true,
            chapters:{select:['id','title']}
        }})
        return ctx.send({data:books})
    },

    async findOne(ctx){
        const user = ctx.state.user
        const bookId = ctx.params.id
        const book = await strapi.db.query('api::book.book').findOne({where:{id:bookId}, populate:true})

        if (!book) {
            return ctx.notFound('Book does not exist');
        }

        if(book.owner.id !== user.id)
            return ctx.unauthorized('You have no access to that book')

        return ctx.send({ data: book });
    },

    async delete(ctx){
        const user = ctx.state.user
        const bookId = ctx.params.id
        const book = await strapi.db.query("api::book.book").findOne({where:{id:bookId}, populate:['owner']})

        if(!book)
            return ctx.notFound("Book doesn't exist")

        if(book.owner.id !== user.id)
            return ctx.unauthorized("You have no access to that book")

        await strapi.db.query("api::book.book").delete({where:{
            id:book.id
        }})

        return ctx.send({data:"Book successfully removed"})
    }
}));
