export default (policyContext, config, { strapi }) => {
    const { user } = policyContext.state;
  
    if (!user) {
      return false;
    }
  
    // For Admin users (e.g., from Admin panel)
    if (user.roles && user.roles.some(r => r.code === 'strapi-super-admin' || r.code === 'strapi-editor')) {
      return true;
    }
  
    // If using Users-permissions plugin (from `/auth/local`), check their role
    if (user.role && user.role.type === 'admin') {
      return true;
    }
  
    return false;
  };
  