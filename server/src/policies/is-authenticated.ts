import { Context } from 'koa';

/**
 * The policy checks if user is authenticated
 * 
 * @param ctx - Koa context object
 * @returns boolean
 */

export default (ctx: Context): boolean=> {
  
  if (!ctx.state.user) {
    return false
  }

  return true
};
