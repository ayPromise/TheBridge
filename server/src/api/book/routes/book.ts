import { factories } from "@strapi/strapi"

export default factories.createCoreRouter('api::book.book', {
  config:{
    find:{
      policies:['global::is-authenticated']
    },
    findOne:{
      policies:['global::is-authenticated']
    },
    create:{
      policies:['global::is-authenticated']
    },
    delete:{
      policies:['global::is-authenticated']
    }
  }
});
