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
        const book = await strapi.db.query('api::book.book').findOne({where:{id:bookId}, populate:{
            owner:true,
            chapters:{select:['id','title']}
        }})

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

        await strapi.db.query("api::chapter.chapter").deleteMany({where:{
            book: book.id
        }})

        await strapi.db.query("api::note.note").deleteMany({where:{
            book: book.id
        }})

        await strapi.db.query("api::book.book").delete({where:{
            id:book.id
        }})


        return ctx.send({data:"Book successfully removed"})
    },

    async update(ctx){
        const id = ctx.params.id
        const user = ctx.state.user
        const body = ctx.request.body

        const book = await strapi.db.query("api::book.book").findOne({where:{id:id}, populate:{
            owner:true
        }})
        if (!book) {
            return ctx.notFound('Book does not exist');
        }

        if (book.owner.id !== user.id) {
            return ctx.unauthorized('You have no access to modify this book');
        }

        const updatedBook = await strapi.db.query("api::book.book").update({where:{id:id}, data:body})
        
        if(!updatedBook)
            return ctx.badRequest("Bad request modifying the book")
        
        ctx.send(updatedBook)
    }
}));
