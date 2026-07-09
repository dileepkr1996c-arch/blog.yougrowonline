(function() {
  function init() {
    var toolsContainer = document.getElementById('sidebarTools');
    var postsContainer = document.getElementById('sidebarPosts');
    if (!toolsContainer && !postsContainer) return;

    if (toolsContainer) {
      fetch('/tools/tools-master.json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var allTools = [];
          Object.keys(data.tools || {}).forEach(function(catKey) {
            (data.tools[catKey] || []).forEach(function(t) {
              if (t.link && t.link !== '#') {
                allTools.push({ title: t.title, link: t.link });
              }
            });
          });
          var shuffled = allTools.sort(function() { return 0.5 - Math.random(); });
          var picked = shuffled.slice(0, 10);
          var html = '';
          picked.forEach(function(t) {
            html += '<li><a href="' + t.link + '">' + t.title + '</a></li>';
          });
          toolsContainer.innerHTML = html;
        })
        .catch(function() {
          toolsContainer.innerHTML = '<li><a href="/tools/">Browse all tools</a></li>';
        });
    }

    if (postsContainer) {
      var posts = [
        { title: 'How to Start an Ecommerce Business in 2026', url: '/blog/' },
        { title: 'SEO Trends 2026: What You Need to Know', url: '/blog/' },
        { title: 'Web Development vs No-Code: Which Is Right?', url: '/blog/' },
        { title: 'Google Ads for Small Business: A Complete Guide', url: '/blog/' },
        { title: 'Digital Marketing ROI: The Ultimate Guide', url: '/blog/' },
        { title: 'Top 10 Web Design Trends for 2026', url: '/blog/' },
        { title: 'How to Build a Brand Identity from Scratch', url: '/blog/' },
        { title: 'Facebook Ads vs Google Ads: Which is Better?', url: '/blog/' },
        { title: 'Complete Guide to Website Accessibility', url: '/blog/' },
        { title: 'Ecommerce SEO: Drive More Traffic to Your Store', url: '/blog/' },
        { title: 'AI-Powered Marketing: Tools and Strategies', url: '/blog/' },
        { title: 'How to Choose the Right Web Development Partner', url: '/blog/' }
      ];
      var shuffled = posts.sort(function() { return 0.5 - Math.random(); });
          var picked = shuffled.slice(0, 10);
      var html = '';
      picked.forEach(function(p) {
        html += '<li><a href="' + p.url + '">' + p.title + '</a></li>';
      });
      postsContainer.innerHTML = html;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
