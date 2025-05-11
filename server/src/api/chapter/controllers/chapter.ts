/**
 * chapter controller
 */

import { factories } from '@strapi/strapi'
import book from '../../book/controllers/book';

export default factories.createCoreController('api::chapter.chapter', ({strapi})=>({
    async findOne(ctx){
        const user = ctx.state.user
        const chapterId = ctx.params.id
        const chapter = await strapi.db.query('api::chapter.chapter').findOne({where:{id:chapterId},  
        
            populate: { book: { populate: ['owner'] } }})

        if (!chapter) {
            return ctx.notFound('Chapter does not exist');
        }

        if(chapter.book.owner.id !== user.id)
            return ctx.unauthorized('You have no access to that book')

        return ctx.send({ data: chapter });
    },

    async find(ctx){
        const user = ctx.state.user
        const bookId = ctx.params.id
        const chapters = await strapi.db.query('api::chapter.chapter').findMany({where:{book:{id:bookId}},  
        
            populate: { book: { populate: ['owner'] } }})

        if (!chapters) {
            return ctx.notFound('No chapters were found');
        }

        if(chapters[0].book.owner.id !== user.id)
            return ctx.unauthorized('You have no access to that book')

        return ctx.send({ data: chapters });
    },


    async findChapter(ctx){
        const user = ctx.state.user;
        const bookId = ctx.params.bookId
        const chapterId = ctx.params.chapterId
        const chapter = await strapi.db.query('api::chapter.chapter').findOne({where:{book:{id:bookId}, id:chapterId}, populate:{
            book:{ populate:['owner']},
            epigraph:true
        }})

        if(!chapter)
            return ctx.notFound("No chapter found")

        if(chapter.book.owner.id !== user.id)
            return ctx.unauthorized("You have no access to that book")

        return ctx.send({data:chapter})
    }
}));

