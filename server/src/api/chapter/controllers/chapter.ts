/**
 * chapter controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::chapter.chapter', ({strapi})=>({
    // user
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

    // admin
    async findAll(ctx){
        const chapters = await strapi.db.query('api::chapter.chapter').findMany({where:{},  
        
            populate: { book: { populate: ['owner'] } }})

        if (chapters.length < 0) {
            return ctx.notFound('No chapters were found');
        }

        return ctx.send({ data: chapters });
    },

    // user
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
    },

    // admin
    async deleteAll(ctx) {
        try {
          const result = await strapi.db.query('api::chapter.chapter').deleteMany();
          ctx.send({ message: 'All chapters deleted', result });
        } catch (error) {
          ctx.throw(500, 'Failed to delete chapters');
        }
      }

}));

