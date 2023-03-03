export const aboutController = {
  index:{
    handler: function (request, h){
      return h.view("about-view", {title: "Welcome to About Page"});
    },
  },
};