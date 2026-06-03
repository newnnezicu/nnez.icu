'use strict';

const pagination = require('hexo-pagination');

hexo.config.index_generator = Object.assign({
  per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
  order_by: '-date'
}, hexo.config.index_generator);

hexo.extend.generator.register('index', function(locals) {
  const config = this.config;
  let posts = locals.posts.filter(post => {
      return !post.is_old || post.title === '补档声明';
  });
  
  let sortedPosts = posts.toArray().sort(function(a, b) {
      const topA = a.top || a.sticky || 0;
      const topB = b.top || b.sticky || 0;
      if (topA !== topB) {
          return topB - topA;
      }
      const dateA = a.date ? a.date.valueOf() : 0;
      const dateB = b.date ? b.date.valueOf() : 0;
      return dateB - dateA;
  });
  
  console.log("Filtered posts length:", sortedPosts.length);
  if (sortedPosts.length > 0) {
      console.log("Top 5 posts:");
      for(let i=0; i<Math.min(5, sortedPosts.length); i++){
          console.log(i, sortedPosts[i].title);
      }
  }
  
  const paginationDir = config.pagination_dir || 'page';
  const path = config.index_generator.path || '';

  return pagination(path, sortedPosts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
});
