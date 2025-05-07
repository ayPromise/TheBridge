/**
 * chapter controller
 */

import { factories } from '@strapi/strapi'

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
    }
}));

