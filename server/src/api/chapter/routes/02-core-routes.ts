/**
 * chapter router
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreRouter('api::chapter.chapter', {
  config:{
    find:{
      policies:['global::is-authenticated'],
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

